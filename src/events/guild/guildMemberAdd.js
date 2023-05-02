module.exports = {
    name: "guildMemberAdd",
    async execute(client, Discord, member) {
        try {
            if(client.user.id === member.id) {
                return;
            }

            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!member.guild.members.me.permissions.has(requiredPerms)) return;

            const logsSchema = require("../../models/logsSchema");
            const moment = require("moment");

            logsSchema.findOne({ _id: member.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = member.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await logsSchema.findOneAndDelete({ _id: member.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${member.id}` })
                        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTitle("Member Joined")
                        .addFields (
                            { name: "Username", value: `[${member.user.tag}](https://discord.com/users/${member.id}) | \`${member.id}\`` },
                            { name: "Account Created", value: `<t:${Math.floor(moment(member.user.createdAt) / 1000)}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const joinSchema = require("../../models/joinSchema");

            joinSchema.findOne({ _id: member.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = member.guild.channels.cache.get(data.channel);
                    const msg = data.message.replace(/{member}/g, `<@${member.id}>`).replace(/{guild}/g, `${member.guild.name}`);

                    if(!channel) {
                        await joinSchema.findOneAndDelete({ _id: member.guild.id });
                        return;
                    }

                    const message = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(msg)

                    channel.send({ content: `${member}`, embeds: [message] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}