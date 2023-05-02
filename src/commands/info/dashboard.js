module.exports = {
    name: "dashboard",
    description: "Sends a link to the bot's dashboard",
    aliases: ["dash", "website"],
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const button = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Dashboard")
                        .setURL("https://bot.williamharrison.dev")
                )

            message.reply({ components: [button] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}