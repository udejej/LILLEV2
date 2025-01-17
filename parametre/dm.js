const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const config = require("../config");

module.exports = {
    name: 'dm',
    usage: '+dm <role> <message>',
    description: `Permet d'envoyer un message privé à tous les utilisateurs ayant un rôle spécifique.`,
    async execute(client, message, args) {
        if (owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id)) {
            const roleName = args.shift();  // Le rôle mentionné
            const msg = args.join(" ");  // Le message à envoyer

            if (!roleName || !msg) return message.reply("Veuillez spécifier un rôle et un message.");

            // Recherche le rôle dans le serveur
            const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
            if (!role) return message.reply(`Le rôle ${roleName} n'a pas été trouvé.`);

            // Envoyer le message à tous les membres ayant ce rôle
            let count = 0;
            message.guild.members.cache.forEach(member => {
                if (member.roles.cache.has(role.id) && !member.user.bot) {
                    member.send(msg).catch(() => {
                        message.channel.send(`Impossible d'envoyer un message privé à ${member.user.tag}`);
                    }).then(() => {
                        count++;
                    });
                }
            });

            return message.reply(`Message envoyé à ${count} membre(s) ayant le rôle ${roleName}.`);
        } else {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
};