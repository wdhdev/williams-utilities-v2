module.exports = {
    name: "membercount",
    description: "See the member count of the guild",
    category: "info",
    options: [],
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const members = interaction.guild.memberCount;
            const humans = interaction.guild.members.cache.filter(member => !member.user.bot).size;
            const bots = interaction.guild.members.cache.filter(member => member.user.bot).size;

            const memberCount = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .addFields (
                    { name: "Total Members", value: `\`${members}\`` },
                    { name: "Humans", value: `\`${humans}\`` },
                    { name: "Bots", value: `\`${bots}\`` }
                )

            await interaction.editReply({ embeds: [memberCount] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}