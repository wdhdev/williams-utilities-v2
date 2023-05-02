module.exports = {
	name: "messageUpdate",
	execute(client, Discord, oldMessage, newMessage) {
        try {
            if(
                oldMessage.author.bot
                || oldMessage.partial
                || newMessage.partial
                || oldMessage.embeds.length
                || newMessage.embeds.length
            ) return;

            const snipe = {
                author: oldMessage.author,
                changedAt: newMessage.editedTimestamp,
                channel: oldMessage.channel,
                id: oldMessage.id,
                image: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
                newContent: newMessage.content,
                oldContent: oldMessage.content,
                type: "Message Updated",
                url: oldMessage.url
            }

            client.snipes.set(oldMessage.channel.id, snipe);
            client.editSnipes.set(oldMessage.channel.id, snipe);

            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!oldMessage.guild.members.me.permissions.has(requiredPerms)) return;

            const logsSchema = require("../../models/logsSchema");

            logsSchema.findOne({ _id: oldMessage.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = oldMessage.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await schema.findOneAndDelete({ _id: oldMessage.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL({ format: "png", dynamic: true }) })
                        .setTitle("Message Updated")
                        .setURL(oldMessage.url)
                        .addFields (
                            { name: "Before", value: oldMessage.content },
                            { name: "After", value: newMessage.content },
                            { name: "Channel", value: `<#${oldMessage.channel.id}>` }
                        )
                        .setImage(oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null)
                        .setTimestamp(newMessage.editedTimestamp)

                    channel.send({ embeds: [log] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}