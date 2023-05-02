const { flip } = require("easyscriptjs");

module.exports = {
    name: "coinflip",
    description: "Flip a coin",
    category: "fun",
    options: [],
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const res = flip();

            const result = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`:coin: The coin landed on ${res}.`)

            await interaction.editReply({ embeds: [result] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}