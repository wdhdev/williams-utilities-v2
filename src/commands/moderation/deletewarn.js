const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "deletewarn",
    description: "Remove a warn from user",
    aliases: ["delwarn", "removewarn", "rmwarn"],
    category: "moderation",
    userPermissions: ["ManageMessages"],
    botPermissions: [],
    cooldown: 10,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first();
            const warnId = args[1];

            if(!member || member.user.bot) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a member!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(member.id === message.author.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot delete your own warnings!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(!warnId) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a warning ID!`)

                message.reply({ embeds: [error] });
                return;
            }

            const warn = await warnSchema.findOneAndDelete({
                id: warnId,
                guild: message.guild.id,
                member: member.id
            })

            if(!warn) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please provide a valid warning ID!`)

                message.reply({ embeds: [error] });
                return;
            }

            await warn.delete();

            const date = Date.parse(Date());
            const timestamp = date / 1000;

            logsSchema.findOne({ _id: message.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = message.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await logsSchema.findOneAndDelete({ _id: message.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTitle("Warning Deleted")
                        .addFields (
                            { name: "ID", value: warnId },
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${message.author} | \`${message.author.id}\`` },
                            { name: "Reason", value: warn.reason },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const removed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Deleted warning \`${warnId}\`!`)

            message.reply({ embeds: [removed] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}