const { flip } = require("easyscriptjs");

module.exports = {
    name: "coinflip",
    description: "Flip a coin",
    aliases: ["coin", "flip"],
    category: "fun",
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const res = flip();

            const result = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`:coin: The coin landed on ${res}.`)

            message.reply({ embeds: [result] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}