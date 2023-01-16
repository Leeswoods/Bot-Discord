// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = {
  // nom de la commande
  name: "ping",
  description: "Affiche la latence du bot",
  permission: "Aucune",
  dm: true,
  category: "Information",
  // lancé la commande
  // bot sert à avoir les données du bot
  // message sert à accéder données du message
  async run(bot, message, args) {
    // bot.ws.ping : Accèder au web token de l'API de discord
    await message.reply(`Ping : \`${bot.ws.ping}\``);
  },
};
