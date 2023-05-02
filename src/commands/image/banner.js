const axios = require("axios");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "banner",
    description: "Get a user's banner",
    aliases: [],
    category: "image",
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first() || message.author;

            const data = await axios.get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            }).then(d => d.data);

            if(data.banner) {
                let url = data.banner.startsWith("a_") ? ".gif?size=4096": ".png?size=4096";

                url = `https://cdn.discordapp.com/banners/${member.id}/${data.banner}${url}`;

                const button = new Discord.ActionRowBuilder()
                    .addComponents (
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("Link")
                            .setURL(url)
                    )

                message.reply({ content: `${url}`, components: [button] });
                return;
            } else { 
                if(member.id === message.author.id) {
                    const noBanner = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} You do not have a banner!`)

                    message.reply({ embeds: [noBanner] });
                    return;
                }

                const noBanner = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} ${member} does not have a banner!`)

                message.reply({ embeds: [noBanner] });
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}