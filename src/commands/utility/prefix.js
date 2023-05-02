const emoji = require("../../config.json").emojis;
const schema = require("../../models/prefixSchema");

module.exports = {
    name: "prefix",
    description: "Change the guild prefix",
    aliases: [],
    category: "utility",
    userPermissions: ["ManageGuild"],
    botPermissions: [],
    cooldown: 120,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const prefix = await client.prefix(message);
            const newPrefix = args[0];

            if(!newPrefix) {
                const guildPrefix = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.information} My prefix here is: \`${prefix}\``)

                message.reply({ embeds: [guildPrefix] });
                return;
            }

            if(newPrefix === "reset" || newPrefix === client.config_default.prefix) {
                schema.findOne({ _id: message.guild.id }, async (err, data) => {
                    if(err) {
                        console.log(err);
                    }

                    if(data) {
                        await schema.findOneAndDelete({ _id: message.guild.id });

                        const prefixReset = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.successful} The guild prefix has been reset to the default prefix: \`${client.config_default.prefix}\``)

                        message.reply({ embeds: [prefixReset] });
                    }

                    if(!data) {
                        const noCustomPrefix = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} This guild does not have a custom prefix!`)

                        message.reply({ embeds: [noCustomPrefix] });
                    }
                })
                return;
            }

            if(newPrefix.length > 5) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The new prefix can not be longer than \`5\` characters!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(newPrefix === "/") {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The new prefix can not set to \`/\`!`)

                message.reply({ embeds: [error] });
                return;
            }

            schema.findOne({ _id: message.guild.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    await schema.findOneAndUpdate({ _id: message.guild.id }, { prefix: newPrefix });

                    await data.save();

                }

                if(!data) {
                    data = new schema({
                        _id: message.guild.id,
                        prefix: newPrefix
                    })

                    await data.save();
                }
            })

            const prefixSet = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} The guild prefix has been set to: \`${newPrefix}\``)

            message.reply({ embeds: [prefixSet] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}