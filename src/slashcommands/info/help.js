const emoji = require("../../config.json").emojis;
const fs = require("fs");

module.exports = {
    name: "help",
    description: "Displays a list of all of my commands",
    category: "info",
    options: [
        {
            type: 3,
            required: false,
            name: "category",
            description: "Get a list of commands for a specific category."
        },

        {
            type: 3,
            required: false,
            name: "command",
            description: "Get info on a specific command."
        }
    ],
    userPermissions: [],
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    async execute(interaction, client, Discord) {
        try {
            const category = interaction.options.getString("category");
            const cmd = interaction.options.getString("command");

            const validPermissions = client.validPermissions;

            const funCommands = [];
            const imageCommands = [];
            const infoCommands = [];
            const moderationCommands = [];
            const utilityCommands = [];

            const loadDir = (dirs) => {
                const commandFiles = fs.readdirSync(`./src/slashcommands/${dirs}`).filter(file => file.endsWith(".js"));

                for(const file of commandFiles) {
                    const command = require(`../../slashcommands/${dirs}/${file}`);

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

                                if(!interaction.member?.permissions.has(perm)) {
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

            ["fun", "image", "info", "moderation", "utility"].forEach(sc => loadDir(sc));

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
                        .setCustomId("s_home")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setEmoji("🏠")
                        .setLabel("Home"),

                    new Discord.ButtonBuilder()
                        .setCustomId("s_end")
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
                                value: "s_all",
                                emoji: "📄",
                                label: "All",
                                description: "A list of all the commands that the bot has.",
                            },

                            {
                                value: "s_fun",
                                emoji: "🤡",
                                label: "Fun",
                                description: "A list of all of the fun commands.",
                            },

                            {
                                value: "s_image",
                                emoji: "📷",
                                label: "Image",
                                description: "A list of all of the image commands.",
                            },

                            {
                                value: "s_info",
                                emoji: "ℹ️",
                                label: "Info",
                                description: "A list of all of the info commands.",
                            },

                            {
                                value: "s_moderation",
                                emoji: "🔨",
                                label: "Moderation",
                                description: "A list of all of the moderation commands.",
                            },

                            {
                                value: "s_utility",
                                emoji: "🛠️",
                                label: "Utility",
                                description: "A list of all of the utility commands.",
                            }
					    )
                )

            const sendHelpMessage = await interaction.editReply({ embeds: [help], components: [buttons, selectMenu] })
                .then(async i => {
                    const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

                    collector.on("collect", async inter => {
                        if(inter.user.id !== interaction.user.id) {
                            const error = new Discord.EmbedBuilder()
                                .setColor(client.config_embeds.error)
                                .setDescription(`${emoji.error} You cannot use this button!`)

                            await interaction.editReply({ embeds: [error], ephemeral: true });
                            return;
                        }

                        await inter.deferUpdate();

                        if(inter.customId === "s_home") {
                            await interaction.editReply({ embeds: [help] });
                            return;
                        }

                        if(inter.customId === "s_end") {
                            collector.stop();
                            return;
                        }

                        if(inter.values[0] === "s_all") {
                            await inter.editReply({ embeds: [all] });
                            return;
                        }

                        if(inter.values[0] === "s_fun") {
                            await inter.editReply({ embeds: [funHelp] });
                            return;
                        }

                        if(inter.values[0] === "s_image") {
                            await inter.editReply({ embeds: [imageHelp] });
                            return;
                        }

                        if(inter.values[0] === "s_info") {
                            await inter.editReply({ embeds: [infoHelp] });
                            return;
                        }

                        if(inter.values[0] === "s_moderation") {
                            await inter.editReply({ embeds: [moderationHelp] });
                            return;
                        }

                        if(inter.values[0] === "s_utility") {
                            await inter.editReply({ embeds: [utilityHelp] });
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

                        await i.edit({ components: [buttons, selectMenu] });
                    })
                })

            // Fun Commands
            if(category === "fun") {
                await interaction.editReply({ embeds: [funHelp] });
                return;
            }

            // Image Commands
            if(category === "image") {
                await interaction.editReply({ embeds: [imageHelp] });
                return;
            }

            // Info Commands
            if(category === "info") {
                await interaction.editReply({ embeds: [infoHelp] });
                return;
            }

            // Moderation Commands
            if(category === "moderation") {
                await interaction.editReply({ embeds: [moderationHelp] });
                return;
            }

            // Utility Commands
            if(category === "utility") {
                await interaction.editReply({ embeds: [utilityHelp] });
                return;
            }

            const command = client.slashCommands.get(cmd);

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

                        if(!interaction.member.permissions.has(perm)) {
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
                        { name: "User Permissions", value: userPermissions },
                        { name: "Bot Permissions", value: botPermissions },
                        { name: "Cooldown", value: cooldown }
                    )
                    .setTimestamp()

                await interaction.editReply({ embeds: [commandHelp] });
                return;
            }

            sendHelpMessage;
        } catch(err) {
            const command = this;
            client.logSlashCommandError(command, err, interaction, Discord);
        }
    }
}