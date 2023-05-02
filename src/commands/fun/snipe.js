const emoji = require("../../config.json").emojis;

module.exports = {
    name: "snipe",
    description: "Snipe a deleted or edited message",
    aliases: ["deletesnipe", "delsnipe", "dsnipe", "editsnipe", "esnipe"],
    category: "fun",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            if(cmd === "deletesnipe" || cmd === "delsnipe" || cmd === "dsnipe" || args[0] === "delete") {
                const snipe = client.deleteSnipes.get(message.channel.id);

                if(!snipe) {
                    const noSnipe = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} There is nothing to snipe!`)

                    message.reply({ embeds: [noSnipe] });
                    return;
                }

                const snipedMessage = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${snipe.author.id}` })
                    .setTitle(snipe.type)
                    .setDescription(snipe.content)
                    .setImage(snipe.image)
                    .setTimestamp(snipe.createdAt)

                message.reply({ embeds: [snipedMessage] });
                return;
            }

            if(cmd === "editsnipe" || cmd === "esnipe" || args[0] === "edit") {
                const snipe = client.editSnipes.get(message.channel.id);

                if(!snipe) {
                    const noSnipe = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} There is nothing to snipe!`)

                    message.reply({ embeds: [noSnipe] });
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

                message.reply({ embeds: [snipedMessage] });
                return;
            }

            const snipe = client.snipes.get(message.channel.id);

            if(!snipe) {
                const noSnipe = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} There is nothing to snipe!`)

                message.reply({ embeds: [noSnipe] });
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

                message.reply({ embeds: [snipedMessage] });
                return;
            }

            const snipedMessage = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${snipe.author.id}` })
                .setTitle(snipe.type)
                .setDescription(snipe.content)
                .setImage(snipe.image)
                .setTimestamp(snipe.createdAt)

            message.reply({ embeds: [snipedMessage] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}