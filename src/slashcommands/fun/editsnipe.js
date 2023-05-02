const emoji = require("../../config.json").emojis;

module.exports = {
    name: "editsnipe",
    description: "Snipe an edited message",
    category: "fun",
    options: [],
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const snipe = client.editSnipes.get(interaction.channel.id);

            if(!snipe) {
                const noSnipe = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} There is nothing to snipe!`)

                await interaction.editReply({ embeds: [noSnipe] });
                return;
            }

            const snipedMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${snipe.author.id}` })
                .setTitle(snipe.type)
                .setURL(snipe.url)
                .addFields (
                    { name: "Before", value: snipe.oldContent },
                    { name: "After", value: snipe.newContent }
                )
                .setImage(snipe.image)
                .setTimestamp(snipe.changedAt)

            await interaction.editReply({ embeds: [snipedMessage] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}