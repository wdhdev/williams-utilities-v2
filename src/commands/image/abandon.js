const emoji = require("../../config.json").emojis;
const Meme = require("memer-api");
const memer = new Meme(process.env.memerAPIToken);

module.exports = {
    name: "abandon",
    description: "Adds the abandom meme to text",
    aliases: [],
    category: "image",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const text = args.join(" ");

            if(!args[0]) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify some text!`)

                message.reply({ embeds: [error] });
                return;
            }

            const image = await memer.abandon(text);
            const attachment = new Discord.AttachmentBuilder(image, { name: "image.png" });

            message.reply({ files: [attachment] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}