module.exports = {
    name: "guildDelete",
    async execute(client, Discord, guild) {
        try {
            console.log(`Left Guild: ${guild.id}`);

            const logGuild = client.guilds.cache.get(client.config_default.testGuild);
            const channel = client.channels.cache.get(client.config_default.logChannel);
            const moment = require("moment");

            async function reset() {
                const joinSchema = require("../../models/joinSchema");
                await joinSchema.findOneAndDelete({ _id: guild.id });

                const leaveSchema = require("../../models/leaveSchema");
                await leaveSchema.findOneAndDelete({ _id: guild.id });

                const logSchema = require("../../models/logsSchema");
                await logSchema.findOneAndDelete({ _id: guild.id });

                const prefixSchema = require("../../models/prefixSchema");
                await prefixSchema.findOneAndDelete({ _id: guild.id });

                const warnSchema = require("../../models/warnSchema");
                await warnSchema.findOneAndDelete({ _id: guild.id });
            }

            await reset();

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
                .setTitle("Left Guild")
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