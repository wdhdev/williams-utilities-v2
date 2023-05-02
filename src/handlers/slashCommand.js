module.exports = (client) => {
    const loadSlashCommands = require("../helpers/loadSlashCommands");

    loadSlashCommands(client);

    const emoji = require("../config.json").emojis;

    client.logSlashCommandError = async function(command, err, interaction, Discord) {
        const nanoId = require("nanoid");
        const channel = client.channels.cache.get(client.config_default.errorLogChannel);

        const alphabet = "0123456789";
        const generateId = nanoId.customAlphabet(alphabet, 8);

        const errorId = generateId();

        const log = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setTitle("Slash Command Error")
            .setDescription(`\`\`\`${err}\`\`\``)
            .addFields (
                { name: "Error ID", value: `\`${errorId}\`` },
                { name: "Command", value: `\`${command.name}\`` },
                { name: "Guild", value: `${interaction.guild.name} | \`${interaction.guild.id}\`` },
                { name: "User", value: `${interaction.user.tag} | \`${interaction.user.id}\`` }
            )
            .setTimestamp()

        channel.send({ content: `<@${client.config_default.owners.join(">, <@")}>`, embeds: [log] });

        const error = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setDescription(`${emoji.error} An error occurred!`)
            .setFooter({ text: `ID: ${errorId}` })

        await interaction.editReply({ embeds: [error] });
    }

    client.prefix = async function(interaction) {
        let prefix;

        const data = await prefixSchema.findOne({ _id: interaction.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(data) {
            if(data.prefix) {
                prefix = data.prefix;
            }
        } else {
            prefix = client.config_default.prefix;
        }

        return prefix;
    }

    const logsSchema = require("../models/logsSchema");

    client.logs = async function(interaction) {
        const data = await logsSchema.findOne({ _id: interaction.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(!data) {
            return `${emoji.error} Disabled`;
        }

        return `<#${data.channel}>`;
    }

    const joinSchema = require("../models/joinSchema");

    client.join = async function(interaction) {
        const data = await joinSchema.findOne({ _id: interaction.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(!data) {
            return `${emoji.error} Disabled`;
        }

        return `${emoji.successful} Enabled`;
    }

    const leaveSchema = require("../models/leaveSchema");

    client.leave = async function(interaction) {
        const data = await leaveSchema.findOne({ _id: interaction.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(!data) {
            return `${emoji.error} Disabled`;
        }

        return `${emoji.successful} Enabled`;
    }

    require("dotenv").config();
}