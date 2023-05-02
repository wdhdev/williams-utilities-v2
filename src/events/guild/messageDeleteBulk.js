module.exports = {
	name: "messageDeleteBulk",
	execute(client, Discord, messages) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!messages.first().guild.members.me.permissions.has(requiredPerms)) return;

            const hastebin = require("hastebin-gen");
            const moment = require("moment");

            const amount = messages.size;
            const channel = messages.first().channel;
            const time = `${moment.utc(Date.now()).format("DD/MM/YYYY h:mm:ss a")} UTC`;

            const schema = require("../../models/logsSchema");

            schema.findOne({ _id: messages.first().guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const logChannel = messages.first().guild.channels.cache.get(data.channel);

                    if(!logChannel) {
                        await schema.findOneAndDelete({ _id: messages.first().guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("Bulk Delete")
                        .setDescription(`\`${amount}\` messages were deleted in <#${channel.id}>.`)
                        .setTimestamp()

                    try {
                        await hastebin(`${time}\n${amount} messages were deleted in #${channel.name} (${channel.id}).\n\n${messages.map(message => `[${moment.utc(message.createdAt).format("DD/MM/YYYY h:mm:ss a")}] ${message.author.tag} (${message.author.id}): ${message.content}`).join("\n")}`, { url: "https://logs.bot.williamharrison.dev", extension: "txt" })
                            .then(haste => {
                                const button = new Discord.ActionRowBuilder()
                                    .addComponents (
                                        new Discord.ButtonBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("Messages")
                                            .setURL(haste)
                                    )

                                logChannel.send({ embeds: [log], components: [button] });
                            })
                    } catch(err) {
                        logChannel.send({ embeds: [log] });
                    }
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}
