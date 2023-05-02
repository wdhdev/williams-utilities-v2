module.exports = async () => {
    const { REST, Routes } = require("discord.js");

    require("dotenv").config();

    const clientId = process.env.clientId;

    const commands = [];

    const rest = new REST({ version: "9" }).setToken(process.env.token);

    (async () => {
        try {
            console.log("Deregistering global slash commands from test guild...");

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log("Deregistered global slash commands from test guild!");
        } catch(err) {
            console.error(err);
        }
    })();
}