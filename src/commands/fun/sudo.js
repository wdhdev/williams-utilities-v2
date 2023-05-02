const emoji = require("../../config.json").emojis;

module.exports = {
    name: "sudo",
    description: "Say something as a user",
    aliases: ["sayas"],
    category: "fun",
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageChannels", "ManageWebhooks"],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first();

            if(!member) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a member!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(!args[1]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a message!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(args.length > 2000) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The message can not be longer than \`2000\` characters!`)

                message.reply({ embeds: [error] });
                return;
            }

            await message.delete();

            const webhook = await message.channel.createWebhook(member.displayName, {
                avatar: member.user.displayAvatarURL({ format: "png" }),
                channel: message.channel.id
            })

            await webhook.send(args.slice(1).join(" "))
                .then(() => webhook.delete());
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}