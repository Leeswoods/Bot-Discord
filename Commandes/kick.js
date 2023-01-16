const Discord = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    // Le ban en lui même, le corps, le caractère (le membre)
    {
      type: "user",
      name: "membre",
      description: "Le membre à kick",
      required: true,
    },
    // La raison
    {
      type: "string",
      name: "raison",
      description: "La raison du kick",
      required: false,
    },
  ],

  async run(bot, message, args) {
    // Permet de kick un user non présent sur le serveur discord (fetch)
    let user = args.getUser("membre");
    if (!user) return message.reply("Le bot ne peut pas kick ce membre.");
    let member = message.guild.members.cache.get(user.id);

    // On ne peut pas kick (expulser) quelqu'un qui n'est pas sur le serveur
    if (!member)
      return message.reply(
        "Cet utilisateur ne peut pas être expluser car il n'est pas présent sur le serveur."
      );

    let reason = args.getString("raison");
    if (!reason) reason = "Pas de raison fournie.";

    // Un membre ne peut pas se kick lui même
    if (message.user.id === user.id)
      return message.reply("N'essaie pas de te kick !");
    // Sécurité pour ne pas kick le fondateur
    if ((await message.guild.fetchOwner()).id === user.id)
      return message.reply("Ne kick pas le Fondateur");
    // Regarde si le membre est "kickable" / N'existe pas
    if (member && !member.kickable)
      return message.reply("Je ne peux pas kick ce membre !");
    // Compare les rôles, un rôle inférieur ne peut pas kick un rôle supérieur
    if (
      member &&
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return message.reply("Tu ne peux pas kick cette personne !");
    // Envoie un message à l'utilisateur pour l'avertir qu'il va être kick
    try {
      await user.send(
        `Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivant : \`${reason}\``
      );
    } catch (err) {}

    // Message de kick du modo
    await message.reply(
      `${message.user} a kick ${user.tag} pour la raison suivant : \`${reason}\``
    );

    await member.kick(reason);
  },
};
