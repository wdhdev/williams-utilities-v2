module.exports = (client, Discord) => {
    const loadEvents = require("../helpers/loadEvents");

    loadEvents(client, Discord);

    const emoji = require("../config.json").emojis;

    client.logMessageEventError = async function(event, command, err, message, Discord) {
        const nanoId = require("nanoid");
        const channel = client.channels.cache.get(client.config_default.errorLogChannel);

        const alphabet = "123456789";
        const generateId = nanoId.customAlphabet(alphabet, 10);

        const errorId = generateId();

        const log = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setTitle("Event Error")
            .setDescription(`\`\`\`${err}\`\`\``)
            .addFields (
                { name: "Error ID", value: `\`${errorId}\`` },
                { name: "Event", value: `\`${event.name}\`` },
                { name: "Command", value: `\`${command.name}\`` }
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
            .setDescription(`${emoji.error} There was an error while executing that command!`)
            .setFooter({ text: `ID: ${errorId}` })

        message.reply({ embeds: [error] });
    }

    client.logInteractionEventError = async function(event, command, err, interaction, Discord) {
        const nanoID = require("nanoid");
        const channel = client.channels.cache.get(client.config_default.errorLogChannel);

        const alphabet = "0123456789";
        const nanoid = nanoID.customAlphabet(alphabet, 16);

        const errorId = nanoid();

        const log = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setTitle("Event Error")
            .addFields (
                { name: "Error", value: `\`\`\`${err}\`\`\`` },
                { name: "Error ID", value: `\`${errorId}\`` },
                { name: "Event", value: `\`${event.name}\`` },
                { name: "Command", value: `\`${command.name}\`` }
            )
            .setTimestamp()

        channel.send({ content: `<@${client.config_default.owners.join(">, <@")}>`, embeds: [log] });

        const error = new Discord.EmbedBuilder()
            .setColor(client.config_embeds.error)
            .setDescription(`${emoji.error} There was an error while executing that command!`)
            .setFooter({ text: `ID: ${errorId}` })

        await interaction.editReply({ embeds: [error] });
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