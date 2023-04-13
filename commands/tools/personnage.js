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
    .setName("personnage")
    .setDescription("Info pour le joueur")
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setRequired(true)
        .setDescription("Choix")
        .addChoices(
          { name: "Carte", value: "carte" },
          { name: "Météo", value: "meteo" },
          { name: "Fiche Perso", value: "fichejoueur" },
          { name: "XP", value: "xp" }
        )
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    console.log(channelMessage);
    console.log(authId.Salon.JetDeDes);
    if (channelMessage == authId.Salon.JetDeDes) {
      if (interaction.commandName === "personnage") {
        if (interaction.options.getString("categorie") === "carte") {
          var gifCarte =
            "https://cdn.discordapp.com/attachments/641015662118174730/843501620172292096/map2.jpg";
          const newMessage = gifCarte;
          await interaction.editReply({
            content: newMessage,
          });
        } else if (interaction.options.getString("categorie") === "meteo") {
          const user = interaction.user;
          const listSalonRp = [
            authId.RoleRP.PoleNord,
            authId.RoleRP.TempleAus,
            authId.RoleRP.NationFeu,
            authId.RoleRP.TempleOcc,
            authId.RoleRP.BaSingSe,
            authId.RoleRP.Omashu,
            authId.RoleRP.Marais,
            authId.RoleRP.Desert,
            authId.RoleRP.TempleOr,
            authId.RoleRP.IleKyoshi,
            authId.RoleRP.TempleBor,
            authId.RoleRP.PoleSud,
          ];
          let guildMeteo = await ficheMeteo.findOne({
            _id: authId.idDatabase.meteoId,
          });
          let guildMeteotest = await ficheMeteotest.findOne({
            _id: authId.idDatabase.meteotestId,
          });
          console.log(guildMeteotest.Salon);
          const catMeteo = [
            guildMeteo.PoleNord,
            guildMeteo.TempleAus,
            guildMeteo.NationFeu,
            guildMeteo.TempleOcc,
            guildMeteo.BaSingSe,
            guildMeteo.Omashu,
            guildMeteo.Marais,
            guildMeteo.Desert,
            guildMeteo.TempleOr,
            guildMeteo.IleKyoshi,
            guildMeteo.TempleBor,
            guildMeteo.PoleSud,
          ];
          for (salonName in listSalonRp) {
            if (interaction.member.roles.cache.has(listSalonRp[salonName])) {
              var gifCarte = "Temps dans ta région : " + catMeteo[salonName];
              const newMessage = gifCarte;
              await interaction.editReply({
                content: newMessage,
              });
            }
          }
        } else if (
          interaction.options.getString("categorie") === "fichejoueur"
        ) {
          const user = interaction.user;
          IdPerso = user.id;
          console.log(IdPerso);
          let fiche = await fichePerso.findOne({
            _id: IdPerso,
          });
          let ficheSac = await ficheBagPerso.findOne({
            _id: IdPerso,
          });
          console.log(ficheSac);
          console.log(fiche.Identite.Nom);
          const listeQualite = fiche.Qualite;
          const listeFaiblesse = fiche.Faiblesse;
          console.log(ficheSac.Sac.length);
          if (ficheSac.Sac.length == 0) {
            var ItemBag = "Empty";
          } else {
            var ItemBag = ficheSac.Sac;
          }

          const embed = new EmbedBuilder()
            .setTitle(`Boutique de niveaux de maitrise`)
            .setColor(0x18e1ee)
            .setDescription(
              `Nom : ${fiche.Identite.Nom}\nPrenom : ${fiche.Identite.Prenom}\nAge: ${fiche.Identite.Age}\nSexe: ${fiche.Identite.Sexe}\nMetier : ${fiche.Identite.Metier}\nNiveau de Maitrise : ${fiche.NiveauDeMaitrise}\nNiveau XP : ${fiche.NiveauXP}\nPoint de Competence : ${fiche.GainCompetence}\nFaiblesse : ${listeFaiblesse[0]}, ${listeFaiblesse[1]}`
            )
            .setThumbnail(user.avatarURL())
            .addFields(
              { name: `Qualite 1`, value: listeQualite[0], inline: true },
              { name: `Qualite 2`, value: listeQualite[1], inline: true },
              { name: `Defaut 1`, value: `${fiche.Defaut}`, inline: true }
            )
            .addFields(
              {
                name: `Force`,
                value: `${fiche.Competence.Force}`,
                inline: true,
              },
              {
                name: `Constitution`,
                value: `${fiche.Competence.Constitution}`,
                inline: true,
              },
              {
                name: `Charisme`,
                value: `${fiche.Competence.Charisme}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Intelligence`,
                value: `${fiche.Competence.Intelligence}`,
                inline: true,
              },
              {
                name: `Survie`,
                value: `${fiche.Competence.Survie}`,
                inline: true,
              },
              {
                name: `Adresse`,
                value: `${fiche.Competence.Adresse}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Spiritualite`,
                value: `${fiche.Competence.Spiritualite}`,
                inline: true,
              },
              {
                name: `Discretion`,
                value: `${fiche.Competence.Discretion}`,
                inline: true,
              }
            )
            .addFields({
              name: `Lien Gdoc`,
              value: `${fiche.LienFichePerso}`,
              inline: true,
            })
            .addFields(
              {
                name: `Sac`,
                value: `${ItemBag}`,
                inline: true,
              },
              {
                name: `Tour Bonus Potion,Poison`,
                value: `${(ficheSac.Tour[0], ficheSac.Tour[1])}`,
                inline: true,
              }
            )
            .addFields({
              name: `Tour Bonus Epée, Dague, Armure`,
              value: `${
                (ficheSac.Tour[2], ficheSac.Tour[3], ficheSac.Tour[4])
              }`,
              inline: true,
            });

          await interaction.editReply({
            embeds: [embed],
          });
        } else if (interaction.options.getString("categorie") === "xp") {
          const user = interaction.user;
          IdPerso = user.id;
          console.log(IdPerso);
          let fiche = await fichePerso.findOne({
            _id: IdPerso,
          });
          newMessage = `Tu as ${fiche.NiveauXP} XP`;
          await interaction.editReply({
            content: newMessage,
          });
        }
      }
    } else {
      const ChannelNameId = client.channels.cache.get(authId.Salon.Jet);
      newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans le salon ${ChannelNameId}`;
      await interaction.editReply({
        content: newMessage,
      });
    }
  },
};
