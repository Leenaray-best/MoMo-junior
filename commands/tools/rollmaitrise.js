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
      if (interaction.commandName === "rollmaitrise") {
        let guildBonus = await ficheBonus.findOne({
          _id: authId.idDatabase.MeteoBonusId,
        });
        let guildBonusSalonLieu = await ficheSalonBonusLieu.findOne({
          _id: authId.idDatabase.BonusId,
        });

        let guildPerso = await fichePerso.findOne({
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
        console.log(guildMeteotest.Salon);
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
          var BonusSup = Number(0);
          var BonusCompetence = guildPerso.Competence.Survie;
          for (salonName in listSalonRp) {
            if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
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
            if (guildMeteo.Nuit == guildBonus.EauBonusNui[0]) {
              var BonusSup = Number(2);
            } else if (
              guildMeteo.Nuit == guildBonus.EauBonusNui[1] ||
              guildMeteo.Nuit == guildBonus.EauBonusNui[2]
            ) {
              var BonusSup = Number(1);
            } else if (guildMeteo.Nuit == guildBonus.EauBonusNui[3]) {
              var BonusSup = Number(-2);
            } else if (
              guildMeteo.Nuit == guildBonus.EauBonusNui[1] ||
              guildMeteo.Nuit == guildBonus.EauBonusNui[2]
            ) {
              var BonusSup = Number(-1);
            }
          }
        } else if (interaction.member.roles.cache.has(authId.RoleRP.Feu)) {
          var BonusSup = Number(0);
          var BonusCompetence = guildPerso.Competence.Intelligence;
          while (BonusSup == Number(0)) {
            for (salonName in listSalonRp) {
              if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
                tailleTableau = guildBonus.FeuBonus1.length;
                for (i = 0; i < tailleTableau; i++) {
                  if (catMeteo[salonName] == guildBonus.EauBonus1[i]) {
                    var BonusSup = Number(1);
                  }
                }
              }
            }
            if (catMeteo[salonName] == guildBonus.EauBonus1[0]) {
              var BonusSup = Number(-2);
            } else if (
              catMeteo[salonName] == guildBonus.EauBonus1[1] ||
              guildMeteo.Nuit == guildBonus.EauBonus2[0]
            ) {
              var BonusSup = Number(-1);
            }
          }
        } else if (interaction.member.roles.cache.has(authId.RoleRP.Air)) {
          var BonusSup = Number(0);
          var BonusCompetence = guildPerso.Competence.Adresse;
          if (interaction.member.roles.cache.has(authId.RoleRP.Chauve)) {
            var BonusSup = Number(1);
          }
        } else if (interaction.member.roles.cache.has(authId.RoleRP.Terre)) {
          var BonusSup = Number(0);
          var BonusCompetence = guildPerso.Competence.Constitution;
          for (i = 0; i < guildBonusSalonLieu.Terre.length; i++) {
            if (channelMessage.id == guildBonusSalonLieu.Terre[i])
              var BonusSup = Number(1);
          }
        }
        if (interaction.options.getString("categorie") == "sansopposition") {
          var ValRoll =
            valRandom + Number(BonusNiveauMaitrise) + Number(BonusSup);
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
                  "\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure"
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
                  " (bonus/malus Meteo/Carac/Lieu) = " +
                  ValRoll +
                  "\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique"
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
                  " (bonus/malus Meteo/Carac/Lieu) = " +
                  ValRoll +
                  "\rLa maitrise de ton element est correcte, tu reussis ton action sans briller"
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
                  " (bonus/malus Meteo/Carac/Lieu) = " +
                  ValRoll +
                  "\rLa maitrise de ton element est tres bonne, tu reussis ton action !"
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
                  " (bonus/malus Meteo/Carac/Lieu) = " +
                  ValRoll +
                  "\rBravo c'est une reussite critique ! Ton action est juste parfait"
              );
          }
        } else if (
          interaction.options.getString("categorie") == "avecopposition"
        ) {
          var ValRoll =
            valRandom +
            Number(BonusNiveauMaitrise) +
            Number(BonusCompetence) +
            Number(BonusSup);
          var BonnusAttaqueMix =
            Number(BonusNiveauMaitrise) +
            Number(BonusCompetence) +
            Number(BonusSup);
          if (ValRoll < 15) {
            client.channels.cache
              .get(authId.Salon.Jet)
              .send(
                "<@" +
                  user.id +
                  "> Ton attaque est de " +
                  valRandom +
                  " (roll) + " +
                  BonnusAttaqueMix +
                  " (bonus maitrise) = " +
                  ValRoll +
                  " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui feras pas de degat"
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
                  BonnusAttaqueMix +
                  " (bonus maitrise) = " +
                  ValRoll +
                  " \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes"
              );
          }
        }
        const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
        newMessage = `Go dans ${ChannelNameIdJet} pour voir ton resultat`;
        await interaction.editReply({
          content: newMessage,
        });
        await wait(5000);
        await interaction.deleteReply();
      }
    }
  },
};
