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
    .setName("rollmaitrise")
    .setDescription("Roll de maitrise")
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setRequired(true)
        .setDescription("Choix")
        .addChoices(
          { name: "Sans Opposition", value: "sansopposition" },
          { name: "Avec Opposition", value: "avecopposition" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("bonusmj")
        .setDescription("Valeur du bonus/malus attribué par la MJ")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    console.log(user.id);

    if (interaction.commandName === "rollmaitrise") {
      if (
        user.id == authId.staff.emi ||
        interaction.member.roles.cache.has(authId.RoleRP.RolePlay)
      ) {
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
            newMessage = `Go dans ${ChannelNameIdJet} pour voir ton resultat`;
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
          if (interaction.member.roles.cache.has(authId.RoleRP.Eau)) {
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
                if (
                  interaction.member.roles.cache.has(listSalonRp[salonName])
                ) {
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
          } else if (interaction.member.roles.cache.has(authId.RoleRP.Feu)) {
            var BonusSup = Number(0);
            var BonusCompetence = guildPerso.Competence.Intelligence;

            for (salonName in listSalonRp) {
              if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
                console.log(guildBonus);
                console.log("Je suis feu");
                tailleTableau = guildBonus.FeuBonus1.length;
                for (i = 0; i < tailleTableau; i++) {
                  if (catMeteo[salonName] == guildBonus.FeuBonus1[i]) {
                    var BonusSup = Number(1);
                  } else if (catMeteo[salonName] == guildBonus.EauBonus1[1]) {
                    var BonusSup = Number(-2);
                  } else if (
                    catMeteo[salonName] == guildBonus.EauBonus1[0] ||
                    catMeteo[salonName] == guildBonus.EauBonus2[0]
                  ) {
                    var BonusSup = Number(-1);
                  }
                }
              }
            }
          } else if (interaction.member.roles.cache.has(authId.RoleRP.Air)) {
            var BonusSup = Number(0);
            var BonusCompetence = guildPerso.Competence.Adresse;
            if (interaction.member.roles.cache.has(authId.RoleRP.Chauve)) {
              var BonusSup = Number(1);
            }
            for (i = 0; i < ficheSac.Sac.length; i++) {
              if (ficheSac.Sac[i] == "baton") {
                BonusSup = BonusSup + 1;
              }
            }
          } else if (interaction.member.roles.cache.has(authId.RoleRP.Terre)) {
            console.log(guildBonusSalonLieu);
            console.log(channelMessage);
            var BonusSup = Number(0);
            var BonusCompetence = guildPerso.Competence.Constitution;
            for (i = 0; i < guildBonusSalonLieu.Terre.length; i++) {
              if (channelMessage == guildBonusSalonLieu.Terre[i])
                var BonusSup = Number(1);
            }
          }

          var pallierMaitrise = guildPerso.NiveauDeMaitrise;
          if (
            pallierMaitrise == 1 ||
            pallierMaitrise == 2 ||
            pallierMaitrise == 3
          ) {
            var ratioPallier = 0.7;
          } else if (
            pallierMaitrise == 4 ||
            pallierMaitrise == 5 ||
            pallierMaitrise == 6 ||
            pallierMaitrise == 7
          ) {
            var ratioPallier = 0.6;
          } else if (
            pallierMaitrise == 8 ||
            pallierMaitrise == 9 ||
            pallierMaitrise == 10 ||
            pallierMaitrise == 11
          ) {
            var ratioPallier = 0.5;
          } else if (
            pallierMaitrise == 12 ||
            pallierMaitrise == 13 ||
            pallierMaitrise == 14 ||
            pallierMaitrise == 15
          ) {
            var ratioPallier = 0.5;
          } else if (
            pallierMaitrise == 16 ||
            pallierMaitrise == 17 ||
            pallierMaitrise == 18
          ) {
            var ratioPallier = 0.5;
          } else if (pallierMaitrise == 19 || pallierMaitrise == 20) {
            var ratioPallier = 0.5;
          }
          console.log(ratioPallier);
          var BonusMeteo = BonusSup;
          var BonusCompetence = Math.round(ratioPallier * BonusCompetence);
          console.log(BonusMeteo);
          console.log(BonusCompetence);
          if (interaction.options.getString("categorie") == "sansopposition") {
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
            } else {
              var BonusMJ = 0;
              var BonusSup = BonusSup + BonusMJ;
            }
            console.log("Après Bonus/Malus MJ", BonusSup);
            var ValRoll =
              valRandom + Number(BonusNiveauMaitrise) + Number(BonusSup);
            console.log(ValRoll);
            if (ValRoll <= 5) {
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
            } else if (ValRoll <= 10) {
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
            } else if (ValRoll <= 17) {
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
          } else if (
            interaction.options.getString("categorie") == "avecopposition"
          ) {
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
            } else {
              var BonusMJ = 0;
              var BonusSup = BonusSup + BonusMJ;
            }
            console.log("Après Bonus/Malus MJ", BonnusAttaqueMix);
            var ValRoll = valRandom + BonnusAttaqueMix;
            if (ValRoll < 15) {
              client.channels.cache
                .get(authId.Salon.Jet)
                .send(
                  "<@" +
                    user.id +
                    "> Ton attaque est de " +
                    valRandom +
                    " (roll) + " +
                    Number(BonusNiveauMaitrise) +
                    Number(BonusCompetence) +
                    " (bonus maitrise) " +
                    BonusSup +
                    " (bonus meteo/terrain/physique) " +
                    BonusPotion -
                    MalusPoison +
                    " (bonus poison/potion) =" +
                    ValRoll +
                    " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui feras pas de degat" +
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
                    Number(BonusNiveauMaitrise) +
                    Number(BonusCompetence) +
                    " (bonus maitrise) " +
                    BonusSup +
                    " (bonus meteo/terrain/physique) " +
                    BonusPotion -
                    MalusPoison +
                    " (bonus poison/potion) =" +
                    ValRoll +
                    " \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes" +
                    `\rTu peux repartir dans ${client.channels.cache.get(
                      channelMessage
                    )}`
                );
            }
          }

          //// METTRE LA COMMANDE DANS LES LOG
          //let fichePer = await FichePerso.findOne({ _id: user.id });
          if (
            interaction.options.getNumber("bonusmj") > 0 &&
            interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)
          ) {
            var MessageLog =
              `${interaction.commandName}` +
              ` ${interaction.options.getString("categorie")}` +
              "Bonus/Malus MJ de" +
              ` ${interaction.options.getNumber("bonusmj")}`;
          } else {
            var MessageLog =
              `${interaction.commandName}` +
              ` ${interaction.options.getString("categorie")}` +
              " sans bonus/malus MJ";
          }
          const cont = `${guildPerso.Identite.Prenom} ${
            guildPerso.Identite.Nom
          } - ${client.channels.cache.get(
            message.channel.id
          )}: ${MessageLog}\n`;
          console.log(cont);
          client.channels.cache.get(authId.Salon.LogMessage).send(`${cont}`);

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
    }
  },
};
