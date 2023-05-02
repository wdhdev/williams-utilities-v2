const moment = require("moment");

module.exports = {
    name: "user-info",
    description: "Shows information about a user",
    category: "info",
    options: [
        {
            type: 6,
            name: "member",
            description: "Get information about a member."
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const member = interaction.options.getUser("member") || interaction.user;

            const avatar = member.displayAvatarURL({ format: "png", dynamic: true });

            const axios = require("axios");

            const bannerData = await axios.get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            }).then(d => d.data);

            const userInfo = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${member.id}` })
                .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                .setTitle("User Information")
                .addFields (
                    { name: "Username", value: `[${member.user.tag}](https://discord.com/users/${member.id})` },
                    { name: "ID", value: `\`${member.id}\`` },
                    { name: "Created At", value: `<t:${Math.floor(moment(member.createdTimestamp) / 1000)}:f>` }
                )

            const buttons = new Discord.ActionRowBuilder()

            if(bannerData.banner) {
                let banner = bannerData.banner.startsWith("a_") ? ".gif?size=4096": ".png?size=4096";
                banner = `https://cdn.discordapp.com/banners/${member.id}/${bannerData.banner}${banner}`;

                userInfo.setImage(banner);

                buttons.addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Avatar")
                        .setURL(avatar),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Banner")
                        .setURL(banner)
                )

                await interaction.editReply({ embeds: [userInfo], components: [buttons] });
                return;
            } else {
                buttons.addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Avatar")
                        .setURL(avatar)
                )

                await interaction.editReply({ embeds: [userInfo], components: [buttons] });
            }
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}