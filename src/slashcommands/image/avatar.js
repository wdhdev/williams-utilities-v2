module.exports = {
    name: "avatar",
    description: "Get a user's avatar",
    category: "image",
    options: [
        {
            type: 6,
            name: "member",
            description: "Get a member's avatar."
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const member = interaction.options.getUser("member") || interaction.user;
            const url = member.displayAvatarURL({ format: "png", dynamic: true });

            const button = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Link")
                        .setURL(url)
                )

            await interaction.editReply({ content: `${url}`, components: [button] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}