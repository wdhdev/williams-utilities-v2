const emoji = require("../../config.json").emojis;

module.exports = {
    name: "snipe",
    description: "Snipe a deleted or edited message",
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
            const snipe = client.snipes.get(interaction.channel.id);

            if(!snipe) {
                const noSnipe = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} There is nothing to snipe!`)

                await interaction.editReply({ embeds: [noSnipe] });
                return;
            }

            if(snipe.type === "Message Edited") {
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
                return;
            }

            const snipedMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${snipe.author.id}` })
                .setTitle(snipe.type)
                .setDescription(snipe.content)
                .setImage(snipe.image)
                .setTimestamp(snipe.createdAt)

            await interaction.editReply({ embeds: [snipedMessage] });
        } catch(err) {
            console.error(err);
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
} 