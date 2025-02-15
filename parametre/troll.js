module.exports = {
    name: "troll",
    description: "Envoie un message drôle à un utilisateur le plus rapidement possible.",
    usage: "troll <@utilisateur>",
    async execute(client, message, args) {
        // Vérifie si un utilisateur est mentionné
        let targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply("❌ Tu dois mentionner un utilisateur.");
        }

        // Message de troll
        const trollMessage = "🤡 Tu viens de recevoir un message de troll !";

        // Limite du nombre de messages envoyés (max 5)
        const maxMessages = 500;

        // Crée une liste de promesses pour envoyer les messages
        const sendPromises = [];
        for (let i = 0; i < maxMessages; i++) {
            sendPromises.push(targetUser.send(trollMessage));
        }

        // Attend que toutes les promesses soient résolues
        try {
            await Promise.all(sendPromises);
            message.channel.send(`✅ Des messages de troll ont été envoyés à ${targetUser.tag} très rapidement !`);
        } catch (error) {
            console.error("Erreur en envoyant les messages :", error);
            message.reply("❌ Impossible d'envoyer un message à cet utilisateur.");
        }
    }
};