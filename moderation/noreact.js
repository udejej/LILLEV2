const Discord = require("discord.js");

module.exports = {
    name: "noreact",
    usage: "noreact <ID_message> <emoji>",
    description: "Liste les membres qui n'ont pas réagi à un message avec un emoji donné.",
    async execute(client, message, args) {
        // Vérifier si l'utilisateur a la permission de gérer les messages
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("❌ Tu n'as pas la permission d'utiliser cette commande.");
        }

        // Vérifier les arguments
        if (!args[0] || !args[1]) {
            return message.reply("❌ Utilisation correcte : `noreact <ID_message> <emoji>`");
        }

        let messageID = args[0];
        let emojiInput = args[1];
        let emoji = null;

        try {
            // Récupérer le message avec l'ID donné
            let fetchedMessage = await message.channel.messages.fetch(messageID);

            // Vérifier si l'emoji est un emoji personnalisé du serveur
            let customEmoji = message.guild.emojis.cache.find(e => 
                e.toString() === emojiInput || e.id === emojiInput || e.name === emojiInput
            );

            if (customEmoji) {
                emoji = customEmoji.id; // Emoji personnalisé (ID)
            } else {
                emoji = emojiInput; // Emoji standard (Unicode)
            }

            // Vérifier si la réaction existe sur le message
            let reaction = fetchedMessage.reactions.cache.find(r =>
                r.emoji.name === emoji || r.emoji.id === emoji
            );

            if (!reaction) return message.reply("❌ Aucune réaction trouvée avec cet emoji.");

            // Récupérer les utilisateurs ayant réagi
            let reactedUsers = await reaction.users.fetch();
            
            // Filtrer les membres qui n'ont **pas** réagi (exclure les bots)
            let nonReactedMembers = message.guild.members.cache
                .filter(m => !m.user.bot && !reactedUsers.has(m.id));

            if (nonReactedMembers.size === 0) {
                return message.reply("✅ Tout le monde a réagi !");
            }

            // Création de l'embed avec la liste des non-réactifs
            let embed = new Discord.MessageEmbed()
                .setTitle("📌 Membres n'ayant pas réagi")
                .setColor("#FF0000")
                .setDescription(nonReactedMembers.map(m => `- ${m.user.tag}`).join("\n") || "Aucun membre trouvé.")
                .setFooter("Commande noreact • By Dev");

            return message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error("❌ Erreur dans noreact :", error);
            return message.reply("❌ Une erreur s'est produite. Vérifie que l'ID du message est correct et que le bot a les permissions nécessaires.");
        }
    }
};