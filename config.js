// Page de configuration du bot Discord

// Variable d'environnement pour cacher des informations sensibles comme le Token du bot Discord
require("dotenv").config();

// Exporte le module
module.exports = {
  token: process.env.TOKEN,
};
