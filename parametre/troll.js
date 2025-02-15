module.exports = {
    name: "troll",
    description: "Envoie un message drôle à un utilisateur plusieurs fois.",
    usage: "troll <@utilisateur>",
    async execute(client, message, args) {
        // Vérifie si un utilisateur est mentionné
        let targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply("❌ Tu dois mentionner un utilisateur.");
        }

        // Message de troll
        const trollMessage = "🤡 Tu viens de recevoir un message de troll !";

        // Limite du nombre de messages envoyés (max 100)
        const maxMessages = 100;

        for (let i = 0; i < maxMessages; i++) {
            try {
                await targetUser.send(trollMessage); // Envoie un message à l'utilisateur
            } catch (error) {
                console.error("Erreur en envoyant un message :", error);
                message.reply("❌ Impossible d'envoyer un message à cet utilisateur.");
                break;
            }
        }

        message.channel.send(`✅ Des messages de troll ont été envoyés à ${targetUser.tag}.`);
    }
};