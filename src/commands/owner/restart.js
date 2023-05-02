const emoji = require("../../config.json").emojis;

module.exports = {
    name: "restart",
    description: "Restart the bot",
    aliases: ["reload"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            console.log(`Restart initiated by: ${message.author.id}`);
            console.log("Restarting...");

            const channel = client.channels.cache.get(client.config_default.logChannel);

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.restart)
                .setTitle("Status")
                .setDescription(`${emoji.idle} Restarting...`)
                .addFields (
                    { name: "Requested By", value: `${message.author.tag} | \`${message.author.id}\`` },
                )
                .setTimestamp()

            await channel.send({ embeds: [log] });

            const restarting = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.restart)
                .setDescription(`${emoji.idle} Restarting...`)

            message.reply({ embeds: [restarting] });

            await client.destroy();
            await client.login(process.env.token);
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}