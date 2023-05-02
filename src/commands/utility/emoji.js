const { Util } = require("discord.js");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "emoji",
    description: "Add an emoji to your server",
    aliases: ["stealemoji"],
    category: "utility",
    userPermissions: ["ManageEmojisAndStickers"],
    botPermissions: ["ManageEmojisAndStickers"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            if(!args.length) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You must specify at least one emoji!`)

                message.reply({ embeds: [error] });
                return;
            }

            for(const rawemoji of args) {
                const parsedemoji = Util.parseEmoji(rawemoji);

                if(parsedemoji.id) {
                    const extension = parsedemoji.animated ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/emojis/${parsedemoji.id + extension}`;

                    message.guild.emojis.create(url, parsedemoji.name)
                        .then(pemoji => {
                            const newUrl = `https://cdn.discordapp.com/emojis/${pemoji.id + extension}`;

                            const button = new Discord.ActionRowBuilder()
                                .addComponents (
                                    new Discord.ButtonBuilder()
                                        .setStyle(Discord.ButtonStyle.Link)
                                        .setLabel("Image")
                                        .setURL(newUrl)
                                )

                            if(pemoji.animated === true) {
                                const addedAnimatedEmoji = new Discord.EmbedBuilder()
                                    .setColor(client.config_embeds.default)
                                    .setThumbnail(newUrl)
                                    .setTitle("Uploaded Emoji")
                                    .addFields (
                                        { name: "Name", value: `${pemoji.name}` },
                                        { name: "ID", value: `\`${pemoji.id}\`` },
                                        { name: "Usage", value: `\`<a:${pemoji.name}:${pemoji.id}>\`` }
                                    )
                                message.reply({ embeds: [addedAnimatedEmoji], components: [button] });
                                return;
                            }

                            const addedEmoji = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.default)
                                .setThumbnail(newUrl)
                                .setTitle("Uploaded Emoji")
                                .addFields (
                                    { name: "Name", value: `${pemoji.name}` },
                                    { name: "ID", value: `\`${pemoji.id}\`` },
                                    { name: "Usage", value: `\`<:${pemoji.name}:${pemoji.id}>\`` }
                                )

                            message.reply({ embeds: [addedEmoji], components: [button] });
                        })
                }
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}