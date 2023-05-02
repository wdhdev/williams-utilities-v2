const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "warn",
    description: "Warn a user",
    category: "moderation",
    options: [
        {
            type: 6,
            name: "member",
            description: "Member to warn",
            required: true
        },

        {
            type: 3,
            name: "reason",
            description: "The reason for the warn",
            max_length: 256,
            required: true
        }
    ],
    userPermissions: ["ManageMessages"],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const member = interaction.options.getUser("member");
            const reason = interaction.options.getString("reason");

            if(member.bot) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot warn bots!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(member.id === interaction.user.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot warn yourself!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const nanoId = require("nanoid");

            const alphabet = "123456789";
            const generateId = nanoId.customAlphabet(alphabet, 16);

            const warnId = generateId();

            const date = Date.parse(Date());
            const timestamp = date / 1000;

            const newWarn = new warnSchema({
                id: warnId,
                guild: interaction.guild.id,
                member: member.id,
                moderator: interaction.user.id,
                reason,
                timestamp
            })

            await newWarn.save();

            logsSchema.findOne({ _id: interaction.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = interaction.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await logsSchema.findOneAndDelete({ _id: interaction.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTitle("Warning")
                        .addFields (
                            { name: "ID", value: warnId },
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${interaction.user} | \`${interaction.user.id}\`` },
                            { name: "Reason", value: reason },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const warn = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true }) })
                .setTitle("Warning")
                .addFields (
                    { name: "ID", value: warnId },
                    { name: "Guild", value: `${interaction.guild.name} | \`${interaction.guild.id}\`` },
                    { name: "Moderator", value: `${interaction.user.tag} | \`${interaction.user.id}\`` },
                    { name: "Reason", value: reason },
                    { name: "Timestamp", value: `<t:${timestamp}:f>` }
                )
                .setTimestamp()

            try {
                await member.send({ embeds: [warn] });
            } catch(err) {
                const warned = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Warning")
                    .setDescription(`${emoji.successful} ${member} has been warned!\n\n**ID**: \`${warnId}\``)
                    .setFooter({ text: "I couldn't DM them." })
                    .setTimestamp()

                await interaction.editReply({ embeds: [warned] });
                return;
            }

            const warned = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Warning")
                .setDescription(`${emoji.successful} ${member} has been warned!\n\n**ID**: \`${warnId}\``)
                .setTimestamp()

            await interaction.editReply({ embeds: [warned] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}