const fs = require("fs");
const emoji = require("../../config.json").emojis;

module.exports = {
    name: "help",
    description: "Displays a list of all of my commands",
    aliases: ["support", "commands", "command", "cmds", "cmd"],
    category: "info",
    userPermissions: [],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    ownerOnly: false,
    async execute(message, args, cmd, client, Discord) {
        try {
            const validPermissions = client.validPermissions;

            const funCommands = [];
            const imageCommands = [];
            const infoCommands = [];
            const moderationCommands = [];
            const utilityCommands = [];

            const loadDir = (dirs) => {
                const commandFiles = fs.readdirSync(`./src/commands/${dirs}`).filter(file => file.endsWith(".js"));

                for(const file of commandFiles) {
                    const command = require(`../../commands/${dirs}/${file}`);

                    if(command.name) {
                        if(command.enabled === false || command.ownerOnly === true) {
                            continue;
                        }

                        if(command.userPermissions.length) {
                            const invalidPerms = [];

                            for(const perm of command.userPermissions) {
                                if(!validPermissions.includes(perm)) {
                                    continue;
                                }

                                if(!message.member.permissions.has(perm)) {
                                    invalidPerms.push(perm);
                                }
                            }

                            if(invalidPerms.length) {
                                continue;
                            }
                        }

                        if(command.category) {
                            if(command.category === "fun") {
                                funCommands.push(command.name);
                            }

                            if(command.category === "image") {
                                imageCommands.push(command.name);
                            }

                            if(command.category === "info") {
                                infoCommands.push(command.name);
                            }

                            if(command.category === "moderation") {
                                moderationCommands.push(command.name);
                            }

                            if(command.category === "utility") {
                                utilityCommands.push(command.name);
                            }
                        }
                    } else {
                        continue;
                    }
                }
            }

            ["fun", "image", "info", "moderation", "utility"].forEach(c => loadDir(c));

            let fun = `\`${funCommands.join("\`, \`")}\``;
            let image = `\`${imageCommands.join("\`, \`")}\``;
            let info = `\`${infoCommands.join("\`, \`")}\``;
            let moderation = `\`${moderationCommands.join("\`, \`")}\``;
            let utility = `\`${utilityCommands.join("\`, \`")}\``;

            if(fun === "``") {
                fun = "N/A";
            }

            if(image === "``") {
                image = "N/A";
            }

            if(info === "``") {
                info = "N/A";
            }

            if(moderation === "``") {
                moderation = "N/A";
            }

            if(utility === "``") {
                utility = "N/A";
            }

            const help = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setTitle("Help")
                .setDescription(`
                    ${emoji.information} Select a category in the select menu below to see the commands for that category.

                    **All**: A list of all of the commands.
                    **Fun**: A list of all of the fun commands.
                    **Image**: A list of all of the image commands.
                    **Info**: A list of all of the info commands.
                    **Moderation**: A list of all of the moderation commands.
                    **Utility**: A list of all of the utility commands.

                    :warning: The select menu will expire after 60 seconds.
                `)
                .setTimestamp()

            const all = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .addFields (
                    { name: "Fun Commands", value: fun },
                    { name: "Image Commands", value: image },
                    { name: "Info Commands", value: info },
                    { name: "Moderation Commands", value: moderation },
                    { name: "Utility Commands", value: utility }
                )
                .setTimestamp()

            const funHelp = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Fun Commands")
                .setDescription(fun)
                .setTimestamp()

            const imageHelp = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Image Commands")
                .setDescription(image)
                .setTimestamp()

            const infoHelp = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Info Commands")
                .setDescription(info)
                .setTimestamp()

            const moderationHelp = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Moderation Commands")
                .setDescription(moderation)
                .setTimestamp()

            const utilityHelp = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }), url: `https://discord.com/users/${client.user.id}`})
                .setTitle("Utility Commands")
                .setDescription(utility)
                .setTimestamp()

            const buttons = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setCustomId("home")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setEmoji("🏠")
                        .setLabel("Home"),

                    new Discord.ButtonBuilder()
                        .setCustomId("end")
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("End Interaction")
                )

            const selectMenu = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.SelectMenuBuilder()
                        .setCustomId("menu")
                        .setPlaceholder("Select a category")
                        .addOptions (
                            {
                                value: "all",
                                emoji: "📄",
                                label: "All",
                                description: "A list of all the commands that the bot has.",
                            },

                            {
                                value: "fun",
                                emoji: "🤡",
                                label: "Fun",
                                description: "A list of all of the fun commands.",
                            },

                            {
                                value: "image",
                                emoji: "📷",
                                label: "Image",
                                description: "A list of all of the image commands.",
                            },

                            {
                                value: "info",
                                emoji: "ℹ️",
                                label: "Info",
                                description: "A list of all of the info commands.",
                            },

                            {
                                value: "moderation",
                                emoji: "🔨",
                                label: "Moderation",
                                description: "A list of all of the moderation commands.",
                            },

                            {
                                value: "utility",
                                emoji: "🛠️",
                                label: "Utility",
                                description: "A list of all of the utility commands.",
                            }
					    )
                )

            const sendHelpMessage = message.reply({ embeds: [help], components: [buttons, selectMenu] })
                .then(async msg => {
                    const collector = message.channel.createMessageComponentCollector({ time: 60000 });

                    collector.on("collect", async interaction => {
                        if(interaction.user.id !== message.author.id) {
                            const error = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} You cannot use this button!`)

                            await interaction.reply({ embeds: [error], ephemeral: true });
                            return;
                        }

                        await interaction.deferUpdate();

                        if(interaction.customId === "home") {
                            await interaction.editReply({ embeds: [help] });
                            return;
                        }

                        if(interaction.customId === "end") {
                            collector.stop();
                            return;
                        }

                        if(interaction.values[0] === "all") {
                            await interaction.editReply({ embeds: [all] });
                            return;
                        }

                        if(interaction.values[0] === "fun") {
                            await interaction.editReply({ embeds: [funHelp] });
                            return;
                        }

                        if(interaction.values[0] === "image") {
                            await interaction.editReply({ embeds: [imageHelp] });
                            return;
                        }

                        if(interaction.values[0] === "info") {
                            await interaction.editReply({ embeds: [infoHelp] });
                            return;
                        }

                        if(interaction.values[0] === "moderation") {
                            await interaction.editReply({ embeds: [moderationHelp] });
                            return;
                        }

                        if(interaction.values[0] === "utility") {
                            await interaction.editReply({ embeds: [utilityHelp] });
                            return;
                        }
                    })

                    collector.on("end", async () => {
                        selectMenu.components.forEach(component => {
                            component.setDisabled(true);
                        })

                        buttons.components.forEach(component => {
                            component.setDisabled(true);
                        })

                        await msg.edit({ components: [buttons, selectMenu] });
                    })
                })

            // Fun Commands
            if(args[0] === "fun") {
                message.reply({ embeds: [funHelp] });
                return;
            }

            // Image Commands
            if(args[0] === "image") {
                message.reply({ embeds: [imageHelp] });
                return;
            }

            // Info Commands
            if(args[0] === "info") {
                message.reply({ embeds: [infoHelp] });
                return;
            }

            // Moderation Commands
            if(args[0] === "moderation") {
                message.reply({ embeds: [moderationHelp] });
                return;
            }

            // Utility Commands
            if(args[0] === "utility") {
                message.reply({ embeds: [utilityHelp] });
                return;
            }

            const command = client.commands.get(args[0]) || client.commands.find(a => a.aliases && a.aliases.includes(args[0]));

            if(command) {
                if(command.enabled === false || command.ownerOnly === true) {
                    sendHelpMessage;
                    return;
                }

                if(command.userPermissions.length) {
                    const invalidPerms = [];

                    for(const perm of command.userPermissions) {
                        if(!validPermissions.includes(perm)) {
                            continue;
                        }

                        if(!message.member.permissions.has(perm)) {
                            invalidPerms.push(perm);
                        }
                    }

                    if(invalidPerms.length) {
                        sendHelpMessage;
                        return;
                    }
                }

                let description = command.description;

                if(!description) {
                    description = "N/A";
                }

                let aliases = command.aliases;

                if(aliases !== []) {
                    aliases = `\`${aliases.join("\`, \`")}\``;
                } else {
                    aliases = "N/A";
                }

                if(aliases === "``" || !aliases) {
                    aliases = "N/A";
                }

                let userPermissions = command.userPermissions;

                if(userPermissions !== []) {
                    userPermissions = `\`${userPermissions.join("\`, \`")}\``;
                } else {
                    userPermissions = "N/A";
                }

                if(userPermissions === "``") {
                    userPermissions = "N/A";
                }

                let botPermissions = command.botPermissions;

                if(botPermissions !== []) {
                    botPermissions = `\`${botPermissions.join("\`, \`")}\``;
                } else {
                    botPermissions = "N/A";
                }

                if(botPermissions === "``") {
                    botPermissions = "N/A";
                }

                let cooldown = command.cooldown;

                if(cooldown !== "") {
                    cooldown = `\`${command.cooldown}\` seconds`;
                }

                if(cooldown === "" || !cooldown) {
                    cooldown = "\`0\` seconds";
                }

                if(cooldown === "1") {
                    cooldown = "\`1\` second"
                }

                const commandHelp = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .addFields (
                        { name: "Command", value: `\`${command.name}\`` },
                        { name: "Description", value: description },
                        { name: "Aliases", value: aliases },
                        { name: "User Permissions", value: userPermissions },
                        { name: "Bot Permissions", value: botPermissions },
                        { name: "Cooldown", value: cooldown }
                    )
                    .setTimestamp()

                message.reply({ embeds: [commandHelp] });
                return;
            }

            sendHelpMessage;
        } catch(err) {
            const command = this;
            client.logCommandError(command, err, message, Discord);
        }
    }
}