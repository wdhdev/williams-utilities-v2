module.exports = {
	name: "emojiCreate",
	execute(client, Discord, emoji) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!emoji.guild.members.me.permissions.has(requiredPerms)) return;

            const schema = require("../../models/logsSchema");

            schema.findOne({ _id: emoji.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = emoji.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await schema.findOneAndDelete({ _id: emoji.guild.id });
                        return;
                    }

                    let animated;

                    if(emoji.animated === true) {
                        animated = "Yes";
                    } else {
                        animated = "No";
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("Emoji Created")
                        .setThumbnail(emoji.url)
                        .addFields (
                            { name: "Name", value: emoji.name },
                            { name: "ID", value: `\`${emoji.id}\`` },
                            { name: "Usage", value: `\`<:${emoji.name}:${emoji.id}>\`` },
                            { name: "Animated", value: animated }
                        )
                        .setTimestamp()

                    const button = new Discord.ActionRowBuilder()
                        .addComponents (
                            new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel("Image")
                                .setURL(emoji.url)
                        )

                    channel.send({ embeds: [log], components: [button] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}