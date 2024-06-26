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
const wait = require("node:timers/promises").setTimeout;

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

    //APPEL DES DATABASE UTILE
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

    //const fichePerso = database.collection("fichePerso"); pour JDRBOT
    const fichePerso = database.collection("fichepersos"); //pour MoMoJr

    const ficheSalonBonusLieu = database.collection("salonbonus");
    const FicheQuete = database.collection("salonquests");
    // const ficheBonus = database.collection("meteosalonbonus");
    // const ficheMeteo = database.collection("meteos");
    // const ficheMeteotest = database.collection("salonweathers");
    const ficheBag = database.collection("fichepersobags");

    // if (!interaction.isChatInputCommand()) return;
    //console.log(interaction);
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    let guildQuete = await FicheQuete.findOne({
      _id: authId.idDatabase.questId,
    });
    const tailleTableauCat = guildQuete.AllCategorie.length;
    //for (i = 0; i < tailleTableauCat; i++) {
    if (
      user.id == authId.staff.emi ||
      interaction.member.roles.cache.has(authId.RoleRP.RolePlay) //&&
      //interaction.channel.parent == guildQuete.AllCategorie[i]
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
          var valueRoll = Rand(20);
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
                console.log("Avant Tout Bonus Malus", valueRoll);
                if (
                  interaction.member.roles.cache.has(authId.RoleRP.TheLiang)
                ) {
                  if (ficheSac.Tour[0] > 0) {
                    console.log("Mon tour bonus est > 0");
                    var BonusPotion = Number(ficheSac.ValeurBonus);

                    //var valRoll = valRoll - BonusPotion;

                    TourOld = ficheSac.Tour[0];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { $set: { "Tour.0": TourNew } }
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
                } else {
                  var BonusPotion = 0;
                }
                if (interaction.member.roles.cache.has(authId.RoleRP.Poison)) {
                  if (ficheSac.Tour[1] > 0) {
                    console.log("Mon tour bonus est > 0");
                    var MalusPoison = Number(ficheSac.ValeurBonus);

                    //var valRoll = valRoll + MalusPoison;

                    TourOld = ficheSac.Tour[1];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { $set: { "Tour.1": TourNew } }
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
                } else {
                  var MalusPoison = 0;
                }
                console.log(BonusPotion);
                console.log(MalusPoison);
                var valueFiole = BonusPotion - MalusPoison;
                console.log("breuvage", valueFiole);
                // TEST SI ILS ONT UNE EPEE
                if (
                  ficheSac.Tour[2] > 0 &&
                  interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                  interaction.options.getString("competence") === "force"
                ) {
                  console.log("TU AS UNE EPEE");
                  var BonusEpee = 3;

                  //var valRoll = valRoll - BonusEpee;

                  TourOld = ficheSac.Tour[2];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.2": TourNew } }
                  );
                } else {
                  var BonusEpee = 0;
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
                  var BonusDague = 3;

                  //var valRoll = valRoll - BonusDague;

                  TourOld = ficheSac.Tour[3];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.3": TourNew } }
                  );
                } else {
                  var BonusDague = 0;
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
                  interaction.options.getString("competence") === "constitution"
                ) {
                  console.log("TU AS UNE ARMURE");
                  var BonusArmure = 3;

                  //var valRoll = valRoll - BonusArmure;

                  TourOld = ficheSac.Tour[4];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.4": TourNew } }
                  );
                } else {
                  var BonusArmure = 0;
                }
                let ficheSacArmure = await ficheBag.findOne({
                  _id: user.id,
                });
                if (
                  interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                  ficheSacArmure.Tour[4] == 0 &&
                  interaction.options.getString("competence") === "constitution"
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
                var valueEquipement = BonusArmure + BonusEpee + BonusDague;
                console.log("Equipement", valueEquipement);
                // TEST SI ILS ONT LE ROLE BONUS MJ
                if (interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)) {
                  var BonusMJ = interaction.options.getNumber("bonusmj");
                  if (BonusMJ === null || BonusMJ === undefined) {
                    BonusMJ = 0;
                  }

                  //var valRoll = valRoll - BonusMJ;
                } else {
                  var BonusMJ = 0;

                  //var valRoll = valRoll - BonusMJ;
                }
                console.log(" Bonus/Malus MJ", BonusMJ);

                // BONUS SALON POUR L'HERBORISTE
                let guildQuete = await ficheSalonBonusLieu.findOne({
                  _id: authId.idDatabase.BonusId,
                });
                // console.log(authId.idDatabase.BonusId);
                //console.log(guildQuete);
                const tailleTableau = guildQuete.Eau.length;
                for (i = 0; i < tailleTableau; i++) {
                  if (
                    channelMessage == guildQuete.Eau[i] &&
                    interaction.member.roles.cache.has(
                      authId.RoleRP.MaitrisePlante
                    )
                  ) {
                    var BonusHerboriste = 6;
                    //var valRoll = valRoll - BonusHerboriste;
                  } else {
                    var BonusHerboriste = 0;
                    //var valRoll = valRoll - BonusHerboriste;
                  }
                }
                console.log("Bonus Herboriste", BonusHerboriste);
                valRoll =
                  valueRoll -
                  valueFiole -
                  valueEquipement -
                  BonusMJ -
                  BonusHerboriste;
                console.log("Apres tout bonus/malus", valRoll);
                if (valRoll < 0) {
                  valRoll = 0;
                }
                if (valRoll <= NumberUp) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton roll de ${interaction.options.getString(
                          "competence"
                        )} est de ` +
                        valueRoll +
                        " (roll) - " +
                        valueFiole +
                        " (Breuvage) - " +
                        valueEquipement +
                        " (Equipement) - " +
                        BonusMJ +
                        " (Bonus MJ) - " +
                        BonusHerboriste +
                        " (Autres) = " +
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
                        `> Ton roll de ${interaction.options.getString(
                          "competence"
                        )} est de ` +
                        valueRoll +
                        " (roll) - " +
                        valueFiole +
                        " (Breuvage) - " +
                        valueEquipement +
                        " (Equipement) - " +
                        BonusMJ +
                        " (Bonus MJ) - " +
                        BonusHerboriste +
                        " (Autres) = " +
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
          var valRoll = Rand(20);
          var ValRollrand = valRoll;
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
                    var BonusPotion = Number(ficheSac.ValeurBonus);
                    var valRoll = valRoll + BonusPotion;
                    TourOld = ficheSac.Tour[0];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { $set: { "Tour.0": TourNew } }
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
                } else {
                  var BonusPotion = 0;
                  var valRoll = valRoll + BonusPotion;
                }
                if (interaction.member.roles.cache.has(authId.RoleRP.Poison)) {
                  if (ficheSac.Tour[1] > 0) {
                    console.log("Mon tour bonus est > 0");
                    var MalusPoison = Number(ficheSac.ValeurBonus);

                    var valRoll = valRoll - MalusPoison;

                    TourOld = ficheSac.Tour[1];
                    TourNew = TourOld - 1;
                    await ficheBag.findOneAndUpdate(
                      { _id: user.id },
                      { $set: { "Tour.1": TourNew } }
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
                } else {
                  MalusPoison = 0;
                  var valRoll = valRoll + MalusPoison;
                }
                console.log("Après thé/poison", valRoll);
                // TEST SI ILS ONT UNE EPEE
                if (
                  ficheSac.Tour[2] > 0 &&
                  interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
                  interaction.options.getString("competence") === "force"
                ) {
                  console.log("TU AS UNE EPEE");
                  var BonusEpee = 3;

                  var valRoll = valRoll + BonusEpee;

                  TourOld = ficheSac.Tour[2];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.2": TourNew } }
                  );
                } else {
                  var BonusEpee = 0;
                  var valRoll = valRoll + BonusEpee;
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
                  var BonusDague = 3;

                  var valRoll = valRoll + BonusDague;

                  TourOld = ficheSac.Tour[3];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.3": TourNew } }
                  );
                } else {
                  var BonusDague = 0;
                  var valRoll = valRoll + BonusDague;
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
                  interaction.options.getString("competence") === "constitution"
                ) {
                  console.log("TU AS UNE ARMURE");
                  var BonusArmure = 3;

                  var valRoll = valRoll + BonusArmure;

                  TourOld = ficheSac.Tour[4];
                  TourNew = TourOld - 1;
                  await ficheBag.findOneAndUpdate(
                    { _id: user.id },
                    { $set: { "Tour.4": TourNew } }
                  );
                } else {
                  var BonusArmure = 0;
                  var valRoll = valRoll + BonusArmure;
                }
                let ficheSacArmure = await ficheBag.findOne({
                  _id: user.id,
                });
                if (
                  interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
                  ficheSacArmure.Tour[4] == 0 &&
                  interaction.options.getString("competence") === "constitution"
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
                if (interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)) {
                  var BonusMJ = interaction.options.getNumber("bonusmj");
                  var valRoll = valRoll + BonusMJ;
                } else {
                  var BonusMJ = 0;

                  var valRoll = valRoll + BonusMJ;
                }
                console.log("Après Bonus/Malus MJ", valRoll);

                // BONUS SALON POUR L'HERBORISTE
                let guildQuete = await ficheSalonBonusLieu.findOne({
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
                console.log(BonusEpee);
                console.log(BonusDague);
                console.log(BonusArmure);
                var valTotal = valRoll + NumberUp;
                console.log(valTotal);
                client.channels.cache
                  .get(authId.Salon.Jet)
                  .send(
                    "<@" +
                      user.id +
                      `> Ton roll de ${interaction.options.getString(
                        "competence"
                      )} est de ` +
                      Number(ValRollrand) +
                      " (roll) + " +
                      Number(NumberUp) +
                      " (compétence) + " +
                      Number(BonusPotion - MalusPoison + BonusHerboriste) +
                      " (bonus/malus Potion/Poison/Maitrise) + " +
                      Number(BonusEpee + BonusDague + BonusArmure) +
                      " (bonus/malus Arme/Armure) + " +
                      Number(BonusMJ) +
                      " (bonus/malus MJ) = " +
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
        //let fichePer = await FichePerso.findOne({ _id: user.id });
        if (
          interaction.options.getNumber("bonusmj") > 0 &&
          interaction.member.roles.cache.has(authId.RoleRP.BonusMJ)
        ) {
          var MessageLog =
            `${interaction.commandName}` +
            ` ${interaction.options.getString("opposition")}` +
            " opposition" +
            ` ${interaction.options.getString("competence")}` +
            "Bonus/Malus MJ de" +
            ` ${interaction.options.getNumber("bonusmj")}`;
        } else {
          var MessageLog =
            `${interaction.commandName}` +
            ` ${interaction.options.getString("opposition")}` +
            " opposition" +
            ` ${interaction.options.getString("competence")}`;
          +" sans bonus/malus MJ";
        }
        const cont = `${guildPerso.Identite.Prenom} ${
          guildPerso.Identite.Nom
        } - ${client.channels.cache.get(message.channel.id)}: ${MessageLog}\n`;
        console.log(cont);
        client.channels.cache.get(authId.Salon.LogMessage).send(`${cont}`);

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
  },
};
