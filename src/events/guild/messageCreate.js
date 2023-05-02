const afkSchema = require("../../models/afkSchema");
const emoji = require("../../config.json").emojis;

const cooldowns = new Map();

module.exports = {
	name: "messageCreate",
	async execute(client, Discord, message) {
        try {
            if(message.author.bot) return;

            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            afkSchema.findOne({ _id: message.author.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    if(data.afk === true) {
                        await afkSchema.findOneAndDelete({ _id: message.author.id });

                        const removeAFK = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.wave} Welcome back, ${message.author}! I have removed your AFK.`)

                        message.reply({ embeds: [removeAFK] });
                    }
                }
            })

            if(message.mentions) {
                message.mentions.users.forEach(member => {
                    if(member.id === message.author.id) return;

                    afkSchema.findOne({ _id: member.id }, async (err, data) => {
                        if(err) {
                            console.error(err);
                        }
    
                        if(data) {
                            if(data.afk === true) {
                                if(data.reason === "AFK") {
                                    const afk = new Discord.EmbedBuilder()
                                        .setColor(client.config_embeds.default)
                                        .setDescription(`${emoji.information} ${member} is currently AFK.`)
    
                                    message.reply({ embeds: [afk] });
                                    return;
                                }

                                const afk = new Discord.EmbedBuilder()
                                    .setColor(client.config_embeds.default)
                                    .setDescription(`${emoji.information} ${member} is currently AFK.`)
                                    .addFields (
                                        { name: "Reason", value: data.reason }
                                    )

                                message.reply({ embeds: [afk] });
                            }
                        }
                    })
                })
            }

            const prefix = await client.prefix(message);

            if(message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
                const guildPrefix = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.information} My prefix here is: \`${prefix}\``)

                message.reply({ embeds: [guildPrefix] });
                return;
            }

            if(!message.content.startsWith(prefix)) return;

            const args = message.content.slice(prefix.length).split(/ +/);

            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

            if(!command) return;

            if(command.enabled === false) {
                const commandDisabled = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} This command has been disabled!`)

                message.reply({ embeds: [commandDisabled] });
                return;
            }

            const validPermissions = client.validPermissions;

            if(command.botPermissions.length) {
                const invalidPerms = [];

                for(const perm of command.botPermissions) {
                    if(!validPermissions.includes(perm)) {
                        return;
                    }

                    if(!message.guild.members.me.permissions.has(perm)) {
                        invalidPerms.push(perm);
                    }
                }

                if(invalidPerms.length) {
                    const permError = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`I am missing these permissions: \`${invalidPerms.join("\`, \`")}\``)

                    message.reply({ embeds: [permError] });
                    return;
                }
            }

            const owner = client.config_default.owners.includes(message.author.id);

            if(owner) {
                try {
                    command.execute(message, args, cmd, client, Discord);
                    return;
                } catch(err) {
                    const event = this;

                    client.logMessageEventError(event, command, err, message, Discord);
                    return;
                }
            }

            if(command.ownerOnly === true) {
                const permError = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You do not have permission to perform this command!`)

                message.reply({ embeds: [permError] });
                return;
            }

            if(command.userPermissions.length) {
                const invalidPerms = [];

                for(const perm of command.userPermissions) {
                    if(!validPermissions.includes(perm)) {
                        return;
                    }

                    if(!message.member.permissions.has(perm)) {
                        invalidPerms.push(perm);
                    }
                }

                if(invalidPerms.length) {
                    const permError = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} You do not have permission to perform this command!`)

                    message.reply({ embeds: [permError] });
                    return;
                }
            }

            if(!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const currentTime = Date.now();
            const timeStamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;

            if(timeStamps.has(message.author.id)) {
                const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

                if(currentTime < expirationTime) {
                    const timeLeft = (expirationTime - currentTime) / 1000;

                    if(timeLeft.toFixed(0) > 1 || timeLeft.toFixed(0) < 1) {
                        const cooldown = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} Please wait \`${timeLeft.toFixed(0)}\` seconds before running that command again!`)

                        message.reply({ embeds: [cooldown] });
                        return;
                    }

                    if(timeLeft.toFixed(0) < 2) {
                        const cooldown = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} Please wait \`${timeLeft.toFixed(0)}\` second before running that command again!`)

                        message.reply({ embeds: [cooldown] });
                        return;
                    }
                }
            }

            timeStamps.set(message.author.id, currentTime);

            setTimeout(() => {
                timeStamps.delete(message.author.id);
            }, cooldownAmount)

            try {
                command.execute(message, args, cmd, client, Discord);
            } catch(err) {
                const event = this;

                client.logMessageEventError(event, err, message, Discord);
            }
        } catch(err) {
            console.error(err);
        }
    }
}