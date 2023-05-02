const emoji = require("../../config.json").emojis;

module.exports = {
    name: "shutdown",
    description: "Shutdown the bot",
    aliases: ["kill"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            console.log(`Shutdown initiated by: ${message.author.id}`);
            console.log("Shutting Down...");

            const channel = client.channels.cache.get(client.config_default.logChannel);

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.shutdown)
                .setTitle("Status")
                .setDescription(`${emoji.dnd} Shutting down...`)
                .addFields (
                    { name: "Requested By", value: `${message.author.tag} | \`${message.author.id}\`` },
                )
                .setTimestamp()

            await channel.send({ embeds: [log] });

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.shutdown)
                .setDescription(`${emoji.dnd} Shutting down...`)

            message.reply({ embeds: [info] })
                .then(() => process.exit());
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}