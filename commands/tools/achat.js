const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheMeteo = require("../../meteo");
const ficheMeteotest = require("../../salonMeteo");
const fichePerso = require("../../FichePerso");
const ficheBagPerso = require("../../fichePersoSac");
const ficheSalonQuest = require("../../salonQuete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achat")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("breuvage")
        .setDescription("Achat de potion(s) et de poison(s)")
        .addStringOption((option) =>
          option
            .setName("categorie")
            .setRequired(true)
            .setDescription("Prix : 1000 XP")
            .addChoices(
              { name: "Potion", value: "potion" },
              { name: "Poison", value: "poison" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("nombre")
            .setRequired(true)
            .setDescription("Quantité d'achat")
            .addChoices(
              { name: "1", value: "un" },
              { name: "2", value: "deux" },
              { name: "3", value: "trois" },
              { name: "4", value: "quatre" },
              { name: "5", value: "cinq" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("equipement")
        .setDescription("Achat d'armes et d'armures")
        .addStringOption((option) =>
          option
            .setName("categorie")
            .setRequired(true)
            .setDescription("Prix : 5000 XP")
            .addChoices(
              { name: "Epée", value: "epee" },
              { name: "Dague", value: "dague" },
              { name: "Armure", value: "armure" }
            )
        )
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
    let ficheQueteAchat = await ficheSalonQuest.findOne({
      _id: authId.idDatabase.questId,
    });
    for (i = 0; i < ficheQueteAchat.AchatRP.length; i++) {
      console.log(ficheQueteAchat.AchatRP[i]);
    }
    listNombre = ["un", "deux", "trois", "quatre", "cinq"];
    listNombre2 = [1, 2, 3, 4, 5];
    if (
      channelMessage == ficheQueteAchat.AchatRP[0] ||
      channelMessage == ficheQueteAchat.AchatRP[1] ||
      channelMessage == ficheQueteAchat.AchatRP[2] ||
      channelMessage == authId.Salon.SalonBotAdmin
    ) {
      console.log("On est dans le bon salon");
      if (interaction.options.getSubcommand() === "breuvage") {
        if (interaction.options.getString("categorie") === "potion") {
          for (i = 0; i < listNombre.length; i++) {
            if (interaction.options.getString("nombre") === listNombre[i]) {
              var nombreAchatPotion = Number(listNombre2[i]);
              let fiche = await fichePerso.findOne({
                _id: IdPerso,
              });
              let ficheSac = await ficheBagPerso.findOne({
                _id: IdPerso,
              });
              const valuePotion = nombreAchatPotion * 1000;
              const nombrePotionOld = ficheSac.NbrePotion;
              if (fiche.NiveauXP < valuePotion) {
                console.log("j'ai assez d'XP");
                const newMessage = `Désolé tu n'as pas les fond pour ton achat et **L'Antiquaire** ne fait pas crédit !!`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else if (ficheSac.NbrePotion + nombreAchatPotion > 5) {
                console.log("je suis full de potion");
                const newMessage = `Nous n'avons plus assez de potion en stock ! 5 Potions max à l'achat. Il en faut pour tout le monde !`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else {
                var nombrePotionNew = nombrePotionOld + nombreAchatPotion;
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
                    {
                      $pull: { Sac: { $in: [`${nombrePotionOld} Potion(s)`] } },
                    }
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
                const newMessage = `Merci pour ton achat de ${nombreAchatPotion} Potion(s) chez **L'Antiquaire** ! Tu viens d'être débité(e) de ${valuePotion} XP`;
                await interaction.editReply({
                  content: newMessage,
                });
              }
            }
          }
        } else {
          console.log("On est pas bon");
        }
        if (interaction.options.getString("categorie") === "poison") {
          for (i = 0; i < listNombre.length; i++) {
            if (interaction.options.getString("nombre") === listNombre[i]) {
              var nombreAchatPoison = Number(listNombre2[i]);
              let fiche = await fichePerso.findOne({
                _id: IdPerso,
              });
              let ficheSac = await ficheBagPerso.findOne({
                _id: IdPerso,
              });
              const valuePoison = nombreAchatPoison * 1000;
              const nombrePoisonOld = ficheSac.NbrePoison;
              if (fiche.NiveauXP < valuePoison) {
                console.log("j'ai assez d'XP");
                const newMessage = `Désolé tu n'as pas les fond pour ton achat et **L'Antiquaire** ne fait pas crédit !!`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else if (ficheSac.NbrePoison + nombreAchatPoison > 5) {
                console.log("je suis full de poison");
                const newMessage = `Nous n'avons plus assez de poison en stock ! 5 Potions max à l'achat. Il en faut pour tout le monde !`;
                await interaction.editReply({
                  content: newMessage,
                });
              } else {
                var nombrePoisonNew = nombrePoisonOld + nombreAchatPoison;
                NewXp = fiche.NiveauXP - valuePoison;
                await fichePerso.findOneAndUpdate(
                  { _id: IdPerso },
                  { NiveauXP: NewXp }
                );
                if (nombrePoisonOld == 0) {
                  await ficheBagPerso.findOneAndUpdate(
                    { _id: IdPerso },
                    { $push: { Sac: `${nombrePoisonNew} Poison(s)` } }
                  );
                } else {
                  await ficheBagPerso.updateMany(
                    { _id: user.id },
                    {
                      $pull: { Sac: { $in: [`${nombrePoisonOld} Poison(s)`] } },
                    }
                  );
                  await ficheBagPerso.findOneAndUpdate(
                    { _id: IdPerso },
                    { $push: { Sac: `${nombrePoisonNew} Poison(s)` } }
                  );
                }
                await ficheBagPerso.findOneAndUpdate(
                  { _id: IdPerso },
                  { ValeurBonus: 5, NbrePoison: nombrePoisonNew }
                );
                let ficheNew = await fichePerso.findOne({
                  _id: IdPerso,
                });
                const newMessage = `Merci pour ton achat de ${nombreAchatPoison} Poisons(s) chez **L'Antiquaire** ! Tu viens d'être débité(e) de ${valuePotion} XP`;
                await interaction.editReply({
                  content: newMessage,
                });
              }
            }
          }
        } else {
          console.log("On est pas bon");
        }
      } else if (interaction.options.getSubcommand() === "equipement") {
        if (interaction.options.getString("categorie") === "epee") {
          let fiche = await fichePerso.findOne({
            _id: user.id,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: user.id,
          });
          const valueEquipement = 5000;
          const tourEquipement = ficheSac.Tour[2];
          if (fiche.NiveauXP < valueEquipement) {
            console.log("j'ai assez d'XP");
            const newMessage = `Désolé tu n'as pas les fond pour ton achat et **Bric et Broc** ne fait pas crédit !!`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (tourEquipement > 0) {
            console.log("je suis full d'arme");
            const newMessage = `Voyons voyons, ton équipement est encore fonctionnel. Il en faut pour tout le monde !`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            NewXp = fiche.NiveauXP - valueEquipement;
            await fichePerso.findOneAndUpdate(
              { _id: IdPerso },
              { NiveauXP: NewXp }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { $push: { Sac: `1 Epée` } }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { "Tour.2": 500 }
            );
            interaction.member.roles.add(authId.RoleRP.Epee);
            const newMessage = `Merci pour l'achat de cette épée chez **Bric et Broc** ! Tu viens d'être débité(e) de ${valueEquipement} XP`;
            await interaction.editReply({
              content: newMessage,
            });
          }
        } else {
          console.log("On est pas bon");
        }
        if (interaction.options.getString("categorie") === "dague") {
          let fiche = await fichePerso.findOne({
            _id: user.id,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: user.id,
          });
          const valueEquipement = 5000;
          const tourEquipement = ficheSac.Tour[3];
          if (fiche.NiveauXP < valueEquipement) {
            console.log("j'ai assez d'XP");
            const newMessage = `Désolé tu n'as pas les fond pour ton achat et **Bric et Broc** ne fait pas crédit !!`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (tourEquipement > 0) {
            console.log("je suis full d'arme");
            const newMessage = `Voyons voyons, ton équipement est encore fonctionnel. Il en faut pour tout le monde !`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            NewXp = fiche.NiveauXP - valueEquipement;
            await fichePerso.findOneAndUpdate(
              { _id: IdPerso },
              { NiveauXP: NewXp }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { $push: { Sac: `1 Dague` } }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { "Tour.3": 500 }
            );
            interaction.member.roles.add(authId.RoleRP.Dague);
            const newMessage = `Merci pour l'achat de cette dague chez **Bric et Broc** ! Tu viens d'être débité(e) de ${valueEquipement} XP`;
            await interaction.editReply({
              content: newMessage,
            });
          }
        } else {
          console.log("On est pas bon");
        }
        if (interaction.options.getString("categorie") === "armure") {
          let fiche = await fichePerso.findOne({
            _id: user.id,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: user.id,
          });
          const valueEquipement = 5000;
          const tourEquipement = ficheSac.Tour[4];
          if (fiche.NiveauXP < valueEquipement) {
            console.log("j'ai assez d'XP");
            const newMessage = `Désolé tu n'as pas les fond pour ton achat et **Bric et Broc** ne fait pas crédit !!`;
            await interaction.editReply({
              content: newMessage,
            });
          } else if (tourEquipement > 0) {
            console.log("je suis full d'arme");
            const newMessage = `Voyons voyons, ton équipement est encore fonctionnel. Il en faut pour tout le monde !`;
            await interaction.editReply({
              content: newMessage,
            });
          } else {
            NewXp = fiche.NiveauXP - valueEquipement;
            await fichePerso.findOneAndUpdate(
              { _id: IdPerso },
              { NiveauXP: NewXp }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { $push: { Sac: `1 Armure` } }
            );
            await ficheBagPerso.findOneAndUpdate(
              { _id: IdPerso },
              { "Tour.4": 500 }
            );
            interaction.member.roles.add(authId.RoleRP.Armure);
            const newMessage = `Merci pour l'achat de cette armure chez **Bric et Broc** ! Tu viens d'être débité(e) de ${valueEquipement} XP`;
            await interaction.editReply({
              content: newMessage,
            });
          }
        } else {
          console.log("On est pas bon");
        }
      }
    } else {
      const newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans un des salons de commerces`;
      await interaction.editReply({
        content: newMessage,
      });
    }
  },
};
