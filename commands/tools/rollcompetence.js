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
const FicheQuete = require("../../salonQuete");
const wait = require("node:timers/promises").setTimeout;
const math = require("mathjs");
function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rollcompetence")
    .setDescription("Roll de competence")
    .addStringOption((option) =>
      option
        .setName("opposition")
        .setDescription("Object to use")
        .setRequired(true)
        .addChoices(
          { name: "Avec", value: "avec" },
          { name: "Sans", value: "sans" }
        )
    )
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
    ),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    //console.log(interaction);
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    let guildQuete = await FicheQuete.findOne({
      _id: authId.idDatabase.questId,
    });
    const tailleTableauCat = guildQuete.AllCategorie.length;
    for (i = 0; i < tailleTableauCat; i++) {
      if (
        (user.id == authId.staff.emi ||
          interaction.member.roles.cache.has(authId.RoleRP.RolePlay)) &&
        interaction.channel.parent == guildQuete.AllCategorie[i]
      ) {
        if (interaction.commandName === "rollcompetence") {
          let guildPerso = await fichePerso.findOne({
            _id: user.id,
          });
          let guildPersoBag = await ficheBag.findOne({
            _id: user.id,
          });
          listeCompetence = [
            "force",
            "constitution",
            "charisme",
            "intelligence",
            "survie",
            "adresse",
            "spiritualite",
            "discretion",
          ];
          if (interaction.options.getString("opposition") === "sans") {
            valRoll = Rand(20);
            console.log(valRoll);
            for (i = 0; i < listeCompetence.length; i++) {
              if (
                interaction.options.getString("competence") ===
                listeCompetence[i]
              ) {
                if (
                  (interaction.member.roles.cache.has(
                    authId.RoleRP.SansForce
                  ) &&
                    i == 0) ||
                  (interaction.member.roles.cache.has(
                    authId.RoleRP.SansCharisme
                  ) &&
                    i == 2) ||
                  (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
                    i == 7)
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
                } else {
                  var NumberUp = guildPersoBag.Competence[i];

                  let ficheSac = await ficheBag.findOne({
                    _id: user.id,
                  });
                  console.log("Avant thé", valRoll);
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.TheLiang)
                  ) {
                    if (ficheSac.NbrePotion > 0 && ficheSac.Tour[0] > 0) {
                      console.log("Mon tour bonus est > 0");
                      BonusPotion = Number(ficheSac.ValeurBonus);
                      if (valRoll < 5) {
                        valRoll = 0;
                      } else {
                        var valRoll = valRoll - BonusPotion;
                      }
                      TourOld = ficheSac.Tour[0];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { Tour: TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[0] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.TheLiang);
                      if (ficheSacNew.NbrePotion == 0) {
                        const nombrePotionOld = ficheSacNew.NbrePotion;
                        console.log("Mon tour bonus est à 0");
                        await ficheBag.updateMany(
                          { _id: user.id },
                          {
                            $pull: {
                              Sac: { $in: [`${nombrePotionOld} Potion`] },
                            },
                          }
                        );
                        client.channels.cache
                          .get(authId.Salon.Jet)
                          .send(
                            `Les effets de potion ont disparu et tu n'as plus de potion dans ton inventaire`
                          );
                      } else {
                        client.channels.cache
                          .get(authId.Salon.Jet)
                          .send(`Les effets de potion ont disparu`);
                      }
                    }
                  }
                  console.log("Après thé", valRoll);
                  if (valRoll <= NumberUp) {
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
                  } else if (valRoll > NumberUp) {
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
          } else if (interaction.options.getString("opposition") === "avec") {
            valRoll = Rand(20);
            for (i = 0; i < listeCompetence.length; i++) {
              if (
                interaction.options.getString("competence") ===
                listeCompetence[i]
              ) {
                if (
                  (interaction.member.roles.cache.has(
                    authId.RoleRP.SansForce
                  ) &&
                    i == 0) ||
                  (interaction.member.roles.cache.has(
                    authId.RoleRP.SansCharisme
                  ) &&
                    i == 2) ||
                  (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
                    i == 7)
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
                } else {
                  var NumberUp = guildPersoBag.Competence[i];

                  console.log("Avant thé", valRoll);
                  console.log(NumberUp);
                  let ficheSac = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.TheLiang)
                  ) {
                    if (ficheSac.NbrePotion > 0 && ficheSac.Tour[0] > 0) {
                      console.log("Mon tour bonus est > 0");
                      BonusPotion = Number(ficheSac.ValeurBonus);
                      var valRoll = valRoll + BonusPotion;
                      TourOld = ficheSac.Tour[0];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { Tour: TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[0] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.TheLiang);
                      if (ficheSacNew.NbrePotion == 0) {
                        const nombrePotionOld = ficheSacNew.NbrePotion;
                        console.log("Mon tour bonus est à 0");
                        await ficheBag.updateMany(
                          { _id: user.id },
                          {
                            $pull: {
                              Sac: { $in: [`${nombrePotionOld} Potion`] },
                            },
                          }
                        );
                        client.channels.cache
                          .get(authId.Salon.Jet)
                          .send(
                            `Les effets de potion ont disparu et tu n'as plus de potion dans ton inventaire`
                          );
                      } else {
                        client.channels.cache
                          .get(authId.Salon.Jet)
                          .send(`Les effets de potion ont disparu`);
                      }
                    }
                  }
                  console.log("Apres the", valRoll);
                  var valTotal = valRoll + NumberUp;
                  console.log(valTotal);
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
          const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
          const newMessage = `Va dans ${ChannelNameIdJet} pour voir ton resultat`;
          // client.channels.cache
          //  .get(channelMessage)
          //  .send(newMessage)
          //  .then((msg) => setTimeout(() => msg.delete(), 5000));
          await interaction.editReply({
            content: newMessage,
          });
          //await interaction.editReply({});
          //  content: newMessage,
          //});
          await wait(5000);
          await interaction.deleteReply();
        }
      } else {
        console.log("Pas dans le bon salon");
        //const newMessage = `Tu n'as pas les autorisations pour faire ça, ou tu n'es pas dans la bon salon. Cette commande se fait seulement dans un salon de Rp`;
        //await interaction.editReply({
        //  content: newMessage,
        //});
      }
    }
  },
};

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("rollcompetence")
//     .setDescription("Roll de competence")
//     .addSubcommand((subcommand) =>
//       subcommand
//         .setName("sansopposition")
//         .setDescription("Roll competence SANS opposition")
//         .addStringOption((option) =>
//           option
//             .setName("competence")
//             .setRequired(true)
//             .setDescription("Choix")
//             .addChoices(
//               { name: "Force", value: "force" },
//               { name: "Constitution", value: "constitution" },
//               { name: "Charisme", value: "charisme" },
//               { name: "Intelligence", value: "intelligence" },
//               { name: "Survie", value: "survie" },
//               { name: "Adresse", value: "adresse" },
//               { name: "Spiritualité", value: "spiritualite" },
//               { name: "Discrétion", value: "discretion" }
//             )
//         )
//         .addStringOption((option) =>
//           option
//             .setName("objet")
//             .setDescription("Object to use")
//             .setRequired(true)
//             .addChoices(
//               { name: "Dague", value: "dague" },
//               { name: "Armure", value: "armure" },
//               { name: "Aucun", value: "aucun" }
//             )
//         )
//     )
//     .addSubcommand((subcommand) =>
//       subcommand
//         .setName("avecopposition")
//         .setDescription("Roll competence AVEC opposition")
//         .addStringOption((option) =>
//           option
//             .setName("competence")
//             .setRequired(true)
//             .setDescription("Choix")
//             .addChoices(
//               { name: "Force", value: "force" },
//               { name: "Constitution", value: "constitution" },
//               { name: "Charisme", value: "charisme" },
//               { name: "Intelligence", value: "intelligence" },
//               { name: "Survie", value: "survie" },
//               { name: "Adresse", value: "adresse" },
//               { name: "Spiritualité", value: "spiritualite" },
//               { name: "Discrétion", value: "discretion" }
//             )
//         )
//         .addStringOption((option) =>
//           option
//             .setName("objet")
//             .setDescription("Object to use")
//             .setRequired(true)
//             .addChoices(
//               { name: "Dague", value: "dague" },
//               { name: "Armure", value: "armure" },
//               { name: "Aucun", value: "aucun" }
//             )
//         )
//     ),

//   async execute(interaction, client) {
//     const message = await interaction.deferReply({
//       fetchReply: true,
//     });
//     // if (!interaction.isChatInputCommand()) return;
//     const user = interaction.user;
//     const channelMessage = interaction.channelId;
//     if (
//       user.id == authId.staff.emi ||
//       user.id == authId.staff.leena ||
//       user.id == authId.staff.meri
//     ) {
//       if (interaction.commandName === "rollcompetence") {
//         let guildPerso = await fichePerso.findOne({
//           _id: user.id,
//         });
//         let guildPersoBag = await ficheBag.findOne({
//           _id: user.id,
//         });
//         console.log(guildPersoBag);
//         let guildObjet = await ficheObjetRP.findOne({
//           _id: authId.idDatabase.FicheObject,
//         });
//         listeCompetence = [
//           "force",
//           "constitution",
//           "charisme",
//           "intelligence",
//           "survie",
//           "adresse",
//           "spiritualité",
//           "discretion",
//         ];
//         listeObject = ["dague", "armure"];
//         listeFicheObjet = [guildObjet.Dague, guildObjet.Armure];
//         if (interaction.options.getSubcommand() === "sansopposition") {
//           valRoll = Rand(20);
//           console.log(valRoll);
//           for (i = 0; i < listeCompetence.length; i++) {
//             if (
//               interaction.options.getString("competence") === listeCompetence[i]
//             ) {
//               if (
//                 (interaction.member.roles.cache.has(authId.RoleRP.SansForce) &&
//                   i == 0) ||
//                 (interaction.member.roles.cache.has(
//                   authId.RoleRP.SansCharisme
//                 ) &&
//                   i == 2) ||
//                 (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
//                   i == 7)
//               ) {
//                 if (
//                   interaction.options.getString("objet") === "dague" ||
//                   interaction.options.getString("objet") === "armure" ||
//                   interaction.options.getString("objet") === "aucun"
//                 ) {
//                   client.channels.cache
//                     .get(authId.Salon.Jet)
//                     .send(
//                       "<@" +
//                         user.id +
//                         ">Ton jet echoue. Il serait temps d'aller arranger cette situation !" +
//                         `\rTu peux repartir dans ${client.channels.cache.get(
//                           channelMessage
//                         )} pour trouver une solution`
//                     );
//                 }
//               } else {
//                 for (j = 0; j < listeObject.length; j++) {
//                   if (
//                     interaction.options.getString("objet") === listeObject[j]
//                   ) {
//                     console.log(interaction.options.getString("objet"));
//                     for (k = 0; k < guildPersoBag.Sac.length; k++) {
//                       if (
//                         interaction.options.getString("objet") ===
//                         guildPersoBag.Sac[k]
//                       ) {
//                         var testSiTricheur = true;
//                       }
//                     }
//                     if (testSiTricheur == true) {
//                       console.log(`Il utilise une ${listeObject[j]}`);
//                       console.log(guildPersoBag.Competence);
//                       console.log(listeFicheObjet[j]);
//                       var newList = math.add(
//                         guildPersoBag.Competence,
//                         listeFicheObjet[j]
//                       );
//                       console.log(newList);
//                       NumberUp = newList[i];
//                       console.log(NumberUp);
//                     } else {
//                       console.log("Oh le tricheur");
//                       client.channels.cache
//                         .get(authId.Salon.Jet)
//                         .send(
//                           "<@" +
//                             user.id +
//                             `> Tu n'as aucun objet à jouer, il te faut choisir l'option : Aucun` +
//                             `\rTu peux repartir dans ${client.channels.cache.get(
//                               channelMessage
//                             )} faire le bon jet`
//                         );
//                     }
//                   } else if (
//                     interaction.options.getString("objet") === "aucun"
//                   ) {
//                     var NumberUp = guildPersoBag.Competence[i];
//                     var testSiTricheur = true;
//                     console.log("Il n'a aucun objet");
//                     console.log(NumberUp);
//                   }
//                 }
//                 if (valRoll <= NumberUp && testSiTricheur == true) {
//                   client.channels.cache
//                     .get(authId.Salon.Jet)
//                     .send(
//                       "<@" +
//                         user.id +
//                         `> Ton roll de ${listeCompetence[i]} est de ` +
//                         valRoll +
//                         ", c'est une reussite" +
//                         `\rTu peux repartir dans ${client.channels.cache.get(
//                           channelMessage
//                         )}`
//                     );
//                 } else if (valRoll > NumberUp && testSiTricheur == true) {
//                   client.channels.cache
//                     .get(authId.Salon.Jet)
//                     .send(
//                       "<@" +
//                         user.id +
//                         `> Ton roll de ${listeCompetence[i]} est de ` +
//                         valRoll +
//                         ", c'est un echec" +
//                         `\rTu peux repartir dans ${client.channels.cache.get(
//                           channelMessage
//                         )}`
//                     );
//                 }
//                 var testSiTricheur = false;
//               }
//             }
//           }
//         } else if (interaction.options.getSubcommand() === "avecopposition") {
//           valRoll = Rand(20);
//           console.log(valRoll);
//           for (i = 0; i < listeCompetence.length; i++) {
//             if (
//               interaction.options.getString("competence") === listeCompetence[i]
//             ) {
//               if (
//                 (interaction.member.roles.cache.has(authId.RoleRP.SansForce) &&
//                   i == 0) ||
//                 (interaction.member.roles.cache.has(
//                   authId.RoleRP.SansCharisme
//                 ) &&
//                   i == 2) ||
//                 (interaction.member.roles.cache.has(authId.RoleRP.Putois) &&
//                   i == 7)
//               ) {
//                 if (
//                   interaction.options.getString("objet") === "dague" ||
//                   interaction.options.getString("objet") === "armure" ||
//                   interaction.options.getString("objet") === "aucun"
//                 ) {
//                   client.channels.cache
//                     .get(authId.Salon.Jet)
//                     .send(
//                       "<@" +
//                         user.id +
//                         ">Ton jet echoue. Il serait temps d'aller arranger cette situation !" +
//                         `\rTu peux repartir dans ${client.channels.cache.get(
//                           channelMessage
//                         )} pour trouver une solution`
//                     );
//                 }
//               } else {
//                 for (j = 0; j < listeObject.length; j++) {
//                   if (
//                     interaction.options.getString("objet") === listeObject[j]
//                   ) {
//                     for (k = 0; k < guildPersoBag.Sac.length; k++) {
//                       if (
//                         interaction.options.getString("objet") ===
//                         guildPersoBag.Sac[k]
//                       ) {
//                         var testSiTricheur = true;
//                       }
//                     }
//                     if (testSiTricheur == true) {
//                       console.log(`Il utilise une ${listeObject[j]}`);
//                       console.log(guildPersoBag.Competence);
//                       console.log(listeFicheObjet[j]);
//                       var newList = math.add(
//                         guildPersoBag.Competence,
//                         listeFicheObjet[j]
//                       );
//                       console.log(newList);
//                       NumberUp = newList[i];
//                       console.log(NumberUp);
//                     } else {
//                       console.log("Oh le tricheur");
//                       client.channels.cache
//                         .get(authId.Salon.Jet)
//                         .send(
//                           "<@" +
//                             user.id +
//                             `> Tu n'as aucun objet à jouer, il te faut choisir l'option : Aucun` +
//                             `\rTu peux repartir dans ${client.channels.cache.get(
//                               channelMessage
//                             )} faire le bon jet`
//                         );
//                     }
//                   } else if (
//                     interaction.options.getString("objet") === "aucun"
//                   ) {
//                     var testSiTricheur = true;
//                     var NumberUp = guildPersoBag.Competence[i];
//                     console.log("Il n'a aucun objet");
//                     console.log(NumberUp);
//                   }
//                 }
//                 if (testSiTricheur == true) {
//                   var valTotal = valRoll + NumberUp;
//                   client.channels.cache
//                     .get(authId.Salon.Jet)
//                     .send(
//                       "<@" +
//                         user.id +
//                         `> Ton roll de ${listeCompetence[i]} est de ` +
//                         valTotal +
//                         ", si ton roll est plus haut que celui de ton adversaire tu l'emporte !" +
//                         `\rTu peux repartir dans ${client.channels.cache.get(
//                           channelMessage
//                         )}`
//                     );
//                 }
//                 var testSiTricheur = false;
//               }
//             }
//           }
//         }
//         const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
//         newMessage = `Va dans ${ChannelNameIdJet} pour voir ton resultat`;
//         await interaction.editReply({
//           content: newMessage,
//         });
//         await wait(5000);
//         await interaction.deleteReply();
//       }
//     } else {
//       newMessage = `Tu n'as pas les autorisations pour faire ça`;
//       await interaction.editReply({
//         content: newMessage,
//       });
//     }
//   },
// };
