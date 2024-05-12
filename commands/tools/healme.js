const { channel } = require("diagnostics_channel");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const { MongoClient } = require("mongodb");

// const ficheBonus = require("../../BonusRollMeteo");
// const ficheSalonBonusLieu = require("../../salonBonus");
// const fichePerso = require("../../FichePerso");
// const ficheMeteo = require("../../meteo");
// const ficheMeteotest = require("../../salonMeteo");

//const ficheBagPerso = require("../../fichePersoSac");
//const wait = require("node:timers/prok omises").setTimeout;

function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("healme")
    .setDescription("Amélioration des compétences et de la résistance")
    .addSubcommand((subcommand) =>
      subcommand.setName("total").setDescription("Tout les PV sont restaurés.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("partiel")
        .setDescription("Choix du nombre de PV à restaurer.")
        .addNumberOption((option) =>
          option
            .setName("value")
            .setDescription("Valeur de l'augmentation")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const guildId = message.guildId;
    const guild = client.guilds.cache.get(guildId);
    // Vérifiez si l'objet Guild existe (par exemple, si le message a été envoyé dans un DM, guild sera undefined)

    // Obtenez le nom du serveur
    var guildName = guild.name;
    var guildName = guildName.split(" ").join("");
    var guildName = "test";
    // Utilisez guildName comme nécessaire
    console.log(`Le message a été posté dans le serveur : ${guildName}`);

    const mongoClient = new MongoClient(process.env["MONGODB_URI"], {});
    mongoClient.connect();
    console.log("Connecté à la base de données MongoDB");
    const database = mongoClient.db(guildName);
    const collection = database.collection("fichepersos");
    const collectionbag = database.collection("fichepersobags");

    if (interaction.member.roles.cache.has(authId.RoleRP.RolePlay)) {
      if (interaction.commandName === "healme") {
        // Le joueur qui fait la commande
        const user = interaction.user;
        // Insérez des données initiales
        var joueurFiche = await collection.findOne({
          _id: user.id,
        });
        if (interaction.options.getSubcommand() === "total") {
          var newPv = Math.round(
            15 + 0.2 * joueurFiche.Competence.Constitution
          );
          console.log("newPv : " + newPv);
          await collection.findOneAndUpdate(
            { _id: user.id },
            {
              $set: {
                "Identite.PV": newPv,
              },
            }
          );
          var joueurFiche = await collection.findOne({
            _id: user.id,
          });
          var newMessage =
            "Tu as maintenant " +
            joueurFiche.Identite.PV +
            " PV. Tu es au max de tes PV.";
        } else if (interaction.options.getSubcommand() === "partiel") {
          var ValueToAdd = interaction.options.getNumber("value");
          var oldPv = joueurFiche.Identite.PV;
          console.log("oldPv : " + oldPv);
          var newPv = oldPv + ValueToAdd;
          console.log("newPv : " + newPv);
          var maxPV = Math.round(
            15 + 0.2 * joueurFiche.Competence.Constitution
          );
          console.log("maxPV : " + maxPV);
          if (newPv > maxPV) {
            newPv = maxPV;
          }
          console.log("newPv : " + newPv);
          await collection.findOneAndUpdate(
            { _id: user.id },
            {
              $set: {
                "Identite.PV": newPv,
              },
            }
          );
          var joueurFiche = await collection.findOne({
            _id: user.id,
          });
          if (newPv == maxPV) {
            var newMessage =
              "Tu as maintenant " +
              joueurFiche.Identite.PV +
              " PV. Tu as atteint ton max.";
          } else {
            var newMessage =
              "Tu as maintenant " + joueurFiche.Identite.PV + " PV.";
          }
        }
      }
      await interaction.editReply({
        content: newMessage,
      });
    } else {
      var newMessage = `Tu n'as pas les autorisations pour faire ça ! Demande à Karma`;
      await interaction.editReply({
        content: newMessage,
      });
    }
  },
};
