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
    .setName("pnjattak")
    .setDescription("Attaque par un PNJ")
    .addNumberOption((option) =>
      option
        .setName("valuecarac")
        .setDescription("Valeur du niveau en Maitrise ou Competence")
        .setRequired(true)
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

    if (interaction.commandName === "pnjattak") {
      if (
        (user.id == authId.staff.emi ||
          interaction.member.roles.cache.has(authId.RoleRP.RoleStaff)) &&
        (interaction.channelId == authId.Salon.JetDeDes ||
          interaction.channelId == authId.Salon.SalonBotAdmin ||
          interaction.channelId == authId.Salon.JetSik)
      ) {
        var valRandom = Rand(20);
        console.log(valRandom);
        var valueCarac = interaction.options.getNumber("valuecarac");
        console.log(valueCarac);
        var BonusMJ = 0;
        if (interaction.options.getNumber("bonusmj")) {
          console.log("On a mis un Bonus au PNJ");
          var BonusMJ = interaction.options.getNumber("bonusmj");
          console.log(BonusMJ);
        } else {
          console.log("On a PAS mis un Bonus au PNJ");
          var BonusMJ = 0;
        }
        var valTotal = valRandom + valueCarac + BonusMJ;
        console.log(valTotal);
        const newMessage = `Ton PNJ a fait un roll de ${valTotal}. Compare cette valeur à celle du roll en opposition du joueur qu'il combat`;
        await interaction.editReply({
          content: newMessage,
        });
      } else {
        const newMessage = `Soit tu n'as pas les autorisations pour faire ça, ou tu n'es pas dans la bon salon.`;
        await interaction.editReply({
          content: newMessage,
        });
      }
    }
  },
};
