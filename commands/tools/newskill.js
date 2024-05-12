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
    .setName("newskill")
    .setDescription("Amélioration des compétences et de la résistance")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("competence")
        .setDescription("Choix du type de skill à dévelloper.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("nom de la compétence à améliorer")
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
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("value")
            .setDescription("Valeur de l'augmentation")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("resistance")
        .setDescription("Choix du type de skill à dévelloper")
        .addStringOption((option) =>
          option
            .setName("type")
            .setRequired(true)
            .setDescription("nom de la résistance à améliorer")
            .addChoices(
              { name: "Physique", value: "physique" },
              { name: "Spiritualite", value: "spiritualite" }
            )
        )
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
    var listeCompetence = [
      "force",
      "constitution",
      "charisme",
      "intelligence",
      "survie",
      "adresse",
      "spiritualite",
      "discretion",
    ];

    if (
      interaction.member.roles.cache.has(authId.RoleRP.RolePlay) &&
      interaction.channelId == authId.Salon.JetDeDes
    ) {
      if (interaction.commandName === "newskill") {
        // Le joueur qui fait la commande
        const user = interaction.user;
        // Insérez des données initiales
        var joueurFiche = await collection.findOne({
          _id: user.id,
        });
        var ValueToAdd = interaction.options.getNumber("value");
        var pointToAdd = joueurFiche.GainCompetence;
        var resistanceToAdd = joueurFiche.PointDeResistance;
        if (interaction.options.getSubcommand() === "competence") {
          if (interaction.options.getString("type") === "force") {
            var OldForce = joueurFiche.Competence.Force;
            if (OldForce == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldForce == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19, tu ne peux pas mettre 2 points dans cette compétence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewForce =
                  joueurFiche.Competence.Force + Number(ValueToAdd);
                console.log(NewForce);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Force": NewForce,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.0": NewForce } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (Number(NewForce) == Number(OldForce) + Number(ValueToAdd)) {
                  var newMessage = `Ta force est maintenant de ${joueurFiche.Competence.Force}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "constitution") {
            var OldConstitution = joueurFiche.Competence.Constitution;
            if (OldConstitution == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldConstitution == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19, tu ne peux pas mettre 2 points dans cette compétence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewConstitution =
                  joueurFiche.Competence.Constitution + Number(ValueToAdd);
                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Constitution": NewConstitution,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.1": NewConstitution } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewConstitution) ==
                  Number(OldConstitution) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ta constitution est maintenant de ${joueurFiche.Competence.Constitution}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "charisme") {
            var OldCharisme = joueurFiche.Competence.Charisme;
            if (OldCharisme == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldCharisme == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewCharisme =
                  joueurFiche.Competence.Charisme + Number(ValueToAdd);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Charisme": NewCharisme,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.2": NewCharisme } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewCharisme) ==
                  Number(OldCharisme) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ton charisme est maintenant de ${joueurFiche.Competence.Charisme}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "intelligence") {
            var OldIntelligence = joueurFiche.Competence.Intelligence;
            if (OldIntelligence == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldIntelligence == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewIntelligence =
                  joueurFiche.Competence.Intelligence + Number(ValueToAdd);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Intelligence": NewIntelligence,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.3": NewIntelligence } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });

                if (
                  Number(NewIntelligence) ==
                  Number(OldIntelligence) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ton intelligence est maintenant de ${joueurFiche.Competence.Intelligence}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "survie") {
            var OldSurvie = joueurFiche.Competence.Survie;
            if (OldSurvie == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldSurvie == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewSurvie =
                  joueurFiche.Competence.Survie + Number(ValueToAdd);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Survie": NewSurvie,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.4": NewSurvie } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewSurvie) ==
                  Number(OldSurvie) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ta survie est maintenant de ${joueurFiche.Competence.Survie}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "adresse") {
            var OldAdresse = joueurFiche.Competence.Adresse;
            if (OldAdresse == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldAdresse == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewAdresse =
                  joueurFiche.Competence.Adresse + Number(ValueToAdd);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Adresse": NewAdresse,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.5": NewAdresse } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewAdresse) ==
                  Number(OldAdresse) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ton adresse est maintenant de ${joueurFiche.Competence.Adresse}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "spiritualite") {
            var OldSpiritualite = joueurFiche.Competence.Spiritualite;
            if (OldSpiritualite == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldSpiritualite == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewSpiritualite =
                  joueurFiche.Competence.Spiritualite + Number(ValueToAdd);

                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Spiritualite": NewSpiritualite,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.6": NewSpiritualite } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewSpiritualite) ==
                  Number(OldSpiritualite) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ta spiritualité est maintenant de ${joueurFiche.Competence.Spiritualite}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          } else if (interaction.options.getString("type") === "discretion") {
            var OldDiscretion = joueurFiche.Competence.Discretion;
            if (OldDiscretion == 20) {
              var newMessage = "Tu es au max sur cette competence";
            } else if (OldDiscretion == 19 && Number(ValueToAdd) == 2) {
              var newMessage =
                "Attention tu es a 19 tu ne peux mettre plus qu'un point dans cette competence !";
            } else {
              if (Number(ValueToAdd) > pointToAdd) {
                var newMessage =
                  "M'enfin tu n'as pas assez de points à distribuer !";
              } else {
                var NewDiscretion =
                  joueurFiche.Competence.Discretion + Number(ValueToAdd);
                await collection.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      "Competence.Discretion": NewDiscretion,
                      GainCompetence:
                        joueurFiche.GainCompetence - Number(ValueToAdd),
                    },
                  }
                );
                await collectionbag.updateOne(
                  { _id: user.id },
                  { $set: { "Competence.7": NewDiscretion } }
                );
                var joueurFiche = await collection.findOne({
                  _id: user.id,
                });
                if (
                  Number(NewDiscretion) ==
                  Number(OldDiscretion) + Number(ValueToAdd)
                ) {
                  var newMessage = `Ta discrétion est maintenant de ${joueurFiche.Competence.Discretion}`;
                } else {
                  var newMessage = `Un problème s'est produit ! Demande à Karma`;
                }
              }
            }
          }
        } else if (interaction.options.getSubcommand() === "resistance") {
          if (interaction.options.getString("type") === "physique") {
            if (Number(ValueToAdd) > resistanceToAdd) {
              var newMessage =
                "M'enfin tu n'as pas assez de points à distribuer !";
            } else {
              await collection.findOneAndUpdate(
                { _id: user.id },
                {
                  $set: {
                    ResistancePhy: Number(ValueToAdd),
                    PointDeResistance: resistanceToAdd - Number(ValueToAdd),
                  },
                }
              );
              var joueurFiche = await collection.findOne({
                _id: user.id,
              });
              if (Number(ValueToAdd) == joueurFiche.ResistancePhy) {
                var newMessage = `Ta resistance physique est maintenant de ${joueurFiche.ResistancePhy}`;
              } else {
                var newMessage = `Un problème s'est produit ! Demande à Karma`;
              }
            }
          } else if (interaction.options.getString("type") === "spiritualite") {
            if (Number(ValueToAdd) > resistanceToAdd) {
              var newMessage =
                "M'enfin tu n'as pas assez de points à distribuer !";
            } else {
              await collection.findOneAndUpdate(
                { _id: user.id },
                {
                  $set: {
                    ResistanceSpi: Number(ValueToAdd),
                    PointDeResistance: resistanceToAdd - Number(ValueToAdd),
                  },
                }
              );
              var joueurFiche = await collection.findOne({
                _id: user.id,
              });
              if (Number(ValueToAdd) == joueurFiche.ResistanceSpi) {
                var newMessage = `Ta resistance physique est maintenant de ${joueurFiche.ResistanceSpi}`;
              } else {
                var newMessage = `Un problème s'est produit ! Demande à Karma`;
              }
            }
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
