const emoji = require("../../config.json").emojis;

module.exports = {
    name: "leaveguild",
    description: "Make the bot leave a guild",
    aliases: ["leaveserver"],
    botPermissions: [],
    enabled: true,
    ownerOnly: true,
    async execute(message, args, cmd, client, Discord) {
        try {
            const guildID = args[0];

            if(!guildID) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a guild ID!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(isNaN(guildID)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please specify a valid guild ID!`)

                message.reply({ embeds: [error] });
                return;
            }

            const guild = client.guilds.cache.get(guildID);

            if(!guild) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} I am not in that guild!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(guild.id === client.config_default.testGuild) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} I cannot leave the test guild!`)

                message.reply({ embeds: [error] });
                return;
            }

            if(guild.id === message.guild.id) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You can not make me leave the guild you are currently in!`)

                message.reply({ embeds: [error] });
                return;
            }

            await guild.leave();

            const guildLeave = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} I have left guild: \`${guild.id}\``)

            message.reply({ embeds: [guildLeave] });
        } catch(err) {
            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.error} An error occurred!`)
                
            message.reply({ embeds: [error] });
        }
    }
}