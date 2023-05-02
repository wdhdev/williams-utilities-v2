const emoji = require("../../config.json").emojis;
const schema = require("../../models/logsSchema");

module.exports = {
    name: "logs",
    description: "Set the logs channel for the guild",
    aliases: ["logging", "modlogs"],
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const channel = message.mentions.channels.first();

            if(args[0] === "reset") {
                schema.findOne({ _id: message.guild.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        await schema.findOneAndDelete({ _id: message.guild.id });

                        const disabled = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} Turned off logging!`)

                        message.reply({ embeds: [disabled] });
                    }

                    if(!data) {
                        const noLogChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a logging channel set!`)

                        message.reply({ embeds: [noLogChannel] });
                    }
                })
                return;
            }

            if(!channel) {
                schema.findOne({ _id: message.guild.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        const logChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.information} The guild log channel is: <#${data.channel}>`)

                        message.reply({ embeds: [logChannel] });
                    }

                    if(!data) {
                        const noLogChannel = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a logging channel set!`)

                        message.reply({ embeds: [noLogChannel] });
                    }
                })
                return;
            }

            if(channel.type !== Discord.ChannelType.GuildText) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You can only use a text channel for logging!`)

                message.reply({ embeds: [error] });
                return;
            }

            schema.findOne({ _id: message.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: message.guild.id }, { channel: channel.id });

                    await data.save();
                }

                if(!data) {
                    data = new schema({
                        _id: message.guild.id,
                        channel: channel.id
                    })

                    await data.save();
                }

                const logsSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} The guild logs channel has been set to: ${channel}`)

                message.reply({ embeds: [logsSet] });

                const logChannel = client.channels.cache.get(channel.id);

                const setup = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.information} This channel has been setup for logging.`)

                logChannel.send({ embeds: [setup] });
            })
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}
