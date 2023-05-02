const emoji = require("../../config.json").emojis;

module.exports = {
    name: "hello",
    description: "Says hello",
    aliases: ["hi"],
    category: "fun",
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            message.reply(`${emoji.wave} Hello, ${message.author}!`);
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}