module.exports = {
    name: "github",
    description: "Sends a link to the bot's GitHub repository",
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const button = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("GitHub")
                        .setURL("https://github.com/williamsutilities/bot")
                )

            await interaction.editReply({ components: [button] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}