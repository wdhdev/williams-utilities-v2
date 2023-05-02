const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "clearwarnings",
    description: "Clear all of the warnings from a user",
    aliases: ["clearwarns"],
    category: "moderation",
    userPermissions: ["ManageMessages"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first();

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
                    .setDescription(`${emoji.error} You cannot clear your own warnings!`)

                message.reply({ embeds: [error] });
                return;
            }

            const warns = await warnSchema.find({
                guild: message.guild.id,
                member: member.id
            })

            if(!warns.length) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} ${member} has no warnings!`)

                message.reply({ embeds: [error] });
                return;
            }

            warns.forEach(warn => {
                warn.delete();
            })

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
                        .setTitle("Warnings Cleared")
                        .setDescription("All of the warnings for this user were deleted.")
                        .addFields (
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${message.author} | \`${message.author.id}\`` },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const cleared = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Cleared all warnings from ${member}!`)

            message.reply({ embeds: [cleared] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}