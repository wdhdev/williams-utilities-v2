const emoji = require("../../config.json").emojis;

module.exports = {
    name: "slowmode",
    description: "Set the slowmode for a channel",
    category: "moderation",
    options: [
        {
            type: 10,
            name: "amount",
            description: "How long slowmode should be (set to 0 to disable)",
            min_value: 0,
            max_value: 21600
        }
    ],
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageChannels"],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const slowmode = interaction.options.getNumber("amount");

            if(slowmode === 0) {
                interaction.channel.setRateLimitPerUser(0);

                const disabled = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been disabled!`)

                await interaction.editReply({ embeds: [disabled] });
                return;
            }

            if(!slowmode) {
                if(interaction.channel.rateLimitPerUser === 0) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is disabled!`)

                    await interaction.editReply({ embeds: [current] });
                    return;
                }

                if(interaction.channel.rateLimitPerUser > 1) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is currently \`${interaction.channel.rateLimitPerUser}\` seconds!`)

                    await interaction.editReply({ embeds: [current] });
                    return;
                }
    
                if(interaction.channel.rateLimitPerUser === 1) {
                    const current = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.information} Slowmode is currently \`${interaction.channel.rateLimitPerUser}\` second!`)

                    await interaction.editReply({ embeds: [current] });
                    return;
                }
            }

            if(slowmode > 1) {
                interaction.channel.setRateLimitPerUser(slowmode);

                const set = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been set to \`${slowmode}\` seconds!`)

                await interaction.editReply({ embeds: [set] });
                return;
            }

            if(slowmode === 1) {
                interaction.channel.setRateLimitPerUser(slowmode);

                const set = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} Slowmode has been set to \`${slowmode}\` second!`)

                await interaction.editReply({ embeds: [set] });
            }
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}