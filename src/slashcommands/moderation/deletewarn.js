const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "deletewarn",
    description: "Delete a warning from a user",
    category: "moderation",
    options: [
        {
            type: 6,
            name: "member",
            description: "Member who's warning to delete",
            required: true
        },

        {
            type: 10,
            name: "id",
            description: "The warning ID",
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
            const warnId = interaction.options.getNumber("id");

            if(member.bot) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a member!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(member.id === interaction.user.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You cannot delete your own warnings!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const warn = await warnSchema.findOneAndDelete({
                id: warnId,
                guild: interaction.guild.id,
                member: member.id
            })

            if(!warn) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please provide a valid warning ID!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            await warn.delete();

            const date = Date.parse(Date());
            const timestamp = date / 1000;

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
                        .setColor(client.config_embeds.error)
                        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTitle("Warning Deleted")
                        .addFields (
                            { name: "ID", value: warnId },
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${interaction.user} | \`${interaction.user.id}\`` },
                            { name: "Reason", value: warn.reason },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const removed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Deleted warning \`${warnId}\`!`)

            await interaction.editReply({ embeds: [removed] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}