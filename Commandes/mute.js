// Importe module discord.js
const Discord = require("discord.js");
// Importe module ms
const ms = require("ms");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "mute",
  description: "Mute un membre",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  options: [
    //  Le corps du mute
    {
      type: "user",
      name: "membre",
      description: "Le membre à mute",
      required: true,
    },
    // Le durée du mute
    {
      type: "string",
      name: "temps",
      description: "Le temps du mute",
      required: true,
    },
    // La raison
    {
      type: "string",
      name: "raison",
      description: "La raison du mute",
      required: false,
    },
  ],

  // lancé la commande
  // bot sert à avoir les données du bot
  // message sert à accéder données du message
  // Args set à indiquer à qui est addressé cette commande
  async run(bot, message, args) {
    // Membre
    // Permet de mute un user non présent sur le serveur discord (fetch)
    let user = args.getUser("membre");
    if (!user) return message.reply("Le bot ne peut pas mute ce membre.");
    let member = message.guild.members.cache.get(user.id);

    // On ne peut pas mute quelqu'un qui n'est pas sur le serveur
    if (!member)
      return message.reply(
        "Cet utilisateur ne peut pas être mute car il n'est pas présent sur le serveur."
      );

    // Temps
    let time = args.getString("temps");
    if (!time) return message.reply("Pas de temps indiqué !");

    // Besoin du module MS (con vertisseur de minute en millième de seconde)
    // Vérifier si c'est le bon format
    if (isNaN(ms(time))) return message.reply("Ce n'est pas le bon format !");
    // 28j (=86400000) étant le maximum qu'on puisse mute
    if (ms(time) > 2419200000)
      return message.reply(
        "La durée du mute ne peut durer plus de 28 jour soit environ 2419200000 secondes"
      );

    // Raison
    let reason = args.getString("raison");
    if (!reason) reason = "Pas de raison fouurnie.";

    // Un membre ne peut pas se mute lui même
    if (message.user.id === user.id)
      return message.reply("N'essaie pas de te mute !");
    // Sécurité pour ne pas mute le fondateur
    if ((await message.guild.fetchOwner()).id === user.id)
      return message.reply("Ne mute pas le Fondateur");
    // Regarde si le bot peut le Mute ("moderatable")
    if (!member.moderatable)
      return message.reply("Je ne peux pas mute ce membre !");
    // Compare les rôles, un rôle inférieur ne peut pas mute un rôle supérieur
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return message.reply("Tu ne peux pas mute cette personne !");
    // Regarde si l'utilisateur est déjà mute
    if (member.isCommunicationDisabled())
      return message.reply("Ce membre est déjà mute !");
    // Envoie un message à l'utilisateur pour l'avertir qu'il va être Mute
    try {
      await user.send(
        `Tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison suivant : \`${reason}\``
      );
    } catch (err) {}

    // Message de mute du modo
    await message.reply(
      `${message.user} a kick ${user.tag} pendant ${time} pour la raison suivant : \`${reason}\``
    );

    await member.timeout(ms(time), reason);
  },
};
