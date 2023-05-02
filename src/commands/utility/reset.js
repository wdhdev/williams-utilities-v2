const emoji = require("../../config.json").emojis;

module.exports = {
    name: "reset",
    description: "Reset the bot to the default settings",
    aliases: [],
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            async function reset() {
                const joinSchema = require("../../models/joinSchema");
                await joinSchema.findOneAndDelete({ _id: message.guild.id });

                const leaveSchema = require("../../models/leaveSchema");
                await leaveSchema.findOneAndDelete({ _id: message.guild.id });

                const logSchema = require("../../models/logsSchema");
                await logSchema.findOneAndDelete({ _id: message.guild.id });

                const prefixSchema = require("../../models/prefixSchema");
                await prefixSchema.findOneAndDelete({ _id: message.guild.id });

                const warnSchema = require("../../models/warnSchema");
                await warnSchema.findOneAndDelete({ _id: message.guild.id });
            }

            const warning = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Reset")
                .setDescription("Are you sure you want to delete all of the bot's data for this guild?\n**This cannot be undone!**\n\nIf no response is received within \`30\` seconds, the operation will be cancelled.")

            const confirm = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setCustomId("confirm")
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel("Confirm"),

                    new Discord.ButtonBuilder()
                        .setCustomId("cancel")
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                )

            message.reply({ embeds: [warning], components: [confirm] })
                .then(msg => {
                    const collector = message.channel.createMessageComponentCollector({ time: 30000 });

                    collector.on("collect", async i => {
                        if(i.user.id !== message.author.id) {
                            const error = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} You cannot use this button!`)

                            i.reply({ embeds: [error], ephemeral: true });
                            return;
                        }

                        await i.deferUpdate();

                        if(i.customId === "cancel") {
                            await collector.stop();

                            const cancelled = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} Operation cancelled.`)

                            msg.edit({ embeds: [cancelled], components: [] });
                            return;
                        }

                        if(i.customId === "confirm") {
                            await collector.stop();

                            await reset();

                            const done = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.default)
                                .setDescription(`${emoji.successful} All data has been purged from the bot's database.`)

                            await i.editReply({ embeds: [done], components: [] });
                        }
                    })

                    collector.on("end", async collected => {
                        let validInteractions = [];

                        collected.forEach(i => {
                            if(i.user.id !== message.author.id) {
                                return;
                            } else {
                                validInteractions.push(i.user.id);
                            }
                        })

                        if(validInteractions.length == 0) {
                            const cancelled = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} Operation cancelled.`)

                            msg.edit({ embeds: [cancelled], components: [] });
                        }
                    })
                })
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}