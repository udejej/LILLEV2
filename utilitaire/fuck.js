const Discord = require("discord.js");

module.exports = {
    name: 'fuck',
    description: "Supprime le salon dans lequel la commande est exécutée.",
    async execute(client, message, args) {
        // Vérifie si l'utilisateur a la permission de gérer les salons
        if (!message.member.permissions.has("MANAGE_CHANNELS")) 
            return message.reply("❌ Tu n'as pas la permission de supprimer les salons.");

        // Vérifie si le bot a la permission de gérer les salons
        if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
            return message.reply("❌ Je n'ai pas la permission de supprimer les salons.");

        // Sauvegarde le nom du salon avant suppression
        let channelName = message.channel.name;

        // Supprime le salon
        message.channel.delete()
            .then(() => console.log(`✅ Salon supprimé : ${channelName}`))
            .catch(err => console.log(`❌ Impossible de supprimer le salon : ${err}`));
    }
};