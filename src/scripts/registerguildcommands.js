module.exports = async () => {
    const { REST, Routes } = require("discord.js");
    const fs = require("fs");

    require("dotenv").config();
	const config = require("../config.json");

    const clientId = process.env.clientId;
    const guildId = config.default.testGuild;

    const commands = [];

    const loadDir = (dirs) => {
        const commandFiles = fs.readdirSync(`./src/slashcommands/${dirs}`).filter(file => file.endsWith(".js"));

        for(const file of commandFiles) {
            const command = require(`../slashcommands/${dirs}/${file}`);

            if(command.guildOnly) {
                commands.push(command);
            } else {
                continue;
            }
        }
    }

    ["fun", "image", "info", "moderation", "owner", "utility"].forEach(sc => loadDir(sc));

    const rest = new REST({ version: "9" }).setToken(process.env.token);

    (async () => {
        try {
            console.log("Registering guild slash commands to test guild...");

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log("Registered guild slash commands to test guild!");
        } catch(err) {
            console.error(err);
        }
    })();
}