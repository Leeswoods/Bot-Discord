const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

// Variable d'environnement pour cacher des informations sensibles comme le Token du bot Discord
require("dotenv").config();

module.exports = async (bot) => {
  // Tout les Slash  commands vont se retrouver de ce Array là
  let commands = [];

  // Pour chaque slash command
  bot.commands.forEach(async (command) => {
    let slashcommand = new Discord.SlashCommandBuilder()
      // Mettre un nom
      .setName(command.name)
      // Mettre une description
      .setDescription(command.description)
      // Mettre des permissions (si sa peut se faire dans les dm ou pas)
      .setDMPermission(command.dm)
      // Permission sur la commande / si égale "Aucune" pas de permission
      .setDefaultMemberPermissions(
        command.permission === "Aucune" ? null : command.permission
      );

    // Si command option existe et qu'il y a une ou plus d'options, sa va lancé la boucle
    if (command.options?.length >= 1) {
      for (let i = 0; i < command.options.length; i++) {
        // Les options de la commande
        // On séléction l'option présente dans la boucle
        slashcommand[
          `add${
            // Permet de prendre le premier caractère et de le mettre en majuscule et de prendre les autres caractères
            // Exemple : User
            command.options[i].type.slice(0, 1).toLowerCase() +
            command.options[i].type.slice(1, command.options[i].type.length)
          }Option`
        ]((option) =>
          option
            .setName(command.options[i].name)
            .setDescription(command.options[i].description)
            .setRequired(command.options[i].required)
        );
      }
    }

    await commands.push(slashcommand);
  });

  const rest = new REST({ version: "10" }).setToken(bot.token);

  await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });

  console.log("Les slashs commandes sont créees avec succès !");
};
