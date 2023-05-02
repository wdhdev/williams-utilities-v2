const emoji = require("../../config.json").emojis;

module.exports = {
    name: "deletechannels",
    description: "Delete a channel",
    aliases: ["delchannel", "delchannels", "deletechannel"],
    category: "utility",
    userPermissions: ["ManageChannels"],
    botPermissions: ["ManageChannels"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const channels = message.mentions.channels;

            let res = [];

            if(!message.mentions.channels.first()) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify at least one channel!`)

                message.reply({ embeds: [error] });
                return;
            }

            channels.forEach(channel => {
                channel.delete()
                    .catch(() => res.push(`Deletion Failure: #${channel.name} [${channel.id}]`));

                res.push(`Deleted: #${channel.name} [${channel.id}]`);
            })

            const hastebin = require("hastebin-gen");

            try {
                await hastebin(res.join("\n"), { url: "https://logs.bot.williamharrison.dev", extension: "txt" })
                    .then(haste => {
                        const button = new Discord.ActionRowBuilder()
                            .addComponents (
                                new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Result")
                                    .setURL(haste)
                            )

                        message.reply({ components: [button] });
                    }) 
            } catch(err) {
                message.reply({ content: `\`\`\`${res.join("\n")}\`\`\`` });
            }
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}