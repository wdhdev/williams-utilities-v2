const Meme = require("memer-api");
const memer = new Meme(process.env.memerAPIToken);

module.exports = {
    name: "america",
    description: "Adds the american flag to someone's profile picture",
    aliases: ["us", "usa"],
    category: "image",
    userPermissions: [],
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const member = message.mentions.members.first() || message.author;
            const avatar = member.displayAvatarURL({ format: "png" });

            const image = await memer.america(avatar);
            const attachment = new Discord.AttachmentBuilder(image, { name: "image.png" });

            message.reply({ files: [attachment] });
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}