// Main est le fichier principal du BOT Discord

// Importe le package(module) Discord.js
const Discord = require("discord.js");

// Range le code intents dans une contante
const intents = new Discord.IntentsBitField(3276799);
// Le numéro d'intents est celui annoncé dans la documentation de Discord, il correspond à toutes les actions du BOT
const bot = new Discord.Client({ intents });

// Importer fichier LoadCommands
const loadCommands = require("./loaders/loadCommands");

// Importe le fichier config.js
const config = require("./config");

// Variable d'environnement pour cacher des informations sensibles comme le Token du bot Discord
require("dotenv").config();

// La collection permet de garder des données, donc en l'occurence garder les données des commandes
bot.commands = new Discord.Collection();

// Créaction du bot discord
// Permet d'intéragir avec l'APi de Discord

// Mettre en ligne notre BOT DISCORD (connexion)
bot.login(config.token);
loadCommands(bot);

// Message dans la console quand un message va être envoyé
bot.on("messageCreate", async (message) => {
  if (message.content === "!ping") {
    return bot.commands.get("ping").run(bot, message);
  }
});

// Permettre de savoir si le bot est bien connecter / Fonction asynchrone
bot.on("ready", async () => {
  // ${bot.user.tag} permet d'avoir accès aux données utilisateur du bot (donnée discord) et permet d'avoir le pseudo du bot et son #
  console.log(`${bot.user.tag} est bien en ligne !`);
});
