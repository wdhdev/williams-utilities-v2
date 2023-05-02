const emoji = require("../../config.json").emojis;

module.exports = {
    name: "register",
    description: "Register global/guild slash commands",
    aliases: ["reg"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            const global = require("../../scripts/registerglobalcommands");
            const guild = require("../../scripts/registerguildcommands");

            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a slash command type to register!`)
                    .addFields (
                        { name: "Options", value: `\`global\` - Registers slash commands for all guilds.\n\`guild\` - Registers slash commands to the test guild.` }
                    )

                message.reply({ embeds: [error] });
                return;
            }

            if(args[0] === "global") {
                const registering = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.pingpong} Registering global slash commands...`)

                message.reply({ embeds: [registering] })
                    .then(async msg => {
                        await global();

                        const registered = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} Registered global slash commands!`)

                        msg.edit({ embeds: [registered] });
                    })
                return;
            }

            if(args[0] === "guild") {
                const registering = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.pingpong} Registering guild slash commands...`)

                message.reply({ embeds: [registering] })
                    .then(async msg => {
                        await guild();

                        const registered = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} Registered guild slash commands!`)

                        msg.edit({ embeds: [registered] });
                    })
                return;
            }

            if(args[0] !== "global" || args[0] !== "guild") {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Invalid slash command type!`)
                    .addFields (
                        { name: "Options", value: `\`global\` - Registers slash commands for all guilds.\n\`guild\` - Registers slash commands to the test guild.` }
                    )

                message.reply({ embeds: [error] });
                return;
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}