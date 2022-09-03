const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const fs = require("fs");
const wait = require("node:timers/promises").setTimeout;
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheMeteo = require("../../meteo");
const ficheMeteotest = require("../../salonMeteo");
const fichePerso = require("../../FichePerso");
const ficheBagPerso = require("../../fichePersoSac");
const ficheAnimauxRP = require("../../ficheAnimaux");
const FicheQuete = require("../../salonQuete");
function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("compagnon")
    .setDescription("Attaque de votre compagnon")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bison")
        .setDescription("Attaque de votre compagnon")
        .addStringOption((option) =>
          option
            .setName("attaque")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Charge", value: "charge" },
              { name: "Bouclier", value: "bouclier" },
              { name: "Saisie", value: "saisie" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chien")
        .setDescription("Attaque de votre compagnon")
        .addStringOption((option) =>
          option
            .setName("attaque")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Morsure", value: "morsure" },
              { name: "Pister", value: "pister" },
              { name: "Charger", value: "charger" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("furet")
        .setDescription("Attaque de votre compagnon")
        .addStringOption((option) =>
          option
            .setName("attaque")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Griffure", value: "griffer" },
              { name: "Vol", value: "vol" },
              { name: "Charme", value: "charme" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chat")
        .setDescription("Attaque de votre compagnon")
        .addStringOption((option) =>
          option
            .setName("attaque")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Griffure", value: "griffure" },
              { name: "Pister", value: "pister" },
              { name: "Instinct", value: "instinct" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("cerf")
        .setDescription("Attaque de votre compagnon")
        .addStringOption((option) =>
          option
            .setName("attaque")
            .setRequired(true)
            .setDescription("Choix")
            .addChoices(
              { name: "Encorner", value: "encorner" },
              { name: "Fuite", value: "fuite" },
              { name: "Spiritualité", value: "spiritualite" }
            )
        )
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    let guildQuete = await FicheQuete.findOne({
      _id: authId.idDatabase.questId,
    });
    const tailleTableauCat = guildQuete.AllCategorie.length;
    for (i = 0; i < tailleTableauCat; i++) {
      if (
        (user.id == authId.staff.emi ||
          user.id == authId.staff.leena ||
          user.id == authId.staff.meri) &&
        interaction.channel.parent == guildQuete.AllCategorie[i]
      ) {
        valRand = Rand(20);

        ListAnimaux = ["bison", "chien", "furet", "chat", "cerf"];
        ListAttaque = [
          ["charge", "bouclier", "saisie"],
          ["morsure", "pister", "charger"],
          ["griffer", "vol", "charme"],
          ["griffure", "pister", "instinct"],
          ["encorner", "fuite", "spiritualite"],
        ];
        ListCompetence = [
          [0, 1, 5],
          [0, 4, 0],
          [0, 5, 2],
          [0, 4, 3],
          [0, 0, 6],
        ];
        ListMessageReponse = [
          [
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
            "Tu dois comparer avec  le jet d’attaque de ton adversaire",
            "",
          ],
          [
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
            "Tu peux flairer la piste d’un adversaire si score supérieur au nombre de points de discrétion de l’adversaire.",
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
          ],
          [
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
            "",
            "Tu as réuissi à distraire un adversaire, lui faisant perdre un tour de jeu si score supérieur aux nombre de points d’intelligence de l’adversaire.",
          ],
          [
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
            "Tu peux flairer la piste d’un adversaire si score supérieur au nombre de points de discrétion de l’adversaire.",
            "",
          ],
          [
            "Tu dois comparer avec le nombre de point de constitution de l’adversaire uniquement",
            "Tu peux s’enfuir en transportant jusqu’à 150 kg ( ~ 2 personnages ) si score strictement supérieur au nombre de points de force de l’adversaire.",
            "",
          ],
        ];
        ListIdRole = [
          authId.RoleRP.BisonVolant,
          authId.RoleRP.ChienOursPolaire,
          authId.RoleRP.FuretDeFeu,
          authId.RoleRP.ChatHibou,
          authId.RoleRP.CerfPuma,
        ];
        for (i = 0; i < ListAnimaux.length; i++) {
          if (
            interaction.options.getSubcommand() === ListAnimaux[i] &&
            interaction.member.roles.cache.has(ListIdRole[i])
          ) {
            var NameGuild = ListAnimaux[i];
            let guildAnimal = await ficheAnimauxRP.findOne({
              _id: NameGuild,
            });
            for (j = 0; j < ListAnimaux[i].length; j++) {
              if (
                interaction.options.getString("attaque") === ListAttaque[i][j]
              ) {
                console.log("Iteration choisi", i, j);
                console.log("Numero de la competence", ListCompetence[i][j]);
                console.log("Numero de l'attaque", ListAttaque[i][j]);
                var NumberCompetence =
                  guildAnimal.Competence[ListCompetence[i][j]];
                var valRoll = Number(valRand) + Number(NumberCompetence);
                console.log(valRand, NumberCompetence, valRoll);
                if (interaction.options.getString("attaque") === "saisie") {
                  if (valRoll <= 15) {
                    var NewMessage = "C'est un echec";
                  } else {
                    var NewMessage =
                      "Tu as réussi à attraper ce que tu voulais";
                  }
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton animal à obtenu à son roll de ${ListAttaque[i][j]}: ` +
                        valRoll +
                        `\r${NewMessage}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else if (
                  interaction.options.getString("attaque") === "instinct"
                ) {
                  if (valRoll <= 20) {
                    var NewMessage = "C'est un echec";
                  } else {
                    var NewMessage =
                      " Ton chat-hibou peut guider son maître vers une piste de solution. Utilisable 3 fois en quête";
                  }
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton animal à obtenu à son roll de ${ListAttaque[i][j]}: ` +
                        valRoll +
                        `\r ${NewMessage}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else if (interaction.options.getString("attaque") === "vol") {
                  if (valRoll <= 16) {
                    var NewMessage = "C'est un echec";
                  } else {
                    var NewMessage =
                      "Tu as réussi à attraper ce que tu voulais";
                  }
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton animal à obtenu à son roll de ${ListAttaque[i][j]}: ` +
                        valRoll +
                        `\r ${NewMessage}` +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else if (
                  interaction.options.getString("attaque") === "spiritualite"
                ) {
                  if (valRoll <= 16) {
                    var NewMessage = "C'est un echec";
                  } else {
                    var NewMessage =
                      "cerf-puma peut appeler à l’aide des esprits du monde spirituel pour semer le chaos : l’adversaire perd son tour d’action au profit du maître du cerf-puma. Utilisable 3 fois";
                  }
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        `> Ton animal à obtenu à son roll de ${ListAttaque[i][j]}: ` +
                        valRoll +
                        `\r ${NewMessage}` +
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
                        `> Ton animal à obtenu à son roll de ${ListAttaque[i][j]}: ` +
                        valRoll +
                        `\r` +
                        ListMessageReponse[i][j] +
                        `\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                }
              }
            }
            const ChannelNameIdJet = client.channels.cache.get(
              authId.Salon.Jet
            );
            newMessage = `Va dans ${ChannelNameIdJet} pour voir ton resultat`;
            await interaction.editReply({
              content: newMessage,
            });
            await wait(5000);
            await interaction.deleteReply();
            break;
          } else if (!interaction.member.roles.cache.has(ListIdRole[i])) {
            const ChannelNameIdJet = client.channels.cache.get(
              authId.Salon.Jet
            );
            newMessage = `Tu n'as pas le compagnon ${ListAnimaux[i]}. Fait la commande adéquate`;
            await interaction.editReply({
              content: newMessage,
            });
            await wait(5000);
            await interaction.deleteReply();
            break;
          }
        }
        break;
      } else {
        const ChannelNameId = client.channels.cache.get(authId.Salon.Jet);
        // newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans le salon ${ChannelNameId}`;
        var newMessage = `Tu n'as pas la permission de faire ça`;
        await interaction.editReply({
          content: newMessage,
        });
        await wait(5000);
        await interaction.deleteReply();
      }
    }
  },
};
