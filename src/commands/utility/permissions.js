const emoji = require("../../config.json").emojis;

module.exports = {
    name: "permissions",
    description: "Check if the bot has the required permissions",
    aliases: ["perms", "checkperms"],
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const permissions = {
                ManageChannels: "Manage Channels",
                ManageEmojisAndStickers: "Manage Emojis and Stickers",
                ManageWebhooks: "Manage Webhooks",
                ViewChannel: "Read Messages/View Channels",
                SendMessages: "Send Messages",
                ManageMessages: "Manage Messages",
                EmbedLinks: "Embed Links",
                ReadMessageHistory: "Read Message History",
                AddReactions: "Add Reactions",
                UseExternalEmojis: "Use External Emojis"
            }

            const perms = [];

            for(const perm of Object.keys(permissions)) {
                if(message.guild.members.me.permissions.has(perm)) {
                    perms.push(`${emoji.successful} ${permissions[perm]}`);
                } else {
                    perms.push(`${emoji.error} ${permissions[perm]}`);
                }
            }

            const permissionsEmbed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Permissions")
                .setDescription(perms.join("\n"))

            const inviteButton = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Invite")
                        .setURL("https://bot.williamharrison.dev/invite")
                )

            message.reply({ embeds: [permissionsEmbed], components: [inviteButton] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}