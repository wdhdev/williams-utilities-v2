const afkSchema = require("../../models/afkSchema");
const emoji = require("../../config.json").emojis;

const cooldowns = new Map();

module.exports = {
	name: "interactionCreate",
	async execute(client, Discord, interaction) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!interaction.guild.members.me.permissions.has(requiredPerms)) return;

            afkSchema.findOne({ _id: interaction.user.id }, async (err, data) => {
                if(err) {
                    console.error(err);
                }

                if(data) {
                    if(data.afk === true) {
                        await afkSchema.findOneAndDelete({ _id: interaction.user.id });

                        const removeAFK = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.default)
                            .setDescription(`${emoji.wave} Welcome back, ${interaction.member}! I have removed your AFK.`)

                        await interaction.channel.send({ embeds: [removeAFK] });
                    }
                }
            })

            if(!interaction.type === Discord.InteractionType.ApplicationCommand) return;

            const command = client.slashCommands.get(interaction.commandName);

            if(!command) return;

            await interaction.deferReply();

            if(command.enabled === false) {
                const commandDisabled = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} This command has been disabled!`)

                await interaction.editReply({ embeds: [commandDisabled] });
                return;
            }

            const validPermissions = client.validPermissions;

            if(command.botPermissions.length) {
                const invalidPerms = [];

                for(const perm of command.botPermissions) {
                    if(!validPermissions.includes(perm)) {
                        return;
                    }

                    if(!interaction.guild.members.me.permissions.has(perm)) {
                        invalidPerms.push(perm);
                    }
                }

                if(invalidPerms.length) {
                    const permError = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`I am missing these permissions: \`${invalidPerms.join("\`, \`")}\``)

                    await interaction.editReply({ embeds: [permError] });
                    return;
                }
            }

            const owner = client.config_default.owners.includes(interaction.user.id);

            if(owner) {
                try {
                    await command.execute(interaction, client, Discord);
                    return;
                } catch(err) {
                    const event = this;

                    client.logInteractionEventError(event, command, err, interaction, Discord);
                    return;
                }
            }

            if(command.ownerOnly === true) {
                const permError = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} You do not have permission to peform this command!`)
    
                await interaction.editReply({ embeds: [permError] });
                return;
            }

            if(command.userPermissions.length) {
                const invalidPerms = [];

                for(const perm of command.userPermissions) {
                    if(!validPermissions.includes(perm)) {
                        return;
                    }

                    if(!interaction.member?.permissions.has(perm)) {
                        invalidPerms.push(perm);
                    }
                }

                if(invalidPerms.length) {
                    const permError = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.error} You do not have permission to perform this command!`)

                    await interaction.editReply({ embeds: [permError] });
                    return;
                }
            }

            if(!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const currentTime = Date.now();
            const timeStamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;

            if(timeStamps.has(interaction.user.id)) {
                const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount;

                if(currentTime < expirationTime) {
                    const timeLeft = (expirationTime - currentTime) / 1000;

                    if(timeLeft.toFixed(0) > 1 || timeLeft.toFixed(0) < 1) {
                        const cooldown = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} Please wait \`${timeLeft.toFixed(0)}\` seconds before running that command again!`)

                        await interaction.editReply({ embeds: [cooldown] });
                        return;
                    }

                    if(timeLeft.toFixed(0) < 2) {
                        const cooldown = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.error} Please wait \`${timeLeft.toFixed(0)}\` second before running that command again!`)

                        await interaction.editReply({ embeds: [cooldown] });
                        return;
                    }
                }
            }

            timeStamps.set(interaction.user.id, currentTime);

            setTimeout(() => {
                timeStamps.delete(interaction.user.id);
            }, cooldownAmount)

            try {
                await command.execute(interaction, client, Discord);
            } catch(err) {
                const event = this;

                client.logInteractionEventError(event, command, err, interaction, Discord);
            }
        } catch(err) {
            console.error(err);
        }
    }
}