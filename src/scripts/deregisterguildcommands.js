module.exports = async () => {
    const { REST, Routes } = require("discord.js");

	require("dotenv").config();
	const config = require("../config.json");

	const clientId = process.env.clientId;
	const guildId = config.default.testGuild;

	const commands = [];

	const rest = new REST({ version: "9" }).setToken(process.env.token);

	(async () => {
		try {
			console.log("Deregistered guild slash commands...");

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);

			console.log("Deregistered guild slash commands!");
		} catch(err) {
			console.error(err);
		}
	})();
}