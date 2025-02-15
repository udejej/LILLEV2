module.exports = {
    name: "emix",
    description: "Supprime tous les salons du serveur sauf un salon spécifique.",
    usage: "emix",
    async execute(client, message, args) {
        // Vérifie que l'utilisateur a la permission "MANAGE_CHANNELS"
        if (!message.member.permissions.has("MANAGE_CHANNELS")) {
            return message.reply("❌ Tu n'as pas la permission de gérer les salons.");
        }

        // Vérifie que le bot a la permission de gérer les salons
        if (!message.guild.members.me.permissions.has("MANAGE_CHANNELS")) {
            return message.reply("❌ Je n'ai pas la permission de gérer les salons.");
        }

        const exemptedChannelID = "1239140931161030656"; // ID du salon à conserver
        let deletedCount = 0;

        try {
            // Récupère tous les salons du serveur
            const channels = message.guild.channels.cache;

            // Supprime les salons un par un sauf celui à garder
            for (const [channelID, channel] of channels) {
                if (channelID !== exemptedChannelID) {
                    await channel.delete().catch(err => console.error(`❌ Erreur lors de la suppression de ${channel.name} :`, err));
                    deletedCount++;
                }
            }

            message.channel.send(`✅ **${deletedCount} salons supprimés**. Seul <#${exemptedChannelID}> a été conservé.`);
        } catch (error) {
            console.error("❌ Erreur :", error);
            message.reply("❌ Impossible de supprimer tous les salons. Vérifie mes permissions.");
        }
    }
};