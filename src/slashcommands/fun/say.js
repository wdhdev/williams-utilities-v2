const emoji = require("../../config.json").emojis;

module.exports = {
    name: "say",
    description: "Say something as the bot",
    category: "fun",
    options: [
        {
            type: 3,
            name: "message",
            description: "Message to send as the bot",
            required: true
        }
    ],
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageChannels", "ManageWebhooks"],
    cooldown: 10,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const message = interaction.options.getString("message");

            await interaction.channel.send({ content: `${message}`, allowedMentions: { parse: [] } });

            const sent = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Sent the message!`)

            await interaction.editReply({ embeds: [sent] })
                .then(() => {
                    interaction.deleteReply();
                })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}