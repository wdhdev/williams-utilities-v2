module.exports = {
    name: "guildCreate",
    async execute(client, Discord, guild) {
        try {
            console.log(`Joined Guild: ${guild.id}`);

            const logGuild = client.guilds.cache.get(client.config_default.testGuild);
            const channel = client.channels.cache.get(client.config_default.logChannel);

            const moment = require("moment");

            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!logGuild.members.me.permissions.has(requiredPerms)) return;

            let description = guild.description;

            if(!description) {
                description = "N/A";
            }

            const owner = await guild.fetchOwner();

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setThumbnail(guild.iconURL({ format: "png", dynamic: true }))
                .setTitle("Joined Guild")
                .addFields (
                    { name: "Name", value: guild.name },
                    { name: "Description", value: description },
                    { name: "ID", value: `\`${guild.id}\`` },
                    { name: "Created", value: `<t:${Math.floor(moment(guild.createdTimestamp) / 1000)}:f>` },
                    { name: "Owner", value: `[${owner.user.tag}](https://discord.com/users/${owner.id})`}
                )
                .setTimestamp()

            channel.send({ embeds: [log] });
        } catch(err) {
            console.error(err);
        }
    }
}