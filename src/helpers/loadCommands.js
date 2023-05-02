try {
    const fs = require("fs");

    module.exports = async (client) => {
        const loadDir = (dirs) => {
            const commandFiles = fs.readdirSync(`./src/commands/${dirs}`).filter(file => file.endsWith(".js"));

            for(const file of commandFiles) {
                const command = require(`../commands/${dirs}/${file}`);

                client.commands.set(command.name, command);

                console.log(`Loaded Command: ${command.name}`);
            }
        }

        ["fun", "image", "info", "moderation", "owner", "utility"].forEach(c => loadDir(c));
    }
} catch(err) {
    console.log(err);
}