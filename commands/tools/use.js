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
    .setName("use")
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
    console.log(channelMessage);
    console.log(authId.Salon.SalonBotAdmin);
    if (channelMessage == authId.Salon.SalonBotAdmin) {
      if (interaction.commandName === "use") {
        if (interaction.options.getString("categorie") === "potion") {
          let fiche = await fichePerso.findOne({
            _id: IdPerso,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: IdPerso,
          });
          const nombrePotionOld = ficheSac.NbrePotion;
          if (interaction.member.roles.cache.has(authId.RoleRP.TheLiang)) {
            const newMessage = `Tu as déjà une potion en cours`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            if (nombrePotionOld > 0) {
              interaction.member.roles.add(authId.RoleRP.TheLiang);
              var nombrePotionNew = nombrePotionOld - 1;
              await ficheBagPerso.updateMany(
                { _id: user.id },
                { $pull: { Sac: { $in: [`${nombrePotionOld} Potion(s)`] } } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPerso },
                { $push: { Sac: `${nombrePotionNew} Potion(s)` } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPerso },
                { Tour: 5, NbrePotion: nombrePotionNew }
              );
              const newMessage = `Tu viens d'utiliser ta potion. Tu as 5 tours de boost sur tout tes jets`;
              await interaction.editReply({
                content: newMessage,
              });
            } else {
              console.log("PAS DE POTION");
              const newMessage = `Tu n'as pas de potion. Il te faut d'abord aller en acheter`;
              await interaction.editReply({
                content: newMessage,
              });
            }
          }
        } else {
          console.log("ERROR");
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
