const moment = require("moment");

module.exports = {
    name: "channel",
    description: "Shows information about the current channel",
    aliases: [],
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const channel = message.channel;

            let topic = channel.topic;

            if(!topic) {
                topic = "N/A";
            }

            const info = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Channel Information")
                .addFields (
                    { name: "Name", value: `#${channel.name}` },
                    { name: "Topic", value: topic },
                    { name: "ID", value: `\`${channel.id}\`` },
                    { name: "Created", value: `<t:${Math.floor(moment(channel.createdTimestamp) / 1000)}:f>` },
                )

            message.reply({ embeds: [info] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}