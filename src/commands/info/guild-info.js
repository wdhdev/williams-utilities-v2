const emoji = require("../../config.json").emojis;
const moment = require("moment");

module.exports = {
    name: "guild-info",
    description: "Shows information about the guild",
    aliases: ["guildinfo", "serverinfo", "guild", "server"],
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const guild = message.guild;

            const owner = await guild.fetchOwner();
            await guild.channels.fetch();

            const channels = guild.channels.cache;
            const roles = guild.roles.cache.sort((a,b) => b.position - a.position).map(role => role.toString());
            const emojis = guild.emojis.cache;

            let description = guild.description;

            if(!description) {
                description = "N/A";
            }

            const verificationLevels = {
                0: `${emoji.offline} None`,
                1: `${emoji.online} Low`,
                2: `${emoji.idle} Medium`,
                3: `${emoji.dnd} High`,
                4: `${emoji.dnd} Very High`
            }

            const filterLevels = {
                0: `${emoji.offline} Disabled`,
                1: `${emoji.idle} Members without Roles`,
                2: `${emoji.dnd} All Members`
            }

            const boosts_none = {
                0: "`0` Boosts",
                1: "`1` Boost",
                2: "`2` Boosts"
            }

            const boosts = {
                0: `${boosts_none[guild.premiumSubscriptionCount]}`,
                1: `${emoji.boost_tier_1} \`${guild.premiumSubscriptionCount}\` Boosts`,
                2: `${emoji.boost_tier_2} \`${guild.premiumSubscriptionCount}\` Boosts`,
                3: `${emoji.boost_tier_3} \`${guild.premiumSubscriptionCount}\` Boosts`,
            }

            let rolemap = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r);
            let serverRoles = `This server has \`${message.guild.roles.size}\` roles.\n\n${rolemap.join(", ")}`;

            if(message.guild.roles.size = 1) {
                serverRoles = `This server has \`${message.guild.roles.size}\` role.\n\n${rolemap.join(", ")}`;
            }

            if(rolemap.length > 1024) {
                rolemap = `This server has \`${message.guild.roles.size}\` roles.`
            }

            if(!rolemap) {
                rolemap = "*This server has no roles.*"
            }

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
                .setTitle("Guild Information")
                .addFields (
                    { name: "Name", value: guild.name, inline: true },
                    { name: "Description", value: description, inline: true },
                    { name: "\u200B", value: "\u200B", inline: true },
                    { name: "ID", value: `\`${guild.id}\``, inline: true },
                    { name: "Created", value: `<t:${Math.floor(moment(guild.createdTimestamp) / 1000)}:f>`, inline: true },
                    { name: "\u200B", value: "\u200B", inline: true },
                    { name: "Owner", value: `[${owner.user.tag}](https://discord.com/users/${guild.ownerId}) | \`${owner.user.id}\``, inline: true }
                )

            const security = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Security")
                .addFields (
                    { name: "Verification Level", value: `${verificationLevels[guild.verificationLevel]}`, inline: true },
                    { name: "\u200B", value: "\u200B", inline: true },
                    { name: "Explicit Content Filter", value: `${filterLevels[guild.explicitContentFilter]}`, inline: true }
                )

            const stats = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Statistics")
                .addFields (
                    { name: "Member Count", value: `Total: \`${guild.memberCount}\`\nHumans: \`${guild.members.cache.filter(member => !member.user.bot).size}\`\nBots: \`${guild.members.cache.filter(member => member.user.bot).size}\``, inline: true },
                    { name: "Boosts", value: boosts[guild.premiumTier], inline: true },
                    { name: "\u200B", value: "\u200B", inline: true },
                    { name: "Channels", value: `${emoji.announcement_channel} Announcement: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildNews).size}\`\n${emoji.stage_channel} Stage: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildStageVoice).size}\`\n${emoji.nsfw_channel} NSFW: \`${channels.filter(channel => channel.nsfw).size}\`\n${emoji.text_channel} Text: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildText).size}\`\n${emoji.text_channel} Public Threads: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildPublicThread).size}\`\n${emoji.private_text_channel} Private Threads: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildPublicThread).size}\`\n${emoji.voice_channel} Voice: \`${channels.filter(channel => channel.type === Discord.ChannelType.GuildVoice).size}\``, inline: true },
                    { name: "Emojis", value: `Total: \`${emojis.size}\`\nRegular: \`${emojis.filter(emoji => !emoji.animated).size}\`\nAnimated: \`${emojis.filter(emoji => emoji.animated).size}\``, inline: true },
                    { name: "\u200B", value: "\u200B", inline: true },
                    { name: "Roles", value: rolemap, inline: true }
                )

            message.reply({ embeds: [info, security, stats] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}