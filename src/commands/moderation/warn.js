const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "warn",
    description: "Warn a user",
    aliases: ["warning"],
    category: "moderation",
    userPermissions: ["ManageMessages"],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first();
            const reason = args.slice(1).join(" ");

            if(!member) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a member to warn!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(member.user.bot) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot warn bots!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(member.id === message.author.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot warn yourself!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(!reason) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a reason!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(reason.length > 256) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The reason must be less than \`256\` characters!`)

                message.reply({ embeds: [error] });
                return;
            }

            const nanoId = require("nanoid");

            const alphabet = "123456789";
            const generateId = nanoId.customAlphabet(alphabet, 16);

            const warnId = generateId();

            const date = Date.parse(Date());
            const timestamp = date / 1000;

            const newWarn = new warnSchema({
                id: warnId,
                guild: message.guild.id,
                member: member.id,
                moderator: message.author.id,
                reason,
                timestamp
            })

            await newWarn.save();

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
                        .setColor(client.config_embeds.default)
                        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTitle("Warning")
                        .addFields (
                            { name: "ID", value: warnId },
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${message.author} | \`${message.author.id}\`` },
                            { name: "Reason", value: reason },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const warn = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ format: "png", dynamic: true }) })
                .setTitle("Warning")
                .addFields (
                    { name: "ID", value: warnId },
                    { name: "Guild", value: `${message.guild.name} | \`${message.guild.id}\`` },
                    { name: "Moderator", value: `${message.author.tag} | \`${message.author.id}\`` },
                    { name: "Reason", value: reason },
                    { name: "Timestamp", value: `<t:${timestamp}:f>` }
                )
                .setTimestamp()

            try {
                await member.send({ embeds: [warn] });
            } catch(err) {
                const warned = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Warning")
                    .setDescription(`${emoji.successful} ${member} has been warned!\n\n**ID**: \`${warnId}\``)
                    .setFooter({ text: "I couldn't DM them." })
                    .setTimestamp()

                message.reply({ embeds: [warned] });
                return;
            }

            const warned = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Warning")
                .setDescription(`${emoji.successful} ${member} has been warned!\n\n**ID**: \`${warnId}\``)
                .setTimestamp()

            message.reply({ embeds: [warned] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}