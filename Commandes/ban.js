const Discord = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    // Le ban en lui même, le corps, le caractère (le membre)
    {
      type: "user",
      name: "membre",
      description: "Le membre à bannir",
      required: true,
    },
    // La raison
    {
      type: "string",
      name: "raison",
      description: "La raison du bannissement",
      required: false,
    },
  ],

  async run(bot, message, args) {
    // Permet de ban un user non présent sur le serveur discord (fetch)
    try {
      let user = await bot.users.fetch(args._hoistedOptions[0].value);
      if (!user) return message.reply("Le bot ne peut pas bannir ce membre.");
      let member = message.guild.members.cache.get(user.id);

      let reason = args.getString("raison");
      if (!reason) reason = "Pas de raison fournie.";

      // Un membre ne peut pas se bannir lui même
      if (message.user.id === user.id)
        return message.reply("N'essaie pas de te bannir !");
      // Sécurité pour ne pas ban le fondateur
      if ((await message.guild.fetchOwner()).id === user.id)
        return message.reply("Ne ban pas le Fondateur");
      // Regarde si le membre est bannisable / N'existe pas
      if (member && !member.banable)
        return message.reply("Je ne peux pas bannir ce membre !");
      // Compare les rôles, un rôle inférieur ne peut pas ban un rôle supérieur
      if (
        member &&
        message.member.roles.highest.comparePositionTo(member.roles.highest) <=
          0
      )
        return message.reply("Tu ne peux pas bannir cette personne !");
      // Regarde si la personne est déjà banni
      if ((await message.guild.bans.fetch()).get(user.id))
        return message.reply("Ce membre est déjà ban !");

      // Envoie un message à l'utilisateur pour l'avertir qu'il va être banni
      try {
        await user.send(
          `Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivant : \`${reason}\``
        );
      } catch (err) {}

      // Message de bannissement du modo
      await message.reply(
        `${message.user} a banni ${user.tag} pour la raison suivant : \`${reason}\``
      );

      await message.guild.bans.create(user.id, { reason: reason });
    } catch (err) {
      return message.reply("Pas de membre à bannir !");
    }
  },
};
