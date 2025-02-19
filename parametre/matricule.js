const moment = require('moment');

module.exports = {
    name: "matricule",
    description: "Renomme un utilisateur avec son matricule basé sur la date où il a rejoint le serveur.",
    usage: "matricule <@membre> <Grade> <Prénom> <Nom>",
    permissions: ["MANAGE_NICKNAMES"],
    
    async execute(client, message, args) {
        if (!message.member.permissions.has("MANAGE_NICKNAMES")) {
            return message.reply("❌ Tu n'as pas la permission de gérer les pseudos.");
        }

        let member = message.mentions.members.first();
        if (!member) return message.reply("❌ Mentionne un utilisateur.");

        let grade = args[1];
        let prenom = args[2];
        let nom = args[3];

        if (!grade || !prenom || !nom) {
            return message.reply("❌ Utilisation : `!matricule @membre <Grade> <Prénom> <Nom>`");
        }

        // Date de rejoindre le serveur
        let joinDate = moment(member.joinedAt);
        let jour = joinDate.format("DD"); // Jour en 2 chiffres
        let mois = joinDate.format("MM"); // Mois en 2 chiffres
        let matricule = `59${jour}${mois}0`;

        let nouveauPseudo = `${grade} - ${matricule} - ${prenom} ${nom}`;

        try {
            await member.setNickname(nouveauPseudo);
            message.reply(`✅ Pseudo de **${member.user.username}** changé en **${nouveauPseudo}**.`);
        } catch (error) {
            console.error("Erreur lors du changement de pseudo :", error);
            message.reply("❌ Impossible de changer le pseudo de cet utilisateur.");
        }
    }
};