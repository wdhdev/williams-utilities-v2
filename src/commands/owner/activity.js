const emoji = require("../../config.json").emojis;

module.exports = {
    name: "activity",
    description: "Set the bot's activity",
    aliases: ["botactivity"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            const presence = client.presence;
            const activity = args.join(" ");

            if(!activity || args[0] === "reset") {
                client.user.setPresence({ activity: { name: presence.activity, type: presence.activityType } });

                const activityReset = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} I have reset my activity!`)

                message.reply({ embeds: [activityReset] });
                return;
            }
                
            client.user.setActivity(activity);

            const activitySet = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} I have set my activity to: \`${activity}\``)

            message.reply({ embeds: [activitySet] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}