const emoji = require("../../config.json").emojis;
const schema = require("../../models/logsSchema");

module.exports = {
    name: "logs",
    description: "Set the logs channel for the guild",
    category: "utility",
    options: [
        {
            type: 7,
            name: "channel",
            description: "Change the logging channel.",
            channel_types: [0, 5],
        },

        {
            type: 5,
            name: "reset",
            description: "Turn off logging."
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
            const channel = interaction.options.getChannel("channel");
            const reset = interaction.options.getBoolean("reset");

            if(reset) {
                schema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        await schema.findOneAndDelete({ _id: interaction.guild.id });

                        const disabled = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} Turned off logging!`)

                        await interaction.editReply({ embeds: [disabled] });
                    }

                    if(!data) {
                        const noLogChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a logging channel set!`)

                        await interaction.editReply({ embeds: [noLogChannel] });
                    }
                })
                return;
            }

            if(!channel) {
                schema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        const logChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.information} The guild log channel is: <#${data.channel}>`)

                        await interaction.editReply({ embeds: [logChannel] });
                    }

                    if(!data) {
                        const noLogChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a logging channel set!`)

                        await interaction.editReply({ embeds: [noLogChannel] });
                    }
                })
                return;
            }

            if(channel.type !== Discord.ChannelType.GuildText) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You can only use a text channel for logging!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            schema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: interaction.guild.id }, { channel: channel.id });

                    await data.save();
                }

                if(!data) {
                    data = new schema({
                        _id: interaction.guild.id,
                        channel: channel.id
                    })

                    await data.save();
                }

                const logsSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} The guild logs channel has been set to: ${channel}`)

                await interaction.editReply({ embeds: [logsSet] });

                const logChannel = client.channels.cache.get(channel.id);

                const setup = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.information} This channel has been setup for logging.`)

                logChannel.send({ embeds: [setup] });
            })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}