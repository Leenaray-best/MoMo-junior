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
    .setName("giveitem")
    .setDescription("Donner un item à un joueur")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Le joueur à qui on donne un item")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setRequired(true)
        .setDescription("Choix du type d'attaque")
        .addChoices(
          { name: "Epée", value: "epee" },
          { name: "Dague", value: "dague" },
          { name: "Armure", value: "armure" },
          { name: "Potion", value: "potion" },
          { name: "Poison", value: "poison" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("Le nombre d'item que l'on donne")
        .setRequired(true)
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
    // Le joueur qui fait la commande et donc qui attaque
    const user = interaction.user;
    let joueurFicheAttakBag = await collectionbag.findOne({
      _id: user.id,
    });
    // le joueur qui subit les degats
    const joueur = interaction.options.getUser("target");
    const memberjoueur = await interaction.guild.members.fetch(joueur.id);
    let joueurFicheBag = await collectionbag.findOne({
      _id: joueur.id,
    });

    if (
      interaction.member.roles.cache.has(authId.RoleRP.RolePlay) &&
      interaction.channelId == authId.Salon.Jet
    ) {
      if (interaction.commandName === "giveitem") {
        if (interaction.options.getString("type") === "epee") {
          console.log(interaction.member.roles.cache.has(authId.RoleRP.Epee));
          console.log(!memberjoueur.roles.cache.has(authId.RoleRP.Epee));
          console.log(!memberjoueur.roles.cache.has(authId.RoleRP.Dague));
          if (
            interaction.member.roles.cache.has(authId.RoleRP.Epee) &&
            !memberjoueur.roles.cache.has(authId.RoleRP.Epee) &&
            !memberjoueur.roles.cache.has(authId.RoleRP.Dague)
          ) {
            console.log("les conditions de don sont satisfaites");
            var numberToTrade = interaction.options.getNumber("number");
            console.log(numberToTrade);
            var numberTourEpee = joueurFicheAttakBag.Tour[2];
            if (numberToTrade > 1) {
              var newMessage =
                "Tu ne peux pas donner plus d'une épée à un joueur";
            } else {
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $pull: { Sac: `1 Epée` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $set: { "Tour.2": 0 } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $push: { Sac: `1 Epée` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $set: { "Tour.2": numberTourEpee } }
              );
              interaction.member.roles.remove(authId.RoleRP.Epee);
              const member = message.guild.members.cache.get(joueur.id);
              member.roles.add(authId.RoleRP.Epee);
              var newMessage =
                `Ton épée a bien été transférée à <@` + joueur.id + `>`;
            }
          } else {
            var newMessage =
              "M'enfin ! Tu ne peux pas partager un objet que tu ne possèdes pas ! Ou bien c'est ton ami qui en a déjà une. Il n'en a pas besoin de deux";
          }
        } else if (interaction.options.getString("type") === "dague") {
          console.log(interaction.member.roles.cache.has(authId.RoleRP.Dague));
          console.log(!memberjoueur.roles.cache.has(authId.RoleRP.Epee));
          console.log(!memberjoueur.roles.cache.has(authId.RoleRP.Dague));
          if (
            interaction.member.roles.cache.has(authId.RoleRP.Dague) &&
            !memberjoueur.roles.cache.has(authId.RoleRP.Epee) &&
            !memberjoueur.roles.cache.has(authId.RoleRP.Dague)
          ) {
            console.log("les conditions de don sont satisfaites");
            var numberToTrade = interaction.options.getNumber("number");
            var numberTourDague = joueurFicheAttakBag.Tour[3];
            if (numberToTrade > 1) {
              console.log(numberToTrade);
              var newMessage =
                "Tu ne peux pas donner plus d'une dague à un joueur";
            } else {
              console.log("tu fais un transfer d'un item");
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $pull: { Sac: `1 Dague` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $set: { "Tour.3": 0 } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $push: { Sac: `1 Dague` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $set: { "Tour.3": numberTourDague } }
              );
              interaction.member.roles.remove(authId.RoleRP.Dague);
              const member = message.guild.members.cache.get(joueur.id);
              member.roles.add(authId.RoleRP.Dague);
              var newMessage =
                `Ta dague a bien été transférée à <@` + joueur.id + `>`;
            }
          } else {
            var newMessage =
              "M'enfin ! Tu ne peux pas partager un objet que tu ne possèdes pas ! Ou bien c'est ton ami qui en a déjà une. Il n'en a pas besoin de deux";
          }
        } else if (interaction.options.getString("type") === "armure") {
          console.log("On veut échanger des armures");
          console.log(interaction.member.roles.cache.has(authId.RoleRP.Armure));
          console.log(!memberjoueur.roles.cache.has(authId.RoleRP.Armure));
          if (
            interaction.member.roles.cache.has(authId.RoleRP.Armure) &&
            !memberjoueur.roles.cache.has(authId.RoleRP.Armure)
          ) {
            console.log("les conditions de don sont satisfaites");
            var numberToTrade = interaction.options.getNumber("number");
            var numberTourAmure = joueurFicheAttakBag.Tour[4];
            if (numberToTrade > 1) {
              console.log(numberToTrade);
              var newMessage =
                "Tu ne peux pas donner plus d'une armure à un joueur";
            } else {
              console.log("tu fais un transfer d'un item");
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $pull: { Sac: `1 Armure` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: user.id },
                { $set: { "Tour.4": 0 } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $push: { Sac: `1 Armure` } }
              );
              await collectionbag.findOneAndUpdate(
                { _id: joueur.id },
                { $set: { "Tour.4": numberTourAmure } }
              );
              interaction.member.roles.remove(authId.RoleRP.Armure);
              if (!interaction.member.roles.remove(authId.RoleRP.Armure)) {
                console.log("Giver n'a plus le role");
              } else {
                console.log("Giver a toujours le role");
              }
              const member = message.guild.members.cache.get(joueur.id);
              member.roles.add(authId.RoleRP.Armure);
              var newMessage =
                `Ton armure a bien été transférée à <@` + joueur.id + `>`;
            }
          } else {
            console.log("Condition échouée");
            console.log(
              "interaction.member.roles.cache.has(authId.RoleRP.Armure):",
              interaction.member.roles.cache.has(authId.RoleRP.Armure)
            );
            console.log(
              "!memberjoueur.roles.cache.has(authId.RoleRP.Armure):",
              !memberjoueur.roles.cache.has(authId.RoleRP.Armure)
            );
            var newMessage =
              "M'enfin ! Tu ne peux pas partager un objet que tu ne possèdes pas ! Ou bien c'est ton ami qui en a déjà une. Il n'en a pas besoin de deux";
          }
        } else if (interaction.options.getString("type") === "potion") {
          var numberPotionJoueurGiver = joueurFicheAttakBag.NbrePotion;
          if (numberPotionJoueurGiver > 0) {
            var numberToTrade = interaction.options.getNumber("number");
            if (numberToTrade > numberPotionJoueurGiver) {
              var newMessage =
                "Tu ne peux pas donner plus de potions que tu n'en as !";
            } else {
              var newNumberPotionJoueurGiver =
                numberPotionJoueurGiver - numberToTrade;
              var NumberPotionReceiver = joueurFicheBag.NbrePotion;
              //var tourPotionGiver = joueurFicheAttakBag.Tour[0];
              if (newNumberPotionJoueurGiver == 0) {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${numberPotionJoueurGiver} Potion(s)`] },
                    },
                  }
                );
              } else {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${numberPotionJoueurGiver} Potion(s)`] },
                    },
                  }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $push: { Sac: `${newNumberPotionJoueurGiver} Potion(s)` } }
                );
              }
              if (NumberPotionReceiver + numberToTrade > 5) {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${newNumberPotionJoueurGiver} Potion(s)`] },
                    },
                  }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $push: { Sac: `${numberPotionJoueurGiver} Potion(s)` } }
                );
                var newMessage =
                  `<@` +
                  joueur.id +
                  `> est/sera au max de potions ! Tu ne peux pas lui en donner plus. La transaction a échoué`;
              } else {
                var newNumberPotionReceiver =
                  NumberPotionReceiver + numberToTrade;
                if (NumberPotionReceiver == 0) {
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    { $push: { Sac: `${newNumberPotionReceiver} Potion(s)` } }
                  );
                } else {
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    {
                      $pull: {
                        Sac: { $in: [`${NumberPotionReceiver} Potion(s)`] },
                      },
                    }
                  );
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    { $push: { Sac: `${newNumberPotionReceiver} Potion(s)` } }
                  );
                }
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $set: { NbrePotion: newNumberPotionJoueurGiver } }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: joueur.id },
                  { $set: { NbrePotion: newNumberPotionReceiver } }
                );
                var newMessage =
                  `Ta/tes potions ont bien été transféré(es) à <@` +
                  joueur.id +
                  `>`;
              }
            }
          } else {
            var newMessage =
              "M'enfin ! Tu ne peux pas partager un objet que tu ne possèdes pas !";
          }
        } else if (interaction.options.getString("type") === "poison") {
          var numberPoisonJoueurGiver = joueurFicheAttakBag.NbrePoison;
          if (numberPoisonJoueurGiver > 0) {
            var numberToTrade = interaction.options.getNumber("number");
            if (numberToTrade > numberPoisonJoueurGiver) {
              var newMessage =
                "Tu ne peux pas donner plus de poisons que tu n'en as !";
            } else {
              var newNumberPoisonJoueurGiver =
                numberPoisonJoueurGiver - numberToTrade;
              var NumberPoisonReceiver = joueurFicheBag.NbrePoison;
              //var tourPoisonGiver = joueurFicheAttakBag.Tour[1];
              if (newNumberPoisonJoueurGiver == 0) {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${numberPoisonJoueurGiver} Poison(s)`] },
                    },
                  }
                );
              } else {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${numberPoisonJoueurGiver} Poison(s)`] },
                    },
                  }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $push: { Sac: `${newNumberPoisonJoueurGiver} Poison(s)` } }
                );
              }

              if (NumberPoisonReceiver + numberToTrade > 5) {
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  {
                    $pull: {
                      Sac: { $in: [`${newNumberPoisonJoueurGiver} Poison(s)`] },
                    },
                  }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $push: { Sac: `${numberPoisonJoueurGiver} Poison(s)` } }
                );
                var newMessage =
                  `<@` +
                  joueur.id +
                  `> est/sera au max de poisons ! Tu ne peux pas lui en donner. La transaction a été annulée.`;
              } else {
                var newNumberPoisonReceiver =
                  NumberPoisonReceiver + numberToTrade;
                if (NumberPoisonReceiver == 0) {
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    { $push: { Sac: `${newNumberPoisonReceiver} Poison(s)` } }
                  );
                } else {
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    {
                      $pull: {
                        Sac: { $in: [`${NumberPoisonReceiver} Poison(s)`] },
                      },
                    }
                  );
                  await collectionbag.findOneAndUpdate(
                    { _id: joueur.id },
                    { $push: { Sac: `${newNumberPoisonReceiver} Poison(s)` } }
                  );
                }
                await collectionbag.findOneAndUpdate(
                  { _id: user.id },
                  { $set: { NbrePoison: newNumberPoisonJoueurGiver } }
                );
                await collectionbag.findOneAndUpdate(
                  { _id: joueur.id },
                  { $set: { NbrePoison: newNumberPoisonReceiver } }
                );
                var newMessage =
                  `Ta/tes poison(s) ont bien été transféré(es) à <@` +
                  joueur.id +
                  `>`;
              }
            }
          } else {
            var newMessage =
              "M'enfin ! Tu ne peux pas partager un objet que tu ne possèdes pas !";
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
