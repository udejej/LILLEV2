const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const config = require("../config");

module.exports = {
    name: 'dm',
    usage: '+dm <role> <message>',
    description: `Permet d'envoyer un message privé à tous les utilisateurs ayant un rôle spécifique.`,
    async execute(client, message, args) {
        // Vérifie si l'utilisateur est autorisé
        if (owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id)) {
            // Récupère le rôle et le message
            const roleNameOrMention = args.shift(); // Premier argument : le rôle (nom ou mention)
            const msg = args.join(" "); // Le reste : le message

            if (!roleNameOrMention || !msg) {
                return message.reply("Utilisation : `+dm <nom-du-role/mention> <message>`");
            }

            // Recherche du rôle par mention ou par nom
            const role = message.mentions.roles.first() || 
                         message.guild.roles.cache.find(r => r.name.toLowerCase() === roleNameOrMention.toLowerCase());

            // Si le rôle n'est pas trouvé
            if (!role) {
                return message.reply(`Aucun rôle trouvé pour "${roleNameOrMention}". Vérifiez le nom ou mentionnez le rôle.`);
            }

            // Envoi du message à tous les membres avec ce rôle
            let count = 0; // Compteur pour les membres ayant reçu le message
            const membersWithRole = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && !member.user.bot);

            if (membersWithRole.size === 0) {
                return message.reply(`Aucun membre avec le rôle "${role.name}" n'a été trouvé.`);
            }

            membersWithRole.forEach(member => {
                member.send(msg).then(() => {
                    count++;
                }).catch(() => {
                    message.channel.send(`Impossible d'envoyer un MP à ${member.user.tag} (DM fermés).`);
                });
            });

            return message.reply(`Message envoyé à ${count} membre(s) ayant le rôle "${role.name}".`);
        } else {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
};