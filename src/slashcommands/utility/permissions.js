const emoji = require("../../config.json").emojis;

module.exports = {
    name: "permissions",
    description: "Check if the bot has the required permissions",
    category: "utility",
    options: [],
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
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
                if(interaction.guild.members.me.permissions.has(perm)) {
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

            await interaction.editReply({ embeds: [permissionsEmbed], components: [inviteButton] })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}