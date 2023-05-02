module.exports = {
    name: "roleDelete",
    async execute(client, Discord, role) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!role.guild.members.me.permissions.has(requiredPerms)) return;

            const schema = require("../../models/logsSchema");

            schema.findOne({ _id: role.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = role.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await schema.findOneAndDelete({ _id: role.guild.id });
                        return;
                    }

                    const color = role.color.toString(16);

                    const hoisted = {
                        true: "True",
                        false: "False"
                    }

                    let permissions = `\`${role.permissions.toArray().join("\`, \`")}\``;

                    if(permissions = "``") {
                        permissions = "*None*";
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(`#${color}`)
                        .setTitle("Role Deleted")
                        .addFields (
                            { name: "Name", value: role.name },
                            { name: "ID", value: role.id },
                            { name: "Colour", value: `#${color}` },
                            { name: "Hoisted", value: `${hoisted[role.hoist]}` },
                            { name: "Permissions", value: permissions }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })
        } catch(err) {
            console.error(err);
        }
    }
}