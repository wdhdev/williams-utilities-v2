const emoji = require("../../config.json").emojis;

module.exports = {
    name: "reset",
    description: "Reset the bot to the default settings",
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            async function reset() {
                const joinSchema = require("../../models/joinSchema");
                await joinSchema.findOneAndDelete({ _id: interaction.guild.id });

                const leaveSchema = require("../../models/leaveSchema");
                await leaveSchema.findOneAndDelete({ _id: interaction.guild.id });

                const logSchema = require("../../models/logsSchema");
                await logSchema.findOneAndDelete({ _id: interaction.guild.id });

                const prefixSchema = require("../../models/prefixSchema");
                await prefixSchema.findOneAndDelete({ _id: interaction.guild.id });

                const warnSchema = require("../../models/warnSchema");
                await warnSchema.findOneAndDelete({ _id: interaction.guild.id });
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

            await interaction.editReply({ embeds: [warning], components: [confirm] })
                .then(int => {
                    const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });

                    collector.on("collect", async i => {
                        if(i.user.id !== interaction.user.id) {
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

                            int.edit({ embeds: [cancelled], components: [] });
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
                            if(i.user.id !== interaction.user.id) {
                                return;
                            } else {
                                validInteractions.push(i.user.id);
                            }
                        })

                        if(validInteractions.length == 0) {
                            const cancelled = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} Operation cancelled.`)

                            int.edit({ embeds: [cancelled], components: [] });
                        }
                    })
                })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}