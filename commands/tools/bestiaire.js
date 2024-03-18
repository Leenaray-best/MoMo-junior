// else if (interaction.options.getString("categorie") === "bestiaire") {
//     ListAnimaux = ["bison", "chien", "furet", "chat", "cerf"];
//     for (i = 0; i < ListAnimaux.length; i++) {
//       let guildAnimal = await ficheAnimauxRP.findOne({
//         _id: NameGuild,
//       });
//     }
//   }

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
    .setName("bestiaire")
    .setDescription("Description des compagnons")
    .addStringOption((option) =>
      option
        .setName("animaux")
        .setRequired(true)
        .setDescription("Choix de l'animal")
        .addChoices(
          { name: "Bison", value: "bison" },
          { name: "Chien", value: "chien" },
          { name: "Furet", value: "furet" },
          { name: "Chat", value: "chat" },
          { name: "Cerf", value: "cerf" }
        )
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const user = interaction.user;
    const channelMessage = interaction.channelId;
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (
      (user.id == authId.staff.emi ||
        user.id == authId.staff.leena ||
        user.id == authId.staff.meri ||
        member.roles.cache.has(authId.RoleRP.RoleStaff) ||
        user.id == authId.RoleRP.RolePlay) /*||
        user.id == authId.RoleRP.RolePlay*/ &&
      interaction.channelId == authId.Salon.JetDeDes
    ) {
      ListAnimaux = ["bison", "chien", "furet", "chat", "cerf"];
      ListAnimaux2 = [
        "Bison-volant",
        "Chien-Ours Polaire",
        "Furet de Feu",
        "Chat-Hibou",
        "Cerf-Puma",
      ];
      ListWebsitePhoto = [
        "https://images-ext-2.discordapp.net/external/dpxRw0nrVupsD3M2J4XJFcoguLgsP6DdY4pfSwuL9fE/%3Fcb%3D20130206134533%26path-prefix%3Dfr/https/static.wikia.nocookie.net/avatar-ldmdla/images/9/99/Oogi.png/revision/latest",
        "https://images-ext-1.discordapp.net/external/nkkSN2T_doZcisl_EXXYpOR_R_Eb-wg787WCiO4OouU/%3Fcb%3D20121027081115%26path-prefix%3Dfr/https/static.wikia.nocookie.net/avatar-ldmdla/images/3/35/Naga.png/revision/latest/top-crop/width/360/height/360",
        "https://images-ext-1.discordapp.net/external/pzPVaM4PFYBUi-GPY9Wz8RTFFtyYFeJvK6LtYR0EWTQ/%3Fcb%3D20121027085448%26path-prefix%3Dfr/https/static.wikia.nocookie.net/avatar-ldmdla/images/3/30/Pabu.png/revision/latest",
        "https://images-ext-2.discordapp.net/external/_AZokt5JvycX2EaDcmtt_F_4DZg8uGOWXuOu9_Jflaw/https/images.wallpaperscraft.ru/image/single/kot_sova_art_129702_1350x2400.jpg?width=462&height=821",
        "https://images-ext-2.discordapp.net/external/kt8bTJ3kDrzgERN7Yy4jVSe7UFwT4G_55B8Al5XPlZA/%3Fcb%3D20190418204415%26path-prefix%3Dfr/https/static.wikia.nocookie.net/avatar-ldmdla/images/2/22/Mula_dans_le_Monde_Spirituel.png/revision/latest",
      ];
      listeCompetence = [
        "Force",
        "Constitution",
        "Charisme",
        "Intelligence",
        "Survie",
        "Adresse",
        "Spiritualité",
        "Discretion",
      ];
      ListAttaque = [
        ["Charge", "Bouclier", "Saisie"],
        ["Morsure", "Pister", "Charger"],
        ["Griffer", "Vol", "Charme"],
        ["Griffure", "Pister", "Instinct"],
        ["Encorner", "Fuite", "Spiritualite"],
      ];
      for (i = 0; i < ListAnimaux.length; i++) {
        if (interaction.options.getString("animaux") === ListAnimaux[i]) {
          var NameGuild = ListAnimaux[i];
          let guildAnimal = await ficheAnimauxRP.findOne({
            _id: NameGuild,
          });
          console.log("Iteration choisi", i);
          console.log("Numero de la competence", ListAnimaux[i]);
          const embed = new EmbedBuilder()
            .setTitle(`${ListAnimaux2[i]}`)
            .setColor(0x18e1ee)
            .setDescription(
              `Avantages : ${guildAnimal.Avantage}
            \n Inconvénients : ${guildAnimal.Inconvenient}
            \n ${ListAttaque[i][0]} : ${guildAnimal.Actions[0]}
            \n ${ListAttaque[i][1]} : ${guildAnimal.Actions[1]}
            \n ${ListAttaque[i][2]} : ${guildAnimal.Actions[2]}`
            )
            .setThumbnail(ListWebsitePhoto[i]);
          for (j = 0; j < listeCompetence.length; j++) {
            embed.addFields({
              name: `${listeCompetence[j]}`,
              value: `${guildAnimal.Competence[j]},`,
              inline: true,
            });
          }
          embed.addFields({
            name: `Point de vie`,
            value: `${guildAnimal.PointDeVie},`,
            inline: true,
          });
          embed.addFields({
            name: `Histoire`,
            value: `${guildAnimal.Histoire},`,
            inline: true,
          });
          await interaction.editReply({
            embeds: [embed],
          });
        }
      }
    } else {
      const ChannelNameId = client.channels.cache.get(authId.Salon.Jet);
      // newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans le salon ${ChannelNameId}`;
      var newMessage = `En preparation`;
      await interaction.editReply({
        content: newMessage,
      });
      await wait(5000);
      await interaction.deleteReply();
    }
  },
};
