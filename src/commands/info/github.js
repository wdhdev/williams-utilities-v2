module.exports = {
    name: "github",
    description: "Sends a link to the bot's GitHub repository",
    aliases: ["gh", "source", "code"],
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
                        .setLabel("GitHub")
                        .setURL("https://github.com/williamsutilities/bot")
                )

            message.reply({ components: [button] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}