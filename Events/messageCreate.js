// Importe module discord.js
const Discord = require("discord.js");

// Exporte le module
module.exports = async (bot, message) => {
  // Le préfix du bot
  let prefix = "!";

  let messageArray = message.content.split(" ");
  let commandName = messageArray[0].slice(prefix.length); // sert à enlever le préfix
  let args = messageArray.slice(1);
  // Exemple de ce qu'il va nous renvoyer
  /*
  Si la commande c'est : !ping je suis un robot
  Le bot renvoie : ["!ping", "je", "suis", "un", "rebot"]
  */

  if (!message.content.startsWith(prefix)) return;
  let command = require(`../Commandes/${commandName}`);
  if (!command) return message.reply("Il n'y a pas de commande !");

  command.run(bot, message, args);
};
