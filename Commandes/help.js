// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "help",
  description: "Donne les commandes disponibles",
  permission: "Aucune",
  dm: true,
  category: "Information",
  options: [
    {
      type: "string",
      name: "commande",
      description: "La commande à afficher",
      required: false,
    },
  ],
  // lancé la commande
  // bot sert à avoir les données du bot
  // message sert à accéder données du message
  async run(bot, message, args) {
    // Définit commande qui est = à undefined
    let command;
    // On cherche si la personne à mit une option
    if (args.getString("commande")) {
      // Si il a chercher une option, on affiche la commande qu'il a demandé
      command = bot.commands.get(args.getString("commande"));
      // Si il ne l'a trouve pas, sa met un message
      if (!command) return message.reply("Pas de commande !");
    }
    // S'il a indiqué une commande
    if (!command) {
      // Array
      let categories = [];
      // Pour chaque commande on va mettre dans l'array chaque catégories
      bot.commands.forEach((command) => {
        // Si la catégorie est déjà, on ne le fait pas
        if (!categories.includes(command.category))
          categories.push(command.category);
      });

      let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Commande du bot`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `Commandes disponibles : \`${bot.commands.size}\`\n Catégories disponibles : \`${categories.length}\``
        )
        .setTimestamp()
        .setFooter({ text: "Commandes du bot" });

      await categories.sort().forEach(async (cat) => {
        let commands = bot.commands.filter((cmd) => cmd.category === cat);
        Embed.addFields({
          name: `${cat}`,
          value: `${commands
            .map((cmd) => `\`${cmd.name}\` : ${cmd.description}`)
            .join("\n")}`,
        });
      });

      await message.reply({ embeds: [Embed] });
    } else {
      let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Commande ${command.name}`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `Nom : \`${command.name}\`\n Description: \`${
            command.description
          }\`\n Permission requise: \`${
            typeof command.permission !== "bigint"
              ? command.permission
              : new Discord.PermissionsBitField(command.permission).toArray(
                  false
                )
          }\`\n Commande en DM : \`${
            command.dm ? "Oui" : "Non"
          }\`\n Catégorie : \`${command.category}\``
        )
        .setTimestamp()
        .setFooter({ text: "Commandes du bot" });

      await message.reply({ embeds: [Embed] });
    }
  },
};
