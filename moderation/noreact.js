const Discord = require("discord.js");

module.exports = {
    name: "noreact",
    usage: "noreact <ID_message> <emoji>",
    description: "Liste les membres qui n'ont pas réagi à un message.",
    async execute(client, message, args) {
        if (!args[0] || !args[1]) {
            return message.reply("Utilisation : `noreact <ID_message> <emoji>`");
        }

        let messageID = args[0];
        let emoji = args[1];

        try {
            let fetchedMessage = await message.channel.messages.fetch(messageID);
            let reaction = fetchedMessage.reactions.cache.find(r => r.emoji.name === emoji || r.emoji.id === emoji);

            if (!reaction) return message.reply("Aucune réaction trouvée avec cet emoji !");
            
            let reactedUsers = await reaction.users.fetch();
            let nonReactedMembers = message.guild.members.cache
                .filter(m => !m.user.bot && !reactedUsers.has(m.id));

            if (nonReactedMembers.size === 0) {
                return message.reply("Tout le monde a réagi !");
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("Membres n'ayant pas réagi")
                .setColor("#FF0000")
                .setDescription(nonReactedMembers.map(m => `- ${m.user.tag}`).join("\n") || "Aucun membre trouvé.")
                .setFooter("Commande noreact");

            return message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return message.reply("Erreur : vérifie l'ID du message et mes permissions.");
        }
    }
};