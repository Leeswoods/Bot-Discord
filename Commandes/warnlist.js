// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "warnlist",
  description: "Affiche la liste des warns d'un membre",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Modération",
  options: [
    {
      type: "user",
      name: "membre",
      description: "Le membre à surveiller",
      required: true,
      autocomplete: false,
    },
  ],
  // lancé la commande
  // bot sert à avoir les données du bot
  // message sert à accéder données du message
  async run(bot, message, args, db) {
    let user = args.getUser("membre");
    if (!user) return message.reply("Pas de membre !");
    let member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("Pas de membre !");

    // base de donnée
    db.query(
      ` SELECT * FROM warns WHERE guild = '${message.guildId}' AND user = '${user.id}'`,
      async (err, req) => {
        if (req.length < 1) return message.reply("Ce membre n'a pas de warn !");
        await req.sort((a, b) => parseInt(b.date) - parseInt(a.date));
        let Embed = new Discord.EmbedBuilder()
          .setColor(bot.color)
          .setTitle(`Warns de ${user.tag}`)
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({ text: "Warns" });

        for (let i = 0; i < req.length; i++) {
          Embed.addFields([
            {
              name: `Warn n°${i + 1}`,
              value: `> **Auteur** : ${
                (await bot.users.fetch(req[i].author)).tag
              }\n> **ID** : \`${req[i].warn}\`\n> **Raison** : \`${
                req[i].reason
              }\`\n> **Date** : <t:${Math.floor(
                parseInt(req[i].date) / 1000
              )}>`,
            },
          ]);
        }
        await message.reply({ embeds: [Embed] });
      }
    );
  },
};
