const emoji = require("../../config.json").emojis;
const math = require("mathjs");

module.exports = {
    name: "calculator",
    description: "Calculate a math question",
    aliases: ["calculate", "calc", "math"],
    category: "utility",
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please enter a question!`)

                message.reply({ embeds: [error] });
                return;
            }

            const question = args.join(" ");
            const solution = math.evaluate(question);

            const mathSolution = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .addFields (
                    { name: "Question", value: `\`${question}\`` },
                    { name: "Solution", value: `\`${solution}\`` }
                )

            message.reply({ embeds: [mathSolution] });
        } catch(err) {
            const mathError = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.error} Invalid Question!`)

            message.reply({ embeds: [mathError] });
        }
    }
}