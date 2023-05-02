module.exports = {
    name: "settings",
    description: "View the guild settings",
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 10,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const prefix = await client.prefix(interaction);
            const logs = await client.logs(interaction);
            const join = await client.join(interaction);
            const leave = await client.leave(interaction);

            const settings = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true }) })
                .setTitle("Guild Settings")
                .addFields (
                    { name: "Prefix", value: `\`${prefix}\`` },
                    { name: "Logs", value: logs },
                    { name: "Join Message", value: join },
                    { name: "Leave Message", value: leave }
                )

            await interaction.editReply({ embeds: [settings] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}