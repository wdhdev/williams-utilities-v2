const emoji = require("../../config.json").emojis;
const schema = require("../../models/warnSchema");

module.exports = {
    name: "warnings",
    description: "See warnings for a user",
    aliases: ["warns"],
    category: "moderation",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            let member = message.mentions.members.first() || message.author;

            if(!message.member.permissions.has("ManageMessages")) {
                schema.find({
                    guild: message.guild.id,
                    member: message.author.id
                }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(!data.length) {
                        const noWarnings = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} You have no warnings!`)

                        message.reply({ embeds: [noWarnings] });
                        return;
                    }

                    const warnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${message.author.id}` })
                        .setTitle("Warnings")

                    data.forEach(warning => {
                        warnings.addFields (
                            { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\nReason: \`${warning.reason}\`` }
                        )
                    })

                    message.reply({ embeds: [warnings] });
                })
                return;
            }

            if(member.id === message.author.id) {
                schema.find({
                    guild: message.guild.id,
                    member: message.author.id
                }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(!data.length) {
                        const noWarnings = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} You have no warnings!`)

                        message.reply({ embeds: [noWarnings] });
                        return;
                    }

                    const warnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${message.author.id}` })
                        .setTitle("Warnings")

                    data.forEach(warning => {
                        warnings.addFields (
                            { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\n\nModerator: ${message.guild.members.cache.get(warning.moderator) || "Unknown"}\nReason: \`${warning.reason}\`` }
                        )
                    })

                    message.reply({ embeds: [warnings] });
                })
                return;
            }

            // Check others warnings
            schema.find({
                guild: message.guild.id,
                member: member.id,
            }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(!data.length) {
                    const noWarnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} ${member} has no warnings!`)

                    message.reply({ embeds: [noWarnings] });
                    return;
                }

                const warnings = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${member.id}` })
                    .setTitle("Warnings")

                data.forEach(warning => {
                    warnings.addFields (
                        { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\n\nModerator: ${message.guild.members.cache.get(warning.moderator) || "Unknown"}\nReason: \`${warning.reason}\`` }
                    )
                })

                message.reply({ embeds: [warnings] });
            })
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}