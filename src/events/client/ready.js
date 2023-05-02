module.exports = {
	name: "ready",
	once: true,
	async execute(client, Discord) {
        try {
			// Login Message
			console.log(`Logged in as: ${client.user.tag}`);

			// Register Global Slash Commands
			const globalCommands = require("../../scripts/registerglobalcommands");
			await globalCommands();

			// Register Guild Slash Commands
			const guildCommands = require("../../scripts/registerguildcommands");
			await guildCommands();

			// Start Dashboard
			const dashboard = require("../../dashboard/index");
			dashboard(client);

			const emoji = client.config_emojis;
            const channel = client.channels.cache.get(client.config_default.logChannel);

			// Log Status
            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.online)
				.setTitle("Status")
				.setDescription(`${emoji.online} Online`)
                .setTimestamp()

            channel.send({ embeds: [log] });
		} catch(err) {
			console.error(err);
		}
	}
}