const axios = require("axios");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "banner",
    description: "Get a user's banner",
    category: "image",
    options: [
        {
            type: 6,
            name: "member",
            description: "Get a member's banner."
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const member = interaction.options.getUser("member") || interaction.user;

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

                await interaction.editReply({ content: `${url}`, components: [button] });
                return;
            } else {
                if(member.id === interaction.user.id) {
                    const noBanner = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} You do not have a banner!`)

                    await interaction.editReply({ embeds: [noBanner] });
                    return;
                }

                const noBanner = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} ${member} does not have a banner!`)

                await interaction.editReply({ embeds: [noBanner] });
            }
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}