module.exports = {
    name: "settings",
    description: "View the guild settings",
    aliases: ["config"],
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 10,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const prefix = await client.prefix(message);
            const logs = await client.logs(message);
            const join = await client.join(message);
            const leave = await client.leave(message);

            const settings = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ format: "png", dynamic: true }) })
                .setTitle("Guild Settings")
                .addFields (
                    { name: "Prefix", value: `\`${prefix}\`` },
                    { name: "Logs", value: logs },
                    { name: "Join Message", value: join },
                    { name: "Leave Message", value: leave }
                )

            message.reply({ embeds: [settings] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}