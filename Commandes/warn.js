// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "warn",
  description: "Warn un membre",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Modération",
  options: [
    {
      type: "user",
      name: "membre",
      description: "Le membre à warn",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "raison",
      description: "La raison du warn",
      required: false,
      autocomplete: false,
    },
  ],

  // lancé la commande
  // bot : sert à avoir les données du bot
  // message : sert à accéder données du message
  // Args : sert à indiquer à qui est addressé cette commande
  async run(bot, message, args, db) {
    let user = args.getUser("membre");

    if (!user) return message.reply("Pas de membre !");
    let member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("Pas de membre !");

    let reason = args.getString("raison");
    if (!reason) reason = "Pas de raison fournie. ";

    // Un membre ne peut pas se warn lui même
    if (message.user.id === user.id)
      return message.reply("N'essaie pas de te warn !");
    // Sécurité pour ne pas warn le fondateur
    if ((await message.guild.fetchOwner()).id === user.id)
      return message.reply("Ne warn pas le Fondateur");
    // Compare les rôles, un rôle inférieur ne peut pas warn un rôle supérieur
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return message.reply("Tu ne peux pas warn cette personne !");

    // Fetch les données d'un serveur, rôle, etc...
    if (
      (await message.guild.members.fetchMe()).roles.highest.comparePositionTo(
        member.roles.highest
      ) <= 0
    )
      return message.reply("Le bot ne peut pas warn ce membre");

    // Envoie un message à l'utilisateur pour l'avertir qu'il va être banni
    try {
      await user.send(
        `Tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison suivant : \`${reason}\``
      );
    } catch (err) {}

    // Message de warn du modo
    await message.reply(
      `${message.user} a warn ${user.tag} pour la raison suivant : \`${reason}\``
    );

    // Insertion de la base de donnée

    let ID = await bot.function.createId("WARN");
    // Requêtee d'insertion
    db.query(
      `INSERT  INTO warns(guild, user, author, warn, reason, date) VALUES('${
        message.guild.id
      }', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(
        /'/g,
        "\\'"
      )}', '${Date.now()}' )`
    );
  },
};
