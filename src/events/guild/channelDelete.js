module.exports = {
    name: "channelDelete",
    async execute(client, Discord, channel) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!channel.guild.members.me.permissions.has(requiredPerms)) return;

            const schema = require("../../models/logsSchema");

            schema.findOne({ _id: channel.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const logChannel = channel.guild.channels.cache.get(data.channel);

                    if(!logChannel) {
                        await schema.findOneAndDelete({ _id: channel.guild.id });
                        return;
                    }

                    const nsfw = {
                        false: "False",
                        true: "True"
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("Channel Deleted")
                        .addFields (
                            { name: "Name", value: channel.name },
                            { name: "ID", value: `\`${channel.id}\`` },
                            { name: "Type", value: `\`${channel.type}\`` },
                            { name: "NSFW", value: `${nsfw[channel.nsfw]}` }
                        )
                        .setTimestamp()

                    logChannel.send({ embeds: [log] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}