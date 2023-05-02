const emoji = require("../../config.json").emojis;

module.exports = {
    name: "shutdown",
    description: "Shutdown the bot",
    botPermissions: [],
    enabled: true,
    guildOnly: true,
    ownerOnly: true,
    async execute(interaction, client, Discord) {
        try {
            console.log(`Shutdown initiated by: ${interaction.user.id}`);
            console.log("Shutting down...");

            const channel = client.channels.cache.get(client.config_default.logChannel);

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.shutdown)
                .setTitle("Status")
                .setDescription(`${emoji.dnd} Shutting down...`)
                .addFields (
                    { name: "Requested By", value: `${interaction.user.tag} | \`${interaction.user.id}\`` },
                )
                .setTimestamp()

            await channel.send({ embeds: [log] });

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.shutdown)
                .setDescription(`${emoji.dnd} Shutting down...`)

            await interaction.editReply({ embeds: [info] })
                .then(() => process.exit());
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}