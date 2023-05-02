const moment = require("moment");

module.exports = {
    name: "uptime",
    description: "Get the bot uptime",
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 10,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400; 
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let uptime_days = `\`${days}\` days`;
            let uptime_hours = `\`${hours}\` hours`;
            let uptime_minutes = `\`${minutes}\` minutes`;
            let uptime_seconds = `\`${seconds}\` seconds`;

            if(days === 1) {
                uptime_days = `\`${days}\` day`;
            }

            if(hours === 1) {
                uptime_hours = `\`${hours}\` hour`;
            }

            if(minutes === 1) {
                uptime_minutes = `\`${minutes}\` minute`;
            }

            if(seconds === 1) {
                uptime_seconds = `\`${seconds}\` second`;
            }

            let uptime = `${uptime_days}, ${uptime_hours}, ${uptime_minutes}, ${uptime_seconds}`;

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Uptime")
                .setDescription(`${uptime}\n\nOnline Since: <t:${Math.floor(moment(Date.now() - client.uptime) / 1000)}:R>`)

            await interaction.editReply({ embeds: [info] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}