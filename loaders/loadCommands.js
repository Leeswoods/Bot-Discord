// Ce fichier sert à récupérer tout les fichier dans le dossier Commands pour les charger ici
// Pour faire ceci on va utiliser fs qui permet de gestionner les fichiers

// Importer le module fs
const fs = require("fs");

// Exporte le module
module.exports = async (bot) => {
  // Sert à scanner tout les fichiers d'un dossier
  // On va filtrer les fichiers se terminant par js
  fs.readdirSync("./Commandes")
    .filter((f) => f.endsWith(".js"))

    // Pour chaque fichier
    .forEach(async (file) => {
      // Sa renvoie le nom du fichier
      let command = require(`../Commandes/${file}`);

      // Renvoie une erreur si le nom du fichier ou le type de fichier n'est pas une chaîne de caractère, en résumé, si la command n'a pas de nom
      if (!command.name || typeof command.name !== "string")
        throw new TypeError(
          // Le splice sert à garder que le nom du fichier, sa enlève le .js qui fait 3 caractère (-3)
          `La commande ${file.splice(0, file.length - 3)} n'a pas de nom !`
        );
      bot.commands.set(command.name, command);
      // Envoie un message dans la console
      console.log(`Commande ${file} chargée avec succès !`);
    });
};
