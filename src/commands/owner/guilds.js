const emoji = require("../../config.json").emojis;
const hastebin = require("hastebin-gen");

module.exports = {
    name: "guilds",
    description: "Lists all of the guilds the bot is in",
    aliases: ["guildslist", "guildlist", "gl"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            const guilds = client.guilds.cache.map(guild => `[${guild.id}] ${guild.name}`);

            try {
                await hastebin(guilds.join("\n"), { url: "https://logs.bot.williamharrison.dev", extension: "txt" })
                    .then(haste => {
                        const button = new Discord.ActionRowBuilder()
                            .addComponents (
                                new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Guild List")
                                    .setURL(haste)
                            )

                        message.reply({ components: [button] });
                    })
            } catch(err) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} An error occurred!`)

                message.reply({ embeds: [error] });
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}