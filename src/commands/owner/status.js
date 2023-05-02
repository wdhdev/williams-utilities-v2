const emoji = require("../../config.json").emojis;

module.exports = {
    name: "status",
    description: "Set the bot's status",
    aliases: ["botstatus"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            const presence = client.presence;
            const status = args.join(" ");

            if(!status || status === "reset") {
                client.user.setStatus(presence.status);

                const statusReset = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have reset my status!`)

                message.reply({ embeds: [statusReset] });
                return;
            }

            if(status === "online") {
                client.user.setStatus(status);

                const statusSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have set my status to: ${emoji.online} Online`)
                        

                message.reply({ embeds: [statusSet] });
                return;
            }

            if(status === "idle") {
                client.user.setStatus(status);

                const statusSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have set my status to: ${emoji.idle} Idle`)

                message.reply({ embeds: [statusSet] });
                return;
            }

            if(status === "dnd") {
                client.user.setStatus(status);

                const statusSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have set my status to: ${emoji.dnd} Do Not Disturb`)

                message.reply({ embeds: [statusSet] });
                return;
            }

            if(status === "invisible") {
                client.user.setStatus(status);

                const statusSet = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have set my status to: ${emoji.offline} Invisible`)
                        
                message.reply({ embeds: [statusSet] });
                return;
            }

            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.error} Please enter a valid status!`)
                    
            message.reply({ embeds: [error] });
        } catch(err) {
            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.error} An error occurred!`)
                
            message.reply({ embeds: [error] });
        }
    }
}