const emoji = require("../../config.json").emojis;

module.exports = {
    name: "slowmode",
    description: "Set the slowmode for a channel",
    aliases: ["slow", "sm"],
    category: "moderation",
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageChannels"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            let slowmode = args[0];

            if(!slowmode) {
                if(message.channel.rateLimitPerUser === 0) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is disabled!`)

                    message.reply({ embeds: [current] });
                    return;
                }

                if(message.channel.rateLimitPerUser > 1) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is currently \`${message.channel.rateLimitPerUser}\` seconds!`)

                    message.reply({ embeds: [current] });
                    return;
                }
    
                if(message.channel.rateLimitPerUser === 1) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is currently \`${message.channel.rateLimitPerUser}\` second!`)

                    message.reply({ embeds: [current] });
                    return;
                }
            }

            if(slowmode <= 0 || slowmode === "off" || slowmode === "disable") {
                message.channel.setRateLimitPerUser(0);

                const disabled = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been disabled!`)

                message.reply({ embeds: [disabled] });
                return;
            }

            if(isNaN(slowmode)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a number!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(slowmode > 21600) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You can only set the slowmode between \`0\` and \`21600\` seconds!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(slowmode > 1) {
                message.channel.setRateLimitPerUser(slowmode);

                const set = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been set to \`${slowmode}\` seconds!`)

                message.reply({ embeds: [set] });
                return;
            }

            if(slowmode === 1) {
                message.channel.setRateLimitPerUser(slowmode);

                const set = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been set to \`${slowmode}\` second!`)

                message.reply({ embeds: [set] });
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}