const schema = require("../../models/afkSchema");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "afk",
    description: "Toggle your AFK status",
    aliases: ["bye"],
    category: "utility",
    userPermissions: [],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const reason = args.join(" ");

            if(!args[0]) {
                schema.findOne({ _id: message.author.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        await schema.findOneAndUpdate({ _id: message.author.id }, {
                            afk: true,
                            reason: "AFK"
                        })

                        await data.save();
                    }

                    if(!data) {
                        data = new schema({
                            _id: message.author.id,
                            afk: true,
                            reason: "AFK"
                        })

                        await data.save();
                    }
                })

                const setAFK = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} You are now AFK.`)

                message.reply({ embeds: [setAFK] });
                return;
            }

            schema.findOne({ _id: message.author.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: message.author.id }, {
                        afk: true,
                        reason: reason
                    })

                    await data.save();
                }

                if(!data) {
                    data = new schema({
                        _id: message.author.id,
                        afk: true,
                        reason: reason
                    })

                    await data.save();
                }

                const setAFK = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} You are now AFK.`)

                message.reply({ embeds: [setAFK] });
            })
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}