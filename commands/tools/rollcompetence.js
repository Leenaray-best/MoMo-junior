const { channel } = require("diagnostics_channel");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheBonus = require("../../BonusRollMeteo");
const ficheSalonBonusLieu = require("../../salonBonus");
const fichePerso = require("../../FichePerso");
const ficheMeteo = require("../../meteo");
const ficheMeteotest = require("../../salonMeteo");
const ficheBag = require("../../fichePersoSac");
const ficheObjetRP = require("../../ficheObjet");
const wait = require("node:timers/promises").setTimeout;
const math = require("mathjs");
function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rollcompetence")
    .setDescription("Roll de competence")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sansopposition")
        .setDescription("Roll competence SANS opposition")
        .addStringOption((option) =>
          option
            .setName("competence")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Force", value: "force" },
              { name: "Constitution", value: "constitution" },
              { name: "Charisme", value: "charisme" },
              { name: "Intelligence", value: "intelligence" },
              { name: "Survie", value: "survie" },
              { name: "Adresse", value: "adresse" },
              { name: "Spiritualité", value: "spiritualite" },
              { name: "Discrétion", value: "discretion" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("objet")
            .setDescription("Object to use")
            .setRequired(true)
            .addChoices(
              { name: "Dague", value: "dague" },
              { name: "Armure", value: "armure" },
              { name: "Aucun", value: "aucun" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("avecopposition")
        .setDescription("Roll competence AVEC opposition")
        .addStringOption((option) =>
          option
            .setName("competence")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Force", value: "force" },
              { name: "Constitution", value: "constitution" },
              { name: "Charisme", value: "charisme" },
              { name: "Intelligence", value: "intelligence" },
              { name: "Survie", value: "survie" },
              { name: "Adresse", value: "adresse" },
              { name: "Spiritualité", value: "spiritualite" },
              { name: "Discrétion", value: "discretion" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("objet")
            .setDescription("Object to use")
            .setRequired(true)
            .addChoices(
              { name: "Dague", value: "dague" },
              { name: "Armure", value: "armure" },
              { name: "Aucun", value: "aucun" }
            )
        )
    ),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    if (
      user.id == authId.staff.emi ||
      user.id == authId.staff.leena ||
      user.id == authId.staff.meri
    ) {
      if (interaction.commandName === "rollcompetence") {
        let guildPerso = await fichePerso.findOne({
          _id: user.id,
        });
        let guildPersoBag = await ficheBag.findOne({
          _id: user.id,
        });
        console.log(guildPersoBag);
        let guildObjet = await ficheObjetRP.findOne({
          _id: authId.idDatabase.FicheObject,
        });
        listeCompetence = [
          "force",
          "constitution",
          "charisme",
          "intelligence",
          "survie",
          "adresse",
          "spiritualité",
          "discretion",
        ];
        listeObject = ["dague", "armure"];
        listeFicheObjet = [guildObjet.Dague, guildObjet.Armure];
        if (interaction.options.getSubcommand() === "sansopposition") {
          valRoll = Rand(20);
          console.log(valRoll);
          for (i = 0; i < listeCompetence.length; i++) {
            if (
              interaction.options.getString("competence") === listeCompetence[i]
            ) {
              if (
                (interaction.member.roles.cache.has(authId.RoleRP.SansForce) &&
                  i == 0) ||
                (interaction.member.roles.cache.has(
                  authId.RoleRP.SansCharisme
                ) &&
                  i == 2) ||
                (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
                  i == 7)
              ) {
                if (
                  interaction.options.getString("objet") === "dague" ||
                  interaction.options.getString("objet") === "armure" ||
                  interaction.options.getString("objet") === "aucun"
                ) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        ">Ton jet echoue. Il serait temps d'aller arranger cette situation !" +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )} pour trouver une solution`
                    );
                }
              } else {
                for (j = 0; j < listeObject.length; j++) {
                  if (
                    interaction.options.getString("objet") === listeObject[j]
                  ) {
                    for (k = 0; k < guildPersoBag.Sac.length; k++) {
                      if (
                        interaction.options.getString("objet") ==
                        guildPersoBag.Sac[k]
                      ) {
                        var testSiTricheur = 0;
                      } else {
                        var testSiTricheur = 1;
                      }
                    }
                    if (testSiTricheur == 0) {
                      console.log(`Il utilise une ${listeObject[j]}`);
                      console.log(guildPersoBag.Competence);
                      console.log(listeFicheObjet[j]);
                      var newList = math.add(
                        guildPersoBag.Competence,
                        listeFicheObjet[j]
                      );
                      console.log(newList);
                      NumberUp = newList[i];
                      console.log(NumberUp);
                    } else {
                      console.log("Oh le tricheur");
                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(
                          "<@" +
                            user.id +
                            `> Tu n'as aucun objet à jouer, il te faut choisir l'option : Aucun` +
                            `\rTu peux repartir dans ${client.channels.cache.get(
                              channelMessage
                            )} faire le bon jet`
                        );
                    }
                  } else if (
                    interaction.options.getString("objet") === "aucun"
                  ) {
                    var NumberUp = guildPersoBag.Competence[i];
                    var testSiTricheur = 0;
                    console.log("Il n'a aucun objet");
                    console.log(NumberUp);
                  }
                }
                if (valRoll <= NumberUp && testSiTricheur == 0) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton roll de ${listeCompetence[i]} est de ` +
                        valRoll +
                        ", c'est une reussite" +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else if (valRoll > NumberUp && testSiTricheur == 0) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton roll de ${listeCompetence[i]} est de ` +
                        valRoll +
                        ", c'est un echec" +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                }
              }
            }
          }
        } else if (interaction.options.getSubcommand() === "avecopposition") {
          valRoll = Rand(20);
          console.log(valRoll);
          for (i = 0; i < listeCompetence.length; i++) {
            if (
              interaction.options.getString("competence") === listeCompetence[i]
            ) {
              if (
                (interaction.member.roles.cache.has(authId.RoleRP.SansForce) &&
                  i == 0) ||
                (interaction.member.roles.cache.has(
                  authId.RoleRP.SansCharisme
                ) &&
                  i == 2) ||
                (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
                  i == 7)
              ) {
                if (
                  interaction.options.getString("objet") === "dague" ||
                  interaction.options.getString("objet") === "armure" ||
                  interaction.options.getString("objet") === "aucun"
                ) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        ">Ton jet echoue. Il serait temps d'aller arranger cette situation !" +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )} pour trouver une solution`
                    );
                }
              } else {
                for (j = 0; j < listeObject.length; j++) {
                  if (
                    interaction.options.getString("objet") === listeObject[j]
                  ) {
                    for (k = 0; k < guildPersoBag.Sac.length; k++) {
                      if (
                        interaction.options.getString("objet") ===
                        guildPersoBag.Sac[k]
                      ) {
                        var testSiTricheur = 0;
                      } else {
                        var testSiTricheur = 1;
                      }
                    }
                    if (testSiTricheur == 0) {
                      console.log(`Il utilise une ${listeObject[j]}`);
                      console.log(guildPersoBag.Competence);
                      console.log(listeFicheObjet[j]);
                      var newList = math.add(
                        guildPersoBag.Competence,
                        listeFicheObjet[j]
                      );
                      console.log(newList);
                      NumberUp = newList[i];
                      console.log(NumberUp);
                    } else if (testSiTricheur == 1) {
                      console.log("Oh le tricheur");
                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(
                          "<@" +
                            user.id +
                            `> Tu n'as aucun objet à jouer, il te faut choisir l'option : Aucun` +
                            `\rTu peux repartir dans ${client.channels.cache.get(
                              channelMessage
                            )} faire le bon jet`
                        );
                    }
                  } else if (
                    interaction.options.getString("objet") === "aucun"
                  ) {
                    var testSiTricheur = 0;
                    var NumberUp = guildPersoBag.Competence[i];
                    console.log("Il n'a aucun objet");
                    console.log(NumberUp);
                  }
                }
                if (testSiTricheur == 0) {
                  var valTotal = valRoll + NumberUp;
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton roll de ${listeCompetence[i]} est de ` +
                        valTotal +
                        ", si ton roll est plus haut que celui de ton adversaire tu l'emporte !" +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                }
              }
            }
          }
        }
        const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
        newMessage = `Va dans ${ChannelNameIdJet} pour voir ton resultat`;
        await interaction.editReply({
          content: newMessage,
        });
        await wait(5000);
        await interaction.deleteReply();
      }
    }
  },
};
