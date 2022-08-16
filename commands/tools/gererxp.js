const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheBonus = require("../../salonBonus");
const fichePerso = require("../../FichePerso");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gererxp")
    .setDescription("Info pour le joueur")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove XP to the User")
        .addUserOption((option) =>
          option.setName("joueur").setDescription("The user").setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("xp")
            .setDescription("Enter a number")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give XP to the User")
        .addUserOption((option) =>
          option.setName("joueur").setDescription("The user").setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("xp")
            .setDescription("Enter a number")
            .setRequired(true)
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
      (user.id == authId.staff.emi ||
        user.id == authId.staff.leena ||
        user.id == authId.staff.meri) &&
      channelMessage == authId.Salon.SalonBotAdmin
    ) {
      if (interaction.commandName === "gererxp") {
        // Add a channel to Earth bender
        if (interaction.options.getSubcommand("remove")) {
          const gamer = interaction.options.getUser("joueur");
          const valueXP = interaction.options.getNumber("xp");
          console.log(gamer.id);
          const idGamer = gamer.id;
          let guildPerso = await fichePerso.findOne({
            _id: idGamer,
          });
          console.log(guildPerso);
          const oldNiveauXP = guildPerso.NiveauXP;
          const newNiveauXP = oldNiveauXP - valueXP;
          let newGuildPerso = await fichePerso.findOneAndUpdate(
            { _id: idGamer },
            { NiveauXP: newNiveauXP }
          );
          console.log(newGuildPerso);
          console.log(oldNiveauXP, newNiveauXP);
          newMessage = `${valueXP} XP ont été retiré à ${newGuildPerso.Identite.Prenom} ${newGuildPerso.Identite.Nom}`;
          await interaction.editReply({
            content: newMessage,
          });
        } else if (interaction.options.getSubcommand("give")) {
          const gamer = interaction.options.getUser("joueur");
          const valueXP = interaction.options.getNumber("xp");
          console.log(gamer.id);
          const idGamer = gamer.id;
          let guildPerso = await fichePerso.findOne({
            _id: idGamer,
          });
          console.log(guildPerso);
          const oldNiveauXP = guildPerso.NiveauXP;
          const newNiveauXP = oldNiveauXP + valueXP;
          console.log(oldNiveauXP, newNiveauXP);
          let newGuildPerso = await fichePerso.findOneAndUpdate(
            { _id: idGamer },
            { NiveauXP: newNiveauXP }
          );
          newMessage = `${valueXP} XP a été attribué à ${newGuildPerso.Identite.Prenom} ${newGuildPerso.Identite.Nom}`;
          await interaction.editReply({
            content: newMessage,
          });
        }
      }
    } else {
      newMessage = `Tu n'as pas les autorisations pour faire ça`;
      await interaction.editReply({
        content: newMessage,
      });
    }
  },
};
