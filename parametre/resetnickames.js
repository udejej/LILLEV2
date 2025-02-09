const Discord = require("discord.js");

module.exports = {
    name: "resetnicknames",
    usage: "resetnicknames",
    description: "Réinitialise les pseudos de tous les membres à leur pseudo par défaut.",
    async execute(client, message, args) {
        // Vérifie si l'utilisateur a la permission d'administrer le serveur
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
        }

        // Confirmation avant de procéder
        message.reply("Êtes-vous sûr de vouloir réinitialiser les pseudos de tous les membres ? Tapez `oui` pour confirmer.")
            .then(() => {
                const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === "oui";
                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(async () => {
                        // Envoie un message pour informer que le processus a commencé
                        message.channel.send("Réinitialisation des pseudos en cours...");

                        // Réinitialisation des pseudos
                        const members = message.guild.members.cache.filter(m => !m.user.bot);

                        for (const [id, member] of members) {
                            try {
                                await member.setNickname(null); // Réinitialise le pseudo
                            } catch (error) {
                                console.error(`Erreur lors de la réinitialisation du pseudo de ${member.user.tag}:`, error);
                            }
                        }

                        message.channel.send("Tous les pseudos ont été réinitialisés !");
                    })
                    .catch(() => {
                        message.reply("La commande a été annulée.");
                    });
            });
    }
};