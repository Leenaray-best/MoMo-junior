const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheMeteo = require("../../meteo");
const ficheMeteotest = require("../../salonMeteo");
const fichePerso = require("../../FichePerso");
const ficheBagPerso = require("../../fichePersoSac");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achat")
    .setDescription("Info pour le joueur")
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setRequired(true)
        .setDescription("Choix")
        .addChoices({ name: "Potion", value: "potion" })
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    IdPerso = user.id;
    const channelMessage = interaction.channelId;
    console.log("test du bon salon");
    console.log(channelMessage);
    console.log(authId.Salon.SalonBotAdmin);

    if (channelMessage == authId.Salon.SalonBotAdmin) {
      console.log("On est dans le bon salon");
      if (interaction.commandName === "achat") {
        if (interaction.options.getString("categorie") === "potion") {
          let fiche = await fichePerso.findOne({
            _id: IdPerso,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: IdPerso,
          });
          const valuePotion = 1000;
          const nombrePotionOld = ficheSac.NbrePotion;
          if (fiche.NiveauXP < valuePotion) {
            console.log("j'ai assez d'XP");
            const newMessage = `Désolé tu n'as pas les fond pour ton achat`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (ficheSac.NbrePotion == 5) {
            console.log("je suis full de potion");
            const newMessage = `Tu as atteint le max d'achat`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            var nombrePotionNew = nombrePotionOld + 1;
            NewXp = fiche.NiveauXP - valuePotion;
            await fichePerso.findOneAndUpdate(
              { _id: IdPerso },
              { NiveauXP: NewXp }
            );
            if (nombrePotionOld == 0) {
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPerso },
                { $push: { Sac: `${nombrePotionNew} Potion(s)` } }
              );
            } else {
              await ficheBagPerso.updateMany(
                { _id: user.id },
                { $pull: { Sac: { $in: [`${nombrePotionOld} Potion(s)`] } } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPerso },
                { $push: { Sac: `${nombrePotionNew} Potion(s)` } }
              );
            }
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { ValeurBonus: 5, NbrePotion: nombrePotionNew }
            );
            let ficheNew = await fichePerso.findOne({
              _id: IdPerso,
            });
            const newMessage = `Merci pour ton achat ! Tu viens d'être débité(e) de ${valuePotion} XP\n Il te reste ${ficheNew.NiveauXP} XP`;
            await interaction.editReply({
              content: newMessage,
            });
          }
        } else {
          console.log("On est pas bon");
        }
      }
    } else {
      const ChannelNameId = client.channels.cache.get(
        authId.Salon.SalonBotAdmin
      );
      const newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans le salon ${ChannelNameId}`;
      await interaction.editReply({
        content: newMessage,
      });
    }
  },
};
