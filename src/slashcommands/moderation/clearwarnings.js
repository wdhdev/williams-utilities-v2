const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");
const warnSchema = require("../../models/warnSchema");

module.exports = {
    name: "clearwarnings",
    description: "Clear all of a user's warnings",
    category: "moderation",
    options: [
        {
            type: 6,
            name: "member",
            description: "Member who's warnings to clear",
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
                    .setDescription(`${emoji.error} You cannot clear your own warnings!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const warns = await warnSchema.find({
                guild: interaction.guild.id,
                member: member.id
            })

            if(!warns.length) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} ${member} has no warnings!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            warns.forEach(warn => {
                warn.delete();
            })

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
                        .setTitle("Warnings Cleared")
                        .setDescription("All of the warnings for this user were deleted.")
                        .addFields (
                            { name: "User", value: `${member} | \`${member.id}\`` },
                            { name: "Moderator", value: `${interaction.user} | \`${interaction.user.id}\`` },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })

            const cleared = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Cleared all warnings from ${member}!`)

            await interaction.editReply({ embeds: [cleared] });
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}