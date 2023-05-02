const emoji = require("../../config.json").emojis;
const logsSchema = require("../../models/logsSchema");

module.exports = {
    name: "clear",
    description: "Clear messages in a channel.",
    aliases: ["purge"],
    category: "moderation",
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const amount = args[0];
            const reason = args.slice(1).join(" ");

            if(!amount || isNaN(amount)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify the amount of messages to clear!`)

                message.reply({ embeds: [error] });
                return;
            }
    
            if(amount > 100 || amount < 1) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You can only clear between \`1\` and \`100\` messages!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(reason && reason.length > 256) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The reason cannot be longer than \`256\` characters!`)

                message.reply({ embeds: [error] });
                return;
            }

            await message.delete();

            await message.channel.messages.fetch({ limit: amount })
                .then(messages => message.channel.bulkDelete(messages, true));

            const date = Date.parse(Date());
            const timestamp = date / 1000;

            logsSchema.findOne({ _id: message.guild.id }, async (err, data) => {
                if(err) {
                    console.log(err);
                }

                if(data) {
                    const channel = message.guild.channels.cache.get(data.channel);

                    if(!channel) {
                        await logsSchema.findOneAndDelete({ _id: message.guild.id });
                        return;
                    }

                    const log = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setTitle("Bulk Delete")
                        .addFields (
                            { name: "Moderator", value: `${message.author} | \`${message.author.id}\`` },
                            { name: "Channel", value: `<#${message.channel.id}> | \`${message.channel.id}\`` },
                            { name: "Reason", value: reason ? reason : "*No reason specified*" },
                            { name: "Timestamp", value: `<t:${timestamp}:f>` }
                        )
                        .setTimestamp()

                    channel.send({ embeds: [log] });
                }
            })
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}