module.exports = {
	name: "messageDelete",
	execute(client, Discord, message) {
        try {
            if(
                message.author.bot
                || message.partial
                || (message.embeds.length && !message.content)
            ) return;

            const snipe = {
                author: message.author,
                channel: message.channel,
                content: message.content,
                createdAt: message.createdAt,
                image: message.attachments.first() ? message.attachments.first().proxyURL : null,
                type: "Message Deleted"
            }

            client.snipes.set(message.channel.id, snipe);
            client.deleteSnipes.set(message.channel.id, snipe);

            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            const schema = require("../../models/logsSchema");

            schema.findOne({ _id: message.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = message.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await schema.findOneAndDelete({ _id: message.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${message.author.id}` })
                        .setTitle("Message Deleted")
                        .addFields (
                            { name: "Channel", value: `<#${message.channel.id}>` }
                        )
                        .setTimestamp()

                    if(message.content) {
                        log.setDescription(message.content);
                    }

                    if(message.attachments.size > 0) {
                        let attachments = [];

                        message.attachments.forEach(attachment => {
                            const url = attachment.url;

                            if(url) {
                                let links = [url];

                                links.forEach(function (link) {
                                    attachments.push(link);
                                })
                            }
                        })

                        const attachmentsLog = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setTitle("Attachments")
                            .setDescription(attachments.join("\n\n"))

                        channel.send({ embeds: [log, attachmentsLog] });
                        return;
                    }

                    channel.send({ embeds: [log] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}