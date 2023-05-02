module.exports = async () => {
    const { REST, Routes } = require("discord.js");
    const fs = require("fs");

    require("dotenv").config();

    const clientId = process.env.clientId;

    const commands = [];

    const loadDir = (dirs) => {
        const commandFiles = fs.readdirSync(`./src/slashcommands/${dirs}`).filter(file => file.endsWith(".js"));

        for(const file of commandFiles) {
            const command = require(`../slashcommands/${dirs}/${file}`);

            if(command.guildOnly) {
                return;
            }

            commands.push(command);
        }
    }

    ["fun", "image", "info", "moderation", "owner", "utility"].forEach(sc => loadDir(sc));

    const rest = new REST({ version: "9" }).setToken(process.env.token);

    (async () => {
        try {
            console.log("Registering global slash commands...");

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log("Registered global slash commands!");
        } catch(err) {
            console.error(err);
        }
    })();
}