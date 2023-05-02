const emoji = require("../../config.json").emojis;
const schema = require("../../models/warnSchema");

module.exports = {
    name: "warnings",
    description: "See warnings for a user",
    category: "moderation",
    options: [
        {
            type: 6,
            name: "member",
            description: "Member who's warnings to see"
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const member = interaction.options.getUser("member") || interaction.user;

            if(!interaction.member?.permissions.has("ManageMessages")) {
                schema.find({
                    guild: interaction.guild.id,
                    member: interaction.user.id
                }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(!data.length) {
                        const noWarnings = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} You have no warnings!`)

                        await interaction.editReply({ embeds: [noWarnings] });
                        return;
                    }

                    const warnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${interaction.user.id}` })
                        .setTitle("Warnings")

                    data.forEach(warning => {
                        warnings.addFields (
                            { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\nReason: \`${warning.reason}\`` }
                        )
                    })

                    await interaction.editReply({ embeds: [warnings] });
                })
                return;
            }

            if(member.id === interaction.user.id) {
                schema.find({
                    guild: interaction.guild.id,
                    member: interaction.user.id
                }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(!data.length) {
                        const noWarnings = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} You have no warnings!`)

                        await interaction.editReply({ embeds: [noWarnings] });
                        return;
                    }

                    const warnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${interaction.user.id}` })
                        .setTitle("Warnings")

                    data.forEach(warning => {
                        warnings.addFields (
                            { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\n\nModerator: ${interaction.guild.members.cache.get(warning.moderator) || "Unknown"}\nReason: \`${warning.reason}\`` }
                        )
                    })

                    await interaction.editReply({ embeds: [warnings] });
                })
                return;
            }

            // Check others warnings
            schema.find({
                guild: interaction.guild.id,
                member: member.id,
            }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(!data.length) {
                    const noWarnings = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} ${member} has no warnings!`)

                    await interaction.editReply({ embeds: [noWarnings] });
                    return;
                }

                const warnings = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${member.id}` })
                    .setTitle("Warnings")

                data.forEach(warning => {
                    warnings.addFields (
                        { name: `ID: ${warning.id}`, value: `<t:${warning.timestamp}:f>\n\nModerator: ${interaction.guild.members.cache.get(warning.moderator) || "Unknown"}\nReason: \`${warning.reason}\`` }
                    )
                })

                await interaction.editReply({ embeds: [warnings] });
            })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}