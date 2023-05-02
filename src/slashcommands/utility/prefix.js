const emoji = require("../../config.json").emojis;
const schema = require("../../models/prefixSchema");

module.exports = {
    name: "prefix",
    description: "Change the guild prefix",
    category: "utility",
    options: [
        {
            type: 3,
            name: "new",
            description: "Change the guild prefix."
        }
    ],
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const prefix = await client.prefix(interaction);
            const newPrefix = interaction.options.getString("new");

            if(!newPrefix) {
                const guildPrefix = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.information} My prefix here is: \`${prefix}\``)

                await interaction.editReply({ embeds: [guildPrefix] });
                return;
            }

            if(newPrefix === "reset" || newPrefix === client.config_default.prefix) {
                schema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                    if(err) {
                        console.log(err);
                    }

                    if(data) {
                        await schema.findOneAndDelete({ _id: interaction.guild.id });

                        const prefixReset = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} The guild prefix has been reset to the default prefix: \`${client.config_default.prefix}\``)

                        await interaction.editReply({ embeds: [prefixReset] });
                    }

                    if(!data) {
                        const noCustomPrefix = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a custom prefix!`)

                        await interaction.editReply({ embeds: [noCustomPrefix] });
                    }
                })
                return;
            }

            if(newPrefix.length > 5) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The new prefix can not be longer than \`5\` characters!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(newPrefix === "/") {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The new prefix can not set to \`/\`!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            schema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: interaction.guild.id }, { prefix: newPrefix });

                    await data.save();

                }

                if(!data) {
                    data = new schema({
                        _id: interaction.guild.id,
                        prefix: newPrefix
                    })

                    await data.save();
                }
            })

            const prefixSet = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} The guild prefix has been set to: \`${newPrefix}\``)

            await interaction.editReply({ embeds: [prefixSet] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}