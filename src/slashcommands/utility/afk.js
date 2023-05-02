const schema = require("../../models/afkSchema");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "afk",
    description: "Toggle your AFK status",
    category: "utility",
    options: [
        {
            type: 3,
            required: false,
            name: "reason",
            description: "Your reason for going AFK"
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const reason = interaction.options.getString("reason");

            if(!reason) {
                schema.findOne({ _id: interaction.user.id }, async (err, data) => {
                    if(err) {
                        console.error(err);
                    }

                    if(data) {
                        await schema.findOneAndUpdate({ _id: interaction.user.id }, {
                            afk: true,
                            reason: "AFK"
                        })

                        await data.save();
                    }

                    if(!data) {
                        data = new schema({
                            _id: interaction.user.id,
                            afk: true,
                            reason: "AFK"
                        })

                        await data.save();
                    }
                })

                const setAFK = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} You are now AFK.`)

                await interaction.editReply({ embeds: [setAFK] });
                return;
            }

            schema.findOne({ _id: interaction.user.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: interaction.user.id }, {
                        afk: true,
                        reason: reason
                    })

                    await data.save();
                }

                if(!data) {
                    data = new schema({
                        _id: interaction.user.id,
                        afk: true,
                        reason: reason
                    })

                    await data.save();
                }

                const setAFK = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.successful} You are now AFK.`)

                await interaction.editReply({ embeds: [setAFK] });
            })
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}