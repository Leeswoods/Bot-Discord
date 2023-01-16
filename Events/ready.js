const Discord = require("discord.js");
// Importer fichier LoadDataBase
const loadDatabase = require("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommands");

module.exports = async (bot) => {
  // Base de donnée
  bot.db = await loadDatabase();

  bot.db.connect(function () {
    console.log("Base de donnée connectée avec succès !");
  });
  await loadSlashCommands(bot);
  console.log(`${bot.user.tag} est bien en ligne !`);
};
