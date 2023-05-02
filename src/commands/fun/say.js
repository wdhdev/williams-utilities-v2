const emoji = require("../../config.json").emojis;

module.exports = {
    name: "say",
    description: "Say something as the bot",
    aliases: ["message", "msg"],
    category: "fun",
    userPermissions: ["ManageMessages"],
    botPermissions: [],
    cooldown: 10,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const msg = args.join(" ");

            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You must specify a message!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(msg.length > 2000) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} The message can not be longer than \`2000\` characters!`)

                message.reply({ embeds: [error] });
                return;
            }

            message.channel.send({ content: `${msg}`, allowedMentions: { parse: [] } });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}