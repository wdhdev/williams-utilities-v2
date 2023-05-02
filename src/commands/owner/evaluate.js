const emoji = require("../../config.json").emojis;

module.exports = {
    name: "evaluate",
    description: "Executes a piece of code",
    aliases: ["eval", "execute", "run", "e"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please enter something to evaluate!`)
    
                message.reply({ embeds: [error] });
                return;
            }
            
            const input = message.content.split(" ").slice(1).join(" ");
            const output = eval(input);

            const evaluation = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .addFields (
                    { name: "Input", value: `\`\`\`${input}\`\`\`` },
                    { name: "Output", value: `\`\`\`${output}\`\`\`` }
                )
                    
            message.reply({ embeds: [evaluation] });
        } catch(output) {
            const input = message.content.split(" ").slice(1).join(" ");

            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .addFields (
                    { name: "Input", value: `\`\`\`${input}\`\`\`` },
                    { name: "Output", value: `\`\`\`${output}\`\`\`` }
                )

            message.reply({ embeds: [error] });
        }
    }
}