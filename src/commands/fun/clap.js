const emoji = require("../../config.json").emojis;

module.exports = {
    name: "clap",
    description: "Clapify your message",
    aliases: ["clapify"],
    category: "fun",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const msg = args.join(" :clap: ");

            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You must specify a message!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(!args[1]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You must specify at least \`2\` arguments!`)

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

            message.reply(msg);
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}