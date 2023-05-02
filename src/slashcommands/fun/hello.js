const emoji = require("../../config.json").emojis;

module.exports = {
    name: "hello",
    description: "Says hello",
    category: "fun",
    options: [],
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            await interaction.editReply(`${emoji.wave} Hello, ${interaction.member}!`);
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}