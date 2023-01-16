const Discord = require("discord.js");

module.exports = {
  name: "unban",
  description: "UnBan un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    // Le UnBan en lui même, le corps, le caractère (le membre)
    {
      type: "user",
      name: "utilisateur",
      description: "L'utilisateur à débannir",
      required: true,
      autocomplete: false,
    },
    // La raison
    {
      type: "string",
      name: "raison",
      description: "La raison du débannissement",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    // Permet de UnBan un user non présent sur le serveur discord (fetch)
    try {
      let user = args.getUser("utilisateur");
      if (!user) return message.reply("Pas d'utilisateur !");

      let reason = args.getString("raison");
      if (!reason) reason = "Pas de raison fournie.";

      // Regarde si l'utilisateur est débannisable/  sa la personne est banni
      if (!(await message.guild.bans.fetch()).get(user.id))
        return message.reply("Ce utilisateur n'est pas banni !");

      // Envoie un message à l'utilisateur pour l'avertir qu'il va être banni
      try {
        await user.send(
          `Tu as été débanni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivant : \`${reason}\``
        );
      } catch (err) {}

      // Message de bannissement du modo
      await message.reply(
        `${message.user} a débanni ${user.tag} pour la raison suivant : \`${reason}\``
      );

      await message.guild.members.unban(user, reason);
    } catch (err) {
      return message.reply("Pas d'utilisateur !");
    }
  },
};
