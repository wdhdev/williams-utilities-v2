const emoji = require("../../config.json").emojis;

module.exports = {
    name: "settopic",
    description: "Change the current channel's topic",
    aliases: [],
    category: "utility",
    userPermissions: ["ManageChannels"],
    botPermissions: ["ManageChannels"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            let oldTopic = message.channel.topic;
            const newTopic = args.join(" ");

            if(!oldTopic) {
                oldTopic = "N/A";
            }

            if(!newTopic) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a new topic!`)

                message.reply({ embeds: [error] });
                return;
            }

            message.channel.setTopic(newTopic);

            const updated = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Updated Channel Topic")
                .setDescription(`${emoji.successful} Updated the channel topic for <#${message.channel.id}>`)
                .addFields (
                    { name: "Old Topic", value: oldTopic },
                    { name: "New Topic", value: newTopic }
                )

            message.reply({ embeds: [updated] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}