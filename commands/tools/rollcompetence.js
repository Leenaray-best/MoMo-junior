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
              for (j = 0; j < listeObject.length; j++) {
                if (interaction.options.getString("objet") === listeObject[j]) {
                  console.log(guildPersoBag.Competence);
                  console.log(listeFicheObjet[j]);
                  var newList = math.add(
                    guildPersoBag.Competence,
                    listeFicheObjet[j]
                  );
                  console.log(guildPersoBag.Competence);
                  console.log(newList);
                  NumberUp = newList[i];
                } else {
                  NumberUp = guildPersoBag.Competence[i];
                }
                if (valRoll <= NumberUp) {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        "> Ton roll est de " +
                        ValRoll +
                        ", c'est une reussite" +
                        +`\rTu peux repartir dans ${client.channels.cache.get(
                          channelMessage
                        )}`
                    );
                } else {
                  client.channels.cache
                    .get(authId.Salon.Jet)
                    .send(
                      "<@" +
                        user.id +
                        "> Ton roll est de " +
                        ValRoll +
                        ", c'est un echec" +
                        +`\rTu peux repartir dans ${client.channels.cache.get(
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
