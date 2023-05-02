const moment = require("moment");

module.exports = {
    name: "channel",
    description: "Shows information about the current channel",
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const channel = interaction.channel;

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

            await interaction.editReply({ embeds: [info] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}