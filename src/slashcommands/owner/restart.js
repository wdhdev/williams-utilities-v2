const emoji = require("../../config.json").emojis;

module.exports = {
    name: "restart",
    description: "Restart the bot",
    botPermissions: [],
    enabled: true,
    guildOnly: true,
    ownerOnly: true,
    async execute(interaction, client, Discord) {
        try {
            console.log(`Restart initiated by: ${interaction.user.id}`);
            console.log("Restarting...");

            const channel = client.channels.cache.get(client.config_default.logChannel);

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.restart)
                .setTitle("Status")
                .setDescription(`${emoji.idle} Restarting...`)
                .addFields (
                    { name: "Requested By", value: `${interaction.user.tag} | \`${interaction.user.id}\`` },
                )
                .setTimestamp()

            await channel.send({ embeds: [log] });

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.restart)
                .setDescription(`${emoji.idle} Restarting...`)

            await interaction.editReply({ embeds: [info] });

            await client.destroy();
            await client.login(process.env.token);
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}