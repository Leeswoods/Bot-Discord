// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "clear",
  description: "Efface des messages datant de moins de 14 jours",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Modération",
  options: [
    {
      type: "number",
      name: "nombre",
      description: "Nombre de message à supprimer",
      required: true,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "salon",
      description: "Le salon où effacer les messages",
      required: false,
      autocomplete: false,
    },
  ],

  // lancé la commande
  // bot : sert à avoir les données du bot
  // message : sert à accéder données du message
  // Args : sert à indiquer à qui est addressé cette commande
  async run(bot, message, args) {
    let channel = args.getChannel("salon");

    // Si l'utilisateur ne renseigne pas de salon, alors la commande s'éxucutera dans le salon où la commande a été effectuer
    if (!channel) channel = message.channel;
    // Check si l'utilisateur a indiqué un salon et si le salon est bien présent sur le serveur
    if (
      channel.id !== message.channel.id &&
      !message.guild.channels.cache.get(channel.id)
    )
      return message.reply("Aucun salon trouvé");

    let number = args.getNumber("nombre");

    if (parseInt(number) <= 0 || parseInt(number) > 100)
      return message.reply(
        "Il nous faut un nombre entre `0` et `100` inclus !"
      );

    await message.deferReply();

    try {
      let messages = await channel.bulkDelete(paseInt(number));

      await message.followUp({
        content: `J'ai bien supprimé \`${messages.size}\` message(s)  dans le salon ${channel} !`,
        ephemeral: true,
      });
    } catch (err) {
      let messages = [
        ...(await channel.messages.fetch())
          .filter(
            (msg) =>
              !msg.interaction && Date.now() - msg.createdAt <= 1209600000
          )
          .values(),
      ];

      if (messages.length <= 0)
        return message.followUp(
          "Aucun message à supprimer car ils dantent tous de plus de 14 jours !"
        );

      await channel.bulkDelete(messages);

      await message.followUp({
        content: `J'ai pu supprimé uniquement \`${message.length}\` message(s) dans le salon ${channel} car les autres dataient de plus 14 jours !`,
        ephemeral: true,
      });
    }
  },
};
