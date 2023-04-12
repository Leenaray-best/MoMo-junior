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
    .setDescription("Utiliser une potion ou un poison")
    .addUserOption((option) =>
      option
        .setName("joueur")
        .setRequired(true)
        .setDescription("La personne surlequel l'objet s'applique")
    )
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setRequired(true)
        .setDescription("Choix")
        .addChoices(
          { name: "Potion", value: "potion" },
          { name: "Poison", value: "poison" }
        )
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    IdPerso = user.id;
    PersoAppliqueObjet = interaction.options.getUser("joueur");
    IdPersoAppliqueObjet = PersoAppliqueObjet.id;
    const channelMessage = interaction.channelId;
    //console.log(interaction.member);
    console.log(channelMessage);
    console.log(authId.Salon.SalonBotAdmin);
    if (channelMessage == authId.Salon.SalonBotAdmin) {
      if (interaction.commandName === "use") {
        if (interaction.options.getString("categorie") === "potion") {
          let fiche = await fichePerso.findOne({
            _id: IdPersoAppliqueObjet,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: IdPersoAppliqueObjet,
          });
          const nombrePotionOld = ficheSac.NbrePotion;
          if (
            IdPersoAppliqueObjet == user.id &&
            interaction.member.roles.cache.has(authId.RoleRP.TheLiang)
          ) {
            const newMessage = `Tu as déjà une potion en cours`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (
            !(IdPersoAppliqueObjet == user.id) &&
            PersoAppliqueObjet.roles.cache.has(authId.RoleRP.TheLiang)
          ) {
            const newMessage = `Ton camarade a déjà une potion en cours. Tu ne peux pas le booster plus`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            if (nombrePotionOld > 0) {
              if (IdPersoAppliqueObjet == user.id) {
                interaction.member.roles.add(authId.RoleRP.TheLiang);
              } else {
                PersoAppliqueObjet.roles.cache.add(authId.RoleRP.TheLiang);
              }
              var nombrePotionNew = nombrePotionOld - 1;
              await ficheBagPerso.updateMany(
                { _id: IdPersoAppliqueObjet },
                { $pull: { Sac: { $in: [`${nombrePotionOld} Potion(s)`] } } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { $push: { Sac: `${nombrePotionNew} Potion(s)` } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { NbrePotion: nombrePotionNew }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { Tour: 0 },
                { $set: { "Tour.0": 5 } }
              );
              let ficheSacNew = await ficheBagPerso.findOne({
                _id: IdPersoAppliqueObjet,
              });
              console.log(ficheSacNew);
              if (IdPersoAppliqueObjet == user.id) {
                const newMessage = `Tu viens d'utiliser une potion. Tu as 5 tours de boost sur tous tes jets`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else {
                const newMessage =
                  "<@" +
                  IdPersoAppliqueObjet +
                  "> !" +
                  "<@" +
                  user.id +
                  `> vient de te donner une potion qui te booste.\n Tes 5 prochains jets sont augmentés de 5`;
                await interaction.editReply({
                  content: newMessage,
                });
              }
            } else {
              console.log("PAS DE POTION");
              const newMessage = `Tu n'as pas de potion. Il te faut d'abord aller en acheter`;
              await interaction.editReply({
                content: newMessage,
              });
            }
          }
        } else if (interaction.options.getString("categorie") === "poison") {
          let fiche = await fichePerso.findOne({
            _id: IdPersoAppliqueObjet,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: IdPersoAppliqueObjet,
          });
          const nombrePoisonOld = ficheSac.NbrePoison;

          if (
            IdPersoAppliqueObjet == user.id &&
            interaction.member.roles.cache.has(authId.RoleRP.Poison)
          ) {
            const newMessage = `Tu as déjà un poison en cours. Tu ne peux pas être plus empoisonner`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (
            !(IdPersoAppliqueObjet == user.id) &&
            PersoAppliqueObjet.roles.cache.has(authId.RoleRP.Poison)
          ) {
            const newMessage = `Ton adversaire a déjà un poison en cours. Tu ne peux pas être l'empoisonner de nouveau`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            if (nombrePoisonOld > 0) {
              if (IdPersoAppliqueObjet == user.id) {
                interaction.member.roles.add(authId.RoleRP.Poison);
              } else {
                PersoAppliqueObjet.roles.cache.add(authId.RoleRP.Poison);
              }
              var nombrePoisonNew = nombrePoisonOld - 1;
              await ficheBagPerso.updateMany(
                { _id: IdPersoAppliqueObjet },
                { $pull: { Sac: { $in: [`${nombrePoisonOld} Poison(s)`] } } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { $push: { Sac: `${nombrePoisonNew} Poison(s)` } }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { NbrePoison: nombrePoisonNew }
              );
              await ficheBagPerso.findOneAndUpdate(
                { _id: IdPersoAppliqueObjet },
                { Tour: 0 },
                { $set: { "Tour.1": 5 } }
              );
              if (IdPersoAppliqueObjet == user.id) {
                const newMessage =
                  `AIE AIE AIE` +
                  "<@" +
                  user.id +
                  `> ! Tu viens de t'appliquer un poison par erreur qui t'affaiblit.\n Tes 5 prochains jets sont réduits de 5`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else {
                const newMessage =
                  `AIE AIE AIE` +
                  "<@" +
                  IdPersoAppliqueObjet +
                  "> !" +
                  "<@" +
                  user.id +
                  `vient de te donner un poison qui t'affaiblit.\n Tes 5 prochains jets sont affaiblis de 5`;
                await interaction.editReply({
                  content: newMessage,
                });
              }
            } else {
              console.log("PAS DE POISON");
              const newMessage = `Tu n'as plus de poison. Il te faut d'abord aller en acheter`;
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
