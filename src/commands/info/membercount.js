module.exports = {
    name: "membercount",
    description: "See the member count of the guild",
    aliases: ["members"],
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 100,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const members = message.guild.memberCount;
            const humans = message.guild.members.cache.filter(member => !member.user.bot).size;
            const bots = message.guild.members.cache.filter(member => member.user.bot).size;

            const memberCount = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .addFields (
                    { name: "Total Members", value: `\`${members}\`` },
                    { name: "Humans", value: `\`${humans}\`` },
                    { name: "Bots", value: `\`${bots}\`` }
                )

            message.reply({ embeds: [memberCount] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}