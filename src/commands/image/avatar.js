module.exports = {
    name: "avatar",
    description: "Get a user's avatar",
    aliases: ["av", "pfp"],
    category: "image",
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first() || message.author;
            const url = member.displayAvatarURL({ format: "png", dynamic: true });

            const button = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Link")
                        .setURL(url)
                )

            message.reply({ content: `${url}`, components: [button] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}