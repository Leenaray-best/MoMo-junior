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
          { name: "Sans", value: "sans" },
          { name: "Avec", value: "avec" }
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
                    if (ficheSac.Tour[0] > 0) {
                      console.log("Mon tour bonus est > 0");
                      BonusPotion = Number(ficheSac.ValeurBonus);

                      var valRoll = valRoll - BonusPotion;

                      TourOld = ficheSac.Tour[0];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { "Tour.0": TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[0] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.TheLiang);

                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(`Les effets de potion ont disparu`);
                    }
                  }
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Poison)
                  ) {
                    if (ficheSac.Tour[1] > 0) {
                      console.log("Mon tour bonus est > 0");
                      MalusPoison = Number(ficheSac.ValeurBonus);

                      var valRoll = valRoll + MalusPoison;

                      TourOld = ficheSac.Tour[1];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { "Tour.1": TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[1] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.Poison);

                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(`Les effets du poison ont disparu`);
                    }
                  }
                  console.log("Après thé/poison", valRoll);
                  // TEST SI ILS ONT UNE EPEE
                  if (
                    ficheSac.Tour[2] > 0 &&
                    interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                    interaction.options.getString("competence") === "force"
                  ) {
                    console.log("TU AS UNE EPEE");
                    const BonusEpee = 3;

                    var valRoll = valRoll - BonusEpee;

                    TourOld = ficheSac.Tour[2];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.2": TourNew }
                    );
                  }
                  let ficheSacEpee = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                    ficheSacEpee.Tour[2] == 0 &&
                    interaction.options.getString("competence") === "force"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Epée`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Epee);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ton épée se casse sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  // TEST SI ILS ONT UNE DAGUE
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Dague) &&
                    ficheSac.Tour[3] > 0 &&
                    interaction.options.getString("competence") === "adresse"
                  ) {
                    console.log("TU AS UNE DAGUE");
                    const BonusDague = 3;

                    var valRoll = valRoll - BonusDague;

                    TourOld = ficheSac.Tour[3];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.3": TourNew }
                    );
                  }
                  let ficheSacDague = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Dague) &&
                    ficheSacDague.Tour[3] == 0 &&
                    interaction.options.getString("competence") === "adresse"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Dague`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Dague);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ta dague se casse sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  // TEST SI ILS ONT UNE ARMURE
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                    ficheSac.Tour[4] > 0 &&
                    interaction.options.getString("competence") ===
                      "constitution"
                  ) {
                    console.log("TU AS UNE ARMURE");
                    const BonusArmure = 3;

                    var valRoll = valRoll - BonusArmure;

                    TourOld = ficheSac.Tour[4];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.4": TourNew }
                    );
                  }
                  let ficheSacArmure = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                    ficheSacArmure.Tour[4] == 0 &&
                    interaction.options.getString("competence") ===
                      "constitution"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Armure`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Armure);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ton armure se brise sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  console.log("Après Epee/Dague/Armure", valRoll);
                  // TEST SI ILS ONT LE ROLE BONUS MJ
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)
                  ) {
                    var BonusMJ = interaction.options.getNumber("bonusmj");

                    var valRoll = valRoll - BonusMJ;
                  } else {
                    var BonusMJ = 0;

                    var valRoll = valRoll - BonusMJ;
                  }
                  console.log("Après Bonus/Malus MJ", valRoll);

                  // BONUS SALON POUR L'HERBORISTE
                  let guildQuete = await FicheQuete.findOne({
                    _id: authId.idDatabase.BonusId,
                  });
                  console.log(authId.idDatabase.BonusId);
                  const tailleTableau = guildQuete.Eau.length;
                  for (i = 0; i < tailleTableau; i++) {
                    if (
                      channelMessage == guildQuete.Eau[i] &&
                      interaction.member.roles.cache.has(
                        authId.RoleRP.MaitrisePlante
                      )
                    ) {
                      var BonusHerboriste = 6;
                      var valRoll = valRoll - BonusHerboriste;
                    } else {
                      var BonusHerboriste = 0;
                      var valRoll = valRoll - BonusHerboriste;
                    }
                  }

                  if (valRoll < 0) {
                    valRoll = 0;
                  }
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
                    if (ficheSac.Tour[0] > 0) {
                      console.log("Mon tour bonus est > 0");
                      BonusPotion = Number(ficheSac.ValeurBonus);
                      var valRoll = valRoll + BonusPotion;
                      TourOld = ficheSac.Tour[0];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { "Tour.0": TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[0] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.TheLiang);

                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(`Les effets de potion ont disparu`);
                    }
                  }
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Poison)
                  ) {
                    if (ficheSac.Tour[1] > 0) {
                      console.log("Mon tour bonus est > 0");
                      MalusPoison = Number(ficheSac.ValeurBonus);

                      var valRoll = valRoll - MalusPoison;

                      TourOld = ficheSac.Tour[1];
                      TourNew = TourOld - 1;
                      await ficheBag.findOneAndUpdate(
                        { _id: user.id },
                        { "Tour.1": TourNew }
                      );
                    }
                    let ficheSacNew = await ficheBag.findOne({
                      _id: user.id,
                    });
                    if (ficheSacNew.Tour[1] == 0) {
                      interaction.member.roles.remove(authId.RoleRP.Poison);

                      client.channels.cache
                        .get(authId.Salon.Jet)
                        .send(`Les effets du poison ont disparu`);
                    }
                  }
                  console.log("Après thé/poison", valRoll);
                  // TEST SI ILS ONT UNE EPEE
                  if (
                    ficheSac.Tour[2] > 0 &&
                    interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                    interaction.options.getString("competence") === "force"
                  ) {
                    console.log("TU AS UNE EPEE");
                    const BonusEpee = 3;

                    var valRoll = valRoll + BonusEpee;

                    TourOld = ficheSac.Tour[2];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.2": TourNew }
                    );
                  }
                  let ficheSacEpee = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                    ficheSacEpee.Tour[2] == 0 &&
                    interaction.options.getString("competence") === "force"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Epée`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Epee);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ton épée se casse sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  // TEST SI ILS ONT UNE DAGUE
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Dague) &&
                    ficheSac.Tour[3] > 0 &&
                    interaction.options.getString("competence") === "adresse"
                  ) {
                    console.log("TU AS UNE DAGUE");
                    const BonusDague = 3;

                    var valRoll = valRoll + BonusDague;

                    TourOld = ficheSac.Tour[3];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.3": TourNew }
                    );
                  }
                  let ficheSacDague = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Dague) &&
                    ficheSacDague.Tour[3] == 0 &&
                    interaction.options.getString("competence") === "adresse"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Dague`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Dague);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ta dague se casse sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  // TEST SI ILS ONT UNE ARMURE
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                    ficheSac.Tour[4] > 0 &&
                    interaction.options.getString("competence") ===
                      "constitution"
                  ) {
                    console.log("TU AS UNE ARMURE");
                    const BonusArmure = 3;

                    var valRoll = valRoll + BonusArmure;

                    TourOld = ficheSac.Tour[4];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { "Tour.4": TourNew }
                    );
                  }
                  let ficheSacArmure = await ficheBag.findOne({
                    _id: user.id,
                  });
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                    ficheSacArmure.Tour[4] == 0 &&
                    interaction.options.getString("competence") ===
                      "constitution"
                  ) {
                    await ficheBag.updateMany(
                      { _id: user.id },
                      {
                        $pull: {
                          Sac: { $in: [`1 Armure`] },
                        },
                      }
                    );
                    interaction.member.roles.remove(authId.RoleRP.Armure);
                    client.channels.cache
                      .get(authId.Salon.Jet)
                      .send(
                        `OH NO !!! Ton armure se brise sur ce dernier coup ! Il va falloir aller en acheter une autre chez **Bric et Broc**`
                      );
                  }
                  console.log("Après Epee/Dague/Armure", valRoll);
                  // TEST SI ILS ONT LE ROLE BONUS MJ
                  if (
                    interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)
                  ) {
                    var BonusMJ = interaction.options.getNumber("bonusmj");
                    var valRoll = valRoll + BonusMJ;
                  } else {
                    var BonusMJ = 0;

                    var valRoll = valRoll + BonusMJ;
                  }
                  console.log("Après Bonus/Malus MJ", valRoll);

                  // BONUS SALON POUR L'HERBORISTE
                  let guildQuete = await FicheQuete.findOne({
                    _id: authId.idDatabase.BonusId,
                  });
                  const tailleTableau = guildQuete.Eau.length;
                  for (i = 0; i < tailleTableau; i++) {
                    if (
                      channelMessage == guildQuete.Eau[i] &&
                      interaction.member.roles.cache.has(
                        authId.RoleRP.MaitrisePlante
                      )
                    ) {
                      var BonusHerboriste = 6;
                      var valRoll = valRoll + BonusHerboriste;
                    } else {
                      var BonusHerboriste = 0;
                      var valRoll = valRoll + BonusHerboriste;
                    }
                  }

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

          //// METTRE LA COMMANDE DANS LES LOG
          var fichePer = await FichePerso.findOne({ _id: user.id });
          let MessageLog =
            interaction.commandName +
            interaction.options.getString("categorie") +
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
