const emoji = require("../../config.json").emojis;
const math = require("mathjs");

module.exports = {
	name: "calculator",
	description: "Calculate a Math Problem",
    category: "utility",
    options: [
        {
            type: 3,
            name: "question",
            description: "Math Question",
            required: true
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 3,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const question = interaction.options.getString("question");
            const solution = math.evaluate(question);

            const mathSolution = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .addFields (
                    { name: "Question", value: `\`${question}\`` },
                    { name: "Solution", value: `\`${solution}\`` }
                )

            await interaction.editReply({ embeds: [mathSolution] });
        } catch(err) {
            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.error} Invalid Question!`)

            await interaction.editReply({ embeds: [error] });
        }
    }
}