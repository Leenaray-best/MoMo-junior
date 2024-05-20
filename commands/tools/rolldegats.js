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
    .setName("rolldegat")
    .setDescription("Nombre de dégats infligés au joueur")
    .addStringOption((option) =>
      option
        .setName("attaque")
        .setRequired(true)
        .setDescription("Choix du type d'attaque")
        .addChoices(
          { name: "Force", value: "force" },
          { name: "Adresse", value: "adresse" },
          { name: "Maitrise", value: "maitrise" },
          { name: "Spirituel", value: "spiritualite" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Le joueur qu'on attaque")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const guildId = message.guildId;
    const guild = client.guilds.cache.get(guildId);
    // Vérifiez si l'objet Guild existe (par exemple, si le message a été envoyé dans un DM, guild sera undefined)
    console.log(`Le message a été posté dans le serveur : ${guild.name}`);

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

    // Le joueur qui fait la commande et donc qui attaque
    const user = interaction.user;
    let joueurFicheAttak = await collection.findOne({
      _id: user.id,
    });

    // le joueur qui subit les degats
    const joueur = interaction.options.getUser("target");
    // Insérez des données initiales
    let joueurFiche = await collection.findOne({
      _id: joueur.id,
    });
    if (
      interaction.member.roles.cache.has(authId.RoleRP.RolePlay) &&
      interaction.channelId == authId.Salon.Jet
    ) {
      if (interaction.commandName === "rolldegat") {
        if (interaction.options.getString("attaque") === "force") {
          var niveauForce = joueurFicheAttak.Competence.Force;
          console.log("niveauForce : " + niveauForce);
          var valeurDegats = Rand(3);
          console.log("valeurDegats : " + valeurDegats);
          var valeurDegats = Math.round(valeurDegats + 0.1 * niveauForce);
          console.log("valeurDegats + Force :" + valeurDegats);
          if (joueur.id != authId.staff.MoMoJr) {
            var niveauResistance = joueurFiche.ResistancePhy;
            console.log("niveauResistance : " + niveauResistance);
            var niveauPv = joueurFiche.Identite.PV;
            console.log("niveauPv :" + niveauPv);
            var valeurDegatsTotal = valeurDegats - niveauResistance;
            console.log("valeurDegatsTotal :" + valeurDegatsTotal);
            var newPv = niveauPv - valeurDegatsTotal;
            console.log("newPv :" + newPv);
            if (newPv < 0) {
              console.log("Pv neg");
              newPv = 0;
            }
            collection.updateOne(
              { _id: joueur.id },
              {
                $set: {
                  "Identite.PV": newPv,
                },
              }
            );
            let joueurUpdateFiche = await collection.findOne({
              _id: joueur.id,
            });
            var newValuePV = joueurUpdateFiche.Identite.PV;
          } else {
            var valeurDegatsTotal = valeurDegats;
          }
          //let joueurUpdateFiche = await collection.findOneAndUpdate(
          //  { _id: user.id },
          //  { "Identite.PV": newPv },
          //);
        } else if (interaction.options.getString("attaque") === "adresse") {
          var niveauAdresse = joueurFicheAttak.Competence.Adresse;
          console.log("niveauAdresse : " + niveauAdresse);
          var valeurDegats = Rand(3);
          console.log("valeurDegats :" + valeurDegats);
          var valeurDegats = Math.round(valeurDegats + 0.1 * niveauAdresse);
          console.log("valeurDegats + Adresse :" + valeurDegats);
          if (joueur.id == authId.staff.MoMoJr) {
            var valeurDegatsTotal = valeurDegats;
          } else {
            var niveauResistance = joueurFiche.ResistancePhy;
            console.log("niveauResistance : " + niveauResistance);
            var niveauPv = joueurFiche.Identite.PV;
            console.log("niveauPv :" + niveauPv);
            var valeurDegatsTotal = valeurDegats - niveauResistance;
            console.log("valeurDegatsTotal :" + valeurDegatsTotal);
            var newPv = niveauPv - valeurDegatsTotal;
            console.log("newPv :" + newPv);
            if (newPv < 0) {
              console.log("Pv neg");
              newPv = 0;
            }
            collection.updateOne(
              { _id: joueur.id },
              {
                $set: {
                  "Identite.PV": newPv,
                },
              }
            );
            let joueurUpdateFiche = await collection.findOne({
              _id: joueur.id,
            });
            var newValuePV = joueurUpdateFiche.Identite.PV;
          }
        } else if (interaction.options.getString("attaque") === "maitrise") {
          var niveauMaitrise = joueurFicheAttak.NiveauDeMaitrise;
          console.log("NiveauDeMaitrise : " + niveauMaitrise);
          var valeurDegats = Rand(4);
          console.log("valeurDegats :" + valeurDegats);
          var valeurDegats = Math.round(valeurDegats + 0.1 * niveauMaitrise);
          console.log("valeurDegats + Maitrise :" + valeurDegats);
          if (joueur.id == authId.staff.MoMoJr) {
            var valeurDegatsTotal = valeurDegats;
          } else {
            var niveauResistance = joueurFiche.ResistanceSpi;
            console.log("niveauResistance : " + niveauResistance);
            var niveauPv = joueurFiche.Identite.PV;
            console.log("niveauPv :" + niveauPv);
            var valeurDegatsTotal = valeurDegats - niveauResistance;
            console.log("valeurDegatsTotal :" + valeurDegatsTotal);
            var newPv = niveauPv - valeurDegatsTotal;
            console.log("newPv :" + newPv);
            if (newPv < 0) {
              console.log("Pv neg");
              newPv = 0;
            }
            collection.updateOne(
              { _id: joueur.id },
              {
                $set: {
                  "Identite.PV": newPv,
                },
              }
            );
            let joueurUpdateFiche = await collection.findOne({
              _id: joueur.id,
            });
            var newValuePV = joueurUpdateFiche.Identite.PV;
          }
        } else if (
          interaction.options.getString("attaque") === "spiritualite"
        ) {
          var niveauSpiritualite = joueurFicheAttak.Competence.Spiritualite;
          console.log("niveauSpiritualite : " + niveauSpiritualite);
          var valeurDegats = Rand(4);
          console.log("valeurDegats :" + valeurDegats);
          var valeurDegats = Math.round(
            valeurDegats + 0.1 * niveauSpiritualite
          );
          console.log("valeurDegats + Spiritualité :" + valeurDegats);
          if (joueur.id == authId.staff.MoMoJr) {
            console.log("Le joueur se bat contre un PNJ");
            var valeurDegatsTotal = valeurDegats;
          } else {
            var niveauResistance = joueurFiche.ResistanceSpi;
            console.log("niveauResistance : " + niveauResistance);
            var niveauPv = joueurFiche.Identite.PV;
            console.log("niveauPv :" + niveauPv);

            var valeurDegatsTotal = Number(valeurDegats - niveauResistance);
            console.log("valeurDegatsTotal :" + valeurDegatsTotal);
            var newPv = Number(niveauPv - valeurDegatsTotal);
            console.log("newPv :" + newPv);
            if (newPv < 0) {
              console.log("Pv neg");
              newPv = 0;
            }
            collection.updateOne(
              { _id: joueur.id },
              {
                $set: {
                  "Identite.PV": newPv,
                },
              }
            );
            let joueurUpdateFiche = await collection.findOne({
              _id: joueur.id,
            });
            var newValuePV = joueurUpdateFiche.Identite.PV;
          }
        }
        if (joueur.id == authId.staff.MoMoJr) {
          var newMessage =
            "Tu fais " + valeurDegats + " dégats au PNJ que tu combats";
        } else {
          if (newPv < 5) {
            if (newPv > 0) {
              var newMessage =
                "Tu fais " +
                valeurDegats +
                " (roll) dégats - " +
                niveauResistance +
                " (resistance) = " +
                valeurDegatsTotal +
                " (dégats totaux)\n <@" +
                joueur.id +
                ">, il te reste " +
                newValuePV +
                " PV\nATTENTION tu as moins de 5 PV";
            } else {
              var newMessage =
                "Tu fais " +
                valeurDegats +
                " (roll) dégats - " +
                niveauResistance +
                " (resistance) = " +
                valeurDegatsTotal +
                " (dégats totaux)\n <@" +
                joueur.id +
                ">, est KO ";
            }
          } else {
            var newMessage =
              "Tu fais " +
              valeurDegats +
              " (roll) dégats - " +
              niveauResistance +
              " (resistance) = " +
              valeurDegatsTotal +
              " (dégats totaux).\n <@" +
              joueur.id +
              ">, il te reste " +
              newValuePV +
              " PV.";
          }
        }

        await interaction.editReply({
          content: newMessage,
        });
      }
    } else {
      var newMessage = `Tu n'as pas les autorisations pour faire ça ! Demande à Karma`;
      await interaction.editReply({
        content: newMessage,
      });
    }

    //await wait(5000);
    //await interaction.deleteReply();
  },
};
