module.exports = (client) => {
    const loadCommands = require("../helpers/loadCommands");

    loadCommands(client);

    const emoji = require("../config.json").emojis;

    client.logCommandError = async function(command, err, message, Discord) {
        const channel = client.channels.cache.get(client.config_default.errorLogChannel);

        const nanoId = require("nanoid");

        const alphabet = "123456789";
        const generateId = nanoId.customAlphabet(alphabet, 10);

        const errorId = generateId();

        const log = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setTitle("Command Error")
            .setDescription(`\`\`\`${err}\`\`\``)
            .addFields (
                { name: "Error ID", value: `\`${errorId}\`` },
                { name: "Command", value: `\`${command.name}\`` },
                { name: "Command Usage", value: `\`${message.content}\`` },
                { name: "Guild", value: `${message.guild.name} | \`${message.guild.id}\`` },
                { name: "User", value: `${message.author.tag} | \`${message.author.id}\`` }
            )
            .setTimestamp()

        const buttons = new Discord.ActionRowBuilder()
            .addComponents (
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Link)
                    .setLabel("Message")
                    .setURL(message.url)
            )

        channel.send({ content: `<@${client.config_default.owners.join(">, <@")}>`, embeds: [log], components: [buttons] });

        const error = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setDescription(`${emoji.error} An error occurred!`)
            .setFooter({ text: `ID: ${errorId}` })

        message.reply({ embeds: [error] });
        console.log(err)
    }

    const prefixSchema = require("../models/prefixSchema");

    client.prefix = async function(message) {
        let prefix;

        const data = await prefixSchema.findOne({ _id: message.guild.id })
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

    client.logs = async function(message) {
        const data = await logsSchema.findOne({ _id: message.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(!data) {
            return `${emoji.error} Disabled`;
        }

        return `<#${data.channel}>`;
    }

    const joinSchema = require("../models/joinSchema");

    client.join = async function(message) {
        const data = await joinSchema.findOne({ _id: message.guild.id })
            .catch(err => {
                console.error(err);
            })

        if(!data) {
            return `${emoji.error} Disabled`;
        }

        return `${emoji.successful} Enabled`;
    }

    const leaveSchema = require("../models/leaveSchema");

    client.leave = async function(message) {
        const data = await leaveSchema.findOne({ _id: message.guild.id })
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