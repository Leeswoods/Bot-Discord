// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "unmute",
  description: "UnMute un membre",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  category: "Modération",
  options: [
    //  Le corps du mute
    {
      type: "user",
      name: "membre",
      description: "Le membre à UnMute",
      required: true,
      autocomplete: false,
    },
    // La raison
    {
      type: "string",
      name: "raison",
      description: "La raison du UnMute",
      required: false,
      autocomplete: false,
    },
  ],

  // lancé la commande
  // bot sert à avoir les données du bot
  // message sert à accéder données du message
  // Args sert à indiquer à qui est addressé cette commande
  async run(bot, message, args) {
    // Membre
    // Permet de UnMute un user non présent sur le serveur discord (fetch)
    let user = args.getUser("membre");
    if (!user) return message.reply("Le bot ne peut pas UnMute ce membre.");
    let member = message.guild.members.cache.get(user.id);

    // On ne peut pas UnMute quelqu'un qui n'est pas sur le serveur
    if (!member)
      return message.reply(
        "Cet utilisateur ne peut pas être UnMute car il n'est pas présent sur le serveur."
      );

    // Raison
    let reason = args.getString("raison");
    if (!reason) reason = "Pas de raison fouurnie.";

    // Regarde si le bot peut le UnMute ("moderatable")
    if (!member.moderatable)
      return message.reply("Je ne peux pas UnMute ce membre !");
    // Compare les rôles, un rôle inférieur ne peut pas UnMute un rôle supérieur
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return message.reply("Tu ne peux pas UnMute cette personne !");
    // Regarde si l'utilisateur est bien mute et qu'on peut le UnMute
    if (!member.isCommunicationDisabled())
      return message.reply("Ce membre n'est pas mute !");
    // Envoie un message à l'utilisateur pour l'avertir qu'il est UnMute
    try {
      await user.send(
        `Tu as été UnMute du serveur par ${message.user.tag} pour la raison suivant : \`${reason}\``
      );
    } catch (err) {}

    // Message de UnMute du modo
    await message.reply(
      `${message.user} a UnMute ${user.tag} pour la raison suivant : \`${reason}\``
    );

    await member.timeout(null, reason);
  },
};
