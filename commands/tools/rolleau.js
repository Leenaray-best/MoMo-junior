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

const ficheBagPerso = require("../../fichePersoSac");
const wait = require("node:timers/promises").setTimeout;

function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolleau")
    .setDescription("Roll de maitrise")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sansopposition")
        .setDescription("roll maitrise sans opposition")
        .addNumberOption((option) =>
          option
            .setName("bonusmj")
            .setDescription("Valeur du bonus/malus attribué par la MJ")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("avecopposition")
        .setDescription("roll maitrise avec opposition")
        .addStringOption((option) =>
          option
            .setName("sousmaitrise")
            .setRequired(true)
            .setDescription("Choix de la sous-maitrise à utiliser")
            .addChoices(
              { name: "M3 : Le Glaçon", value: "glacon" },
              { name: "M3 : Le healer", value: "healer" },
              { name: "M16 : Puppet Master", value: "puppet" }
            )
        )
        .addNumberOption((option) =>
          option
            .setName("bonusmj")
            .setDescription("Valeur du bonus/malus attribué par la MJ")
            .setRequired(false)
        )
    ),

  // .addStringOption((option) =>
  //   option
  //     .setName("categorie")
  //     .setRequired(true)
  //     .setDescription("Choix")
  //     .addChoices(
  //       { name: "Sans Opposition", value: "sansopposition" },
  //       { name: "Avec Opposition", value: "avecopposition" }
  //     )
  // )

  // .addNumberOption((option) =>
  //   option
  //     .setName("bonusmj")
  //     .setDescription("Valeur du bonus/malus attribué par la MJ")
  //     .setRequired(false)
  // ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    console.log(user.id);
    //||interaction.member.roles.cache.has(authId.RoleRP.RolePlay)
    if (interaction.member.roles.cache.has(authId.RoleRP.Eau)) {
      if (user.id == authId.RoleRP.RoleStaff) {
        console.log(channelMessage);
        if (interaction.member.roles.cache.has(authId.RoleRP.Escargot)) {
          if (
            interaction.options.getString("categorie") == "sansopposition" ||
            interaction.options.getString("categorie") == "avecopposition"
          ) {
            client.channels.cache
              .get(authId.Salon.Jet)
              .send(
                "<@" +
                  user.id +
                  "> Ton jet échoue." +
                  `\rTu peux repartir dans ${client.channels.cache.get(
                    channelMessage
                  )} et trouver comment arranger cette situation`
              );
            const ChannelNameIdJet = client.channels.cache.get(
              authId.Salon.Jet
            );
            var newMessage = `Go dans ${ChannelNameIdJet} pour voir ton resultat`;
            await interaction.editReply({
              content: newMessage,
            });
            await wait(5000);
            await interaction.deleteReply();
          }
        } else {
          let guildBonus = await ficheBonus.findOne({
            _id: authId.idDatabase.MeteoBonusId,
          });
          let guildBonusSalonLieu = await ficheSalonBonusLieu.findOne({
            _id: authId.idDatabase.BonusId,
          });

          let guildPerso = await fichePerso.findOne({
            _id: user.id,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: user.id,
          });
          var valRandom = Rand(20);
          var BonusNiveauMaitrise = Number(guildPerso.NiveauDeMaitrise);
          const listSalonRp = [
            authId.RoleRP.PoleNord,
            authId.RoleRP.TempleAus,
            authId.RoleRP.NationFeu,
            authId.RoleRP.TempleOcc,
            authId.RoleRP.BaSingSe,
            authId.RoleRP.Omashu,
            authId.RoleRP.Marais,
            authId.RoleRP.Desert,
            authId.RoleRP.TempleOr,
            authId.RoleRP.IleKyoshi,
            authId.RoleRP.TempleBor,
            authId.RoleRP.PoleSud,
          ];
          let guildMeteo = await ficheMeteo.findOne({
            _id: authId.idDatabase.meteoId,
          });
          let guildMeteotest = await ficheMeteotest.findOne({
            _id: authId.idDatabase.meteotestId,
          });

          const catMeteo = [
            guildMeteo.PoleNord,
            guildMeteo.TempleAus,
            guildMeteo.NationFeu,
            guildMeteo.TempleOcc,
            guildMeteo.BaSingSe,
            guildMeteo.Omashu,
            guildMeteo.Marais,
            guildMeteo.Desert,
            guildMeteo.TempleOr,
            guildMeteo.IleKyoshi,
            guildMeteo.TempleBor,
            guildMeteo.PoleSud,
          ];
          // For Water Bender Bonus meteo involved
          var BonusSup = 0;
          console.log(BonusSup);
          var BonusCompetence = guildPerso.Competence.Survie;
          console.log(BonusCompetence);
          for (salonName in listSalonRp) {
            if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
              console.log("Ton perso est bien dans un salon RP");
              tailleTableau = guildBonus.EauBonus1.length;
              for (i = 0; i < tailleTableau; i++) {
                if (catMeteo[salonName] == guildBonus.EauBonus1[i]) {
                  var BonusSup = Number(1);
                }
              }
            }
          }

          if (BonusSup == Number(0)) {
            for (salonName in listSalonRp) {
              if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
                console.log("Ton perso est bien dans un salon RP");
                tailleTableau = guildBonus.EauBonus2.length;
                for (i = 0; i < tailleTableau; i++) {
                  if (catMeteo[salonName] == guildBonus.EauBonus2[i]) {
                    var BonusSup = Number(2);
                  }
                }
              }
            }
          }
          if (
            message.createdAt.getHours() >= 16 ||
            message.createdAt.getHours() <= 3
          ) {
            console.log(
              "Ton perso est bien dans un salon RP et il fait nuit. "
            );
            console.log(guildMeteo.Nuit);
            console.log(guildBonus.EauBonusNuit[0]);
            console.log(guildBonus.EauBonusNuit[1]);
            console.log(guildBonus.EauBonusNuit[2]);
            console.log(guildBonus.EauBonusNuit[3]);
            if (guildMeteo.Nuit == guildBonus.EauBonusNuit[0]) {
              var BonusSup = Number(2);
            } else if (
              guildMeteo.Nuit == guildBonus.EauBonusNuit[1] ||
              guildMeteo.Nuit == guildBonus.EauBonusNuit[2]
            ) {
              var BonusSup = Number(1);
            } else if (guildMeteo.Nuit == guildBonus.EauBonusNuit[3]) {
              var BonusSup = Number(-2);
            } else if (
              guildMeteo.Nuit == guildBonus.EauBonusNuit[4] ||
              guildMeteo.Nuit == guildBonus.EauBonusNuit[5]
            ) {
              var BonusSup = Number(-1);
            }
            console.log("Tu sors de la boucle des maitres de l'eau");
          }

          if (interaction.options.getSubcommand() == "sansopposition") {
            console.log("Tu fais du sans opposition");
            console.log("BonusSup avant The", BonusSup);
            if (interaction.member.roles.cache.has(authId.RoleRP.TheLiang)) {
              if (ficheSac.Tour[0] > 0) {
                console.log("Mon tour bonus est > 0");
                BonusPotion = Number(ficheSac.ValeurBonus);
                var BonusSup = BonusSup + BonusPotion;
                TourOld = ficheSac.Tour[0];
                TourNew = TourOld - 1;
                await ficheBagPerso.findOneAndUpdate(
                  { _id: user.id },
                  { "Tour.0": TourNew }
                );
              }
              let ficheSacNew = await ficheBagPerso.findOne({
                _id: user.id,
              });
              if (ficheSacNew.Tour[0] == 0) {
                interaction.member.roles.remove(authId.RoleRP.TheLiang);

                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(`Les effets de potion ont disparu`);
              }
            }
            if (interaction.member.roles.cache.has(authId.RoleRP.Poison)) {
              if (ficheSac.Tour[1] > 0) {
                console.log("Mon tour malus est > 0");
                MalusPoison = Number(ficheSac.ValeurBonus);
                var BonusSup = BonusSup - MalusPoison;
                TourOld = ficheSac.Tour[1];
                TourNew = TourOld - 1;
                await ficheBagPerso.findOneAndUpdate(
                  { _id: user.id },
                  { "Tour.1": TourNew }
                );
              }
              let ficheSacNew = await ficheBagPerso.findOne({
                _id: user.id,
              });
              if (ficheSacNew.Tour[1] == 0) {
                interaction.member.roles.remove(authId.RoleRP.Poison);

                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(`Les effets du poison ont disparu`);
              }
            }
            console.log("BonusSup si The/Poison", BonusSup);
            // TEST SI BONUS/MALUS MJ
            if (interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)) {
              var BonusMJ = interaction.options.getNumber("bonusmj");

              var BonusSup = BonusSup + BonusMJ;
            }
            console.log("Après Bonus/Malus MJ", BonusSup);
            var ValRoll =
              valRandom + Number(BonusNiveauMaitrise) + Number(BonusSup);
            console.log(ValRoll);
            if (ValRoll <= 1) {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    BonusNiveauMaitrise +
                    " (bonus/malus maitrise) + " +
                    BonusSup +
                    " (bonus/malus Meteo/Carac/Lieu) = " +
                    ValRoll +
                    "\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            } else if (ValRoll <= 12) {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    BonusNiveauMaitrise +
                    " (bonus/malus maitrise) + " +
                    BonusSup +
                    " (bonus/malus Meteo/Potion/Lieu) = " +
                    ValRoll +
                    "\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            } else if (ValRoll <= 19) {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    BonusNiveauMaitrise +
                    " (bonus/malus maitrise) + " +
                    BonusSup +
                    " (bonus/malus Meteo/Potion/Lieu) = " +
                    ValRoll +
                    "\rLa maitrise de ton element est correcte, tu reussis ton action sans briller" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            } else if (ValRoll <= 24) {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    BonusNiveauMaitrise +
                    " (bonus/malus maitrise) + " +
                    BonusSup +
                    " (bonus/malus Meteo/Potion/Lieu) = " +
                    ValRoll +
                    "\rLa maitrise de ton element est tres bonne, tu reussis ton action !" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            } else {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    BonusNiveauMaitrise +
                    " (bonus/malus maitrise) + " +
                    BonusSup +
                    " (bonus/malus Meteo/Potion/Lieu) = " +
                    ValRoll +
                    "\rBravo c'est une reussite critique ! Ton action est juste parfait" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            }
          } else if (interaction.options.getSubcommand() == "avecopposition") {
            var BonnusAttaqueMix =
              Number(BonusNiveauMaitrise) +
              Number(BonusCompetence) +
              Number(BonusSup);
            console.log("Avant thé", BonnusAttaqueMix);
            if (interaction.member.roles.cache.has(authId.RoleRP.TheLiang)) {
              if (ficheSac.Tour[0] > 0) {
                console.log("Mon tour bonus est > 0");
                BonusPotion = Number(ficheSac.ValeurBonus);
                var BonnusAttaqueMix = BonnusAttaqueMix + BonusPotion;
                TourOld = ficheSac.Tour[0];
                TourNew = TourOld - 1;
                await ficheBagPerso.findOneAndUpdate(
                  { _id: user.id },
                  { "Tour.0": TourNew }
                );
              }
              let ficheSacNew = await ficheBagPerso.findOne({
                _id: user.id,
              });
              if (ficheSacNew.Tour[0] == 0) {
                interaction.member.roles.remove(authId.RoleRP.TheLiang);

                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(`Les effets de potion ont disparu`);
              }
            }
            if (interaction.member.roles.cache.has(authId.RoleRP.Poison)) {
              if (ficheSac.Tour[1] > 0) {
                console.log("Mon tour bonus est > 0");
                MalusPoison = Number(ficheSac.ValeurBonus);
                var BonnusAttaqueMix = BonnusAttaqueMix - MalusPoison;
                TourOld = ficheSac.Tour[1];
                TourNew = TourOld - 1;
                await ficheBagPerso.findOneAndUpdate(
                  { _id: user.id },
                  { "Tour.1": TourNew }
                );
              }
              let ficheSacNew = await ficheBagPerso.findOne({
                _id: user.id,
              });
              if (ficheSacNew.Tour[1] == 0) {
                interaction.member.roles.remove(authId.RoleRP.Poison);

                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(`Les effets du poison ont disparu`);
              }
            }
            console.log("Apres thé", BonnusAttaqueMix);
            // TEST SI BONUS/MALUS MJ
            if (interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)) {
              var BonusMJ = interaction.options.getNumber("bonusmj");

              var BonnusAttaqueMix = BonnusAttaqueMix + BonusMJ;
            }
            console.log("Après Bonus/Malus MJ", BonnusAttaqueMix);
            var ValRoll = valRandom + BonnusAttaqueMix;
            if (ValRoll < 15) {
              var MessageFinish =
                "<@" +
                user.id +
                "> Ton attaque est de " +
                valRandom +
                " (roll) + " +
                BonnusAttaqueMix +
                " (bonus maitrise) = " +
                ValRoll +
                " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, ton action ne fonctionne pas";
              /// MESSAGE RESULTAT DANS JET

              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  `${MessageFinish}` +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            } else {
              // Si il utilise sa M3 Heal
              var Valheal = Rand(5);
              var MessageHeal =
                "Tu peux te rajouter a toi ou a un de tes camarades " +
                Valheal +
                "PV";
              // Si il utilise sa M3 GLACON
              var MessageGlace =
                "Tu immobilises ton adversaire qui perd un tour et prend 1 dégât sans contre et sans jet. (2 dégâts si maître du feu). \n Tu enchaînes avec un tour sans opposition pour attaquer, fuir, autre, lui et les membres de son équipe.";
              var MessageFinish =
                "<@" +
                user.id +
                "> Ton attaque est de " +
                valRandom +
                " (roll) + " +
                BonnusAttaqueMix +
                " (bonus maitrise) = " +
                ValRoll +
                " \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes";
              // Si il utilise sa M16 Puppet
              var MessagePuppet =
                "Tu peux controler jusqu'à 3 personnages (joueur ou PNJ) pendant 10 actions.\n Toutes les 3 actions le joueur/PNJ doit faire un jet de constitution sans opposition. Il sera réussi si inférieur à 10.";
              var MessageFinish =
                "<@" +
                user.id +
                "> Ton attaque est de " +
                valRandom +
                " (roll) + " +
                BonnusAttaqueMix +
                " (bonus maitrise) = " +
                ValRoll +
                " \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes";

              /// MESSAGE RESULTAT DANS JET
              if (
                interaction.options.getSubcommand() == "avecopposition" &&
                interaction.options.getString("sousmaitrise") == "healer"
              ) {
                if (
                  interaction.member.roles.cache.has(authId.RoleRP.CapaciteSoin)
                ) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      `${MessageFinish}` +
                        `${MessageHeal}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(`Tu n'as pas la bonne capacité`);
                }
              } else if (
                interaction.options.getSubcommand() == "avecopposition" &&
                interaction.options.getString("sousmaitrise") === "glacon"
              ) {
                if (
                  interaction.member.roles.cache.has(
                    authId.RoleRP.MaitriseGlace
                  )
                ) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      `${MessageFinish}` +
                        `${MessageGlace}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(`Tu n'as pas la bonne capacité`);
                }
              } else if (
                interaction.options.getSubcommand() == "avecopposition" &&
                interaction.options.getString("sousmaitrise") === "puppet"
              ) {
                if (
                  interaction.member.roles.cache.has(authId.RoleRP.MaitriseSang)
                ) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      `${MessageFinish}` +
                        `${MessageGlace}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(`Tu n'as pas la bonne capacité`);
                }
              } else {
                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(
                    `${MessageFinish}` +
                      `${MessagePuppet}` +
                      `\rTu peux repartir dans ${client.channels.cache.get(
                        channelMessage
                      )}`
                  );
              }
            }
          }

          //// METTRE LA COMMANDE DANS LES LOG
          var fichePer = await FichePerso.findOne({ _id: user.id });
          let MessageLog =
            interaction.commandName +
            interaction.options.getSubcommand() +
            interaction.options.getString("sousmaitrise");
          const cont = `${fichePer.Identite.Prenom} ${
            fichePer.Identite.Nom
          } - ${client.channels.cache.get(
            message.channel.id
          )}: ${MessageLog}\n`;
          console.log(cont);
          client.channels.cache.get(auth.Salon.LogMessage).send(cont);

          // INDICATION DU SALON JET
          const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
          const newMessage = `Go dans ${ChannelNameIdJet} pour voir ton resultat`;
          // client.channels.cache
          //   .get(channelMessage)
          //   .send(newMessage)
          //  .then((msg) => setTimeout(() => msg.delete(), 4000));
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
        const newMessage = `Tu n'as pas les autorisations pour faire ça, ou tu n'es pas dans la bon salon. Cette commande se fait seulement dans un salon de Rp`;
        await interaction.editReply({
          content: newMessage,
        });
      }
    } else {
      var newMessage = `M'enfin tu n'es pas un maître de l'eau !`;
      await interaction.editReply({
        content: newMessage,
      });
      await wait(5000);
      await interaction.deleteReply();
    }
  },
};
