// // Ce fichier sert aux events
// Pour faire ceci on va utiliser fs qui permet de gestionner les fichiers

// Importer le module fs
const fs = require("fs");

// Exporte le module
module.exports = async (bot) => {
  // Sert à scanner tout les fichiers d'un dossier
  // On va filtrer les fichiers se terminant par js
  fs.readdirSync("./Events")
    .filter((f) => f.endsWith(".js"))

    // Pour chaque fichier
    .forEach(async (file) => {
      // Sa renvoie l'event
      let event = require(`../Events/${file}`);
      bot.on(file.split(".js").join(""), event.bind(null, bot));
      console.log(`Evènement ${file} chargé avec succès`);
    });
};
