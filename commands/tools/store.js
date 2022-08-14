const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheStore = require("../../Boutique");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Boutique")
    .addStringOption((option) =>
      option
        .setName("boutique")
        .setDescription("The gif category")
        .setRequired(true)
        .addChoices(
          { name: "Maitrise", value: "maitrise" },
          { name: "Arme", value: "arme" },
          { name: "Armure", value: "armure" },
          { name: "Potion", value: "potion" }
        )
    ),
  async execute(interaction, client) {
    const channelMessage = interaction.channelId;
    console.log(channelMessage);
    console.log(authId.Salon.JetDeDes);
    if (channelMessage == authId.Salon.JetDeDes) {
      if (interaction.commandName === "store") {
        console.log("Coucou");
        if (interaction.options.getString("boutique") === "maitrise") {
          let boutique = await ficheStore.findOne({
            _id: authId.idDatabase.storeId,
          });
          console.log(boutique.Maitrise);
          console.log(ficheStore.Maitrise);
          const embed = new EmbedBuilder()
            .setTitle(`Boutique de niveaux de maitrise`)
            .setColor(0x18e1ee)
            .addFields(
              {
                name: `Maitrise 2`,
                value: `${ficheStore.Maitrise.Maitrise2}`,
                inline: true,
              },
              {
                name: `Maitrise 3`,
                value: `${ficheStore.Maitrise.Maitrise3}`,
                inline: true,
              },
              {
                name: `Maitrise 4`,
                value: `${ficheStore.Maitrise.Maitrise4}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Maitrise 5`,
                value: `${ficheStore.Maitrise.Maitrise5}`,
                inline: true,
              },
              {
                name: `Maitrise 6`,
                value: `${ficheStore.Maitrise.Maitrise6}`,
                inline: true,
              },
              {
                name: `Maitrise 7`,
                value: `${ficheStore.Maitrise.Maitrise7}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Maitrise 8`,
                value: `${ficheStore.Maitrise.Maitrise8}`,
                inline: true,
              },
              {
                name: `Maitrise 9`,
                value: `${ficheStore.Maitrise.Maitrise9}`,
                inline: true,
              },
              {
                name: `Maitrise 10`,
                value: `${ficheStore.Maitrise.Maitrise10}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Maitrise 11`,
                value: `${ficheStore.Maitrise.Maitrise11}`,
                inline: true,
              },
              {
                name: `Maitrise 12`,
                value: `${ficheStore.Maitrise.Maitrise12}`,
                inline: true,
              },
              {
                name: `Maitrise 13`,
                value: `${ficheStore.Maitrise.Maitrise13}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Maitrise 14`,
                value: `${ficheStore.Maitrise.Maitrise14}`,
                inline: true,
              },
              {
                name: `Maitrise 15`,
                value: `${ficheStore.Maitrise.Maitrise15}`,
                inline: true,
              },
              {
                name: `Maitrise 16`,
                value: `${ficheStore.Maitrise.Maitrise16}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: `Maitrise 17`,
                value: `${boutique.Maitrise.Maitrise17}`,
                inline: true,
              },
              {
                name: `Maitrise 18`,
                value: `${ficheStore.Maitrise.Maitrise18}`,
                inline: true,
              },
              {
                name: `Maitrise 19`,
                value: `${ficheStore.Maitrise.Maitrise19}`,
                inline: true,
              }
            )
            .addFields({
              name: `Maitrise 20`,
              value: `${ficheStore.Maitrise.Maitrise20}`,
              inline: true,
            })
            .setThumbnail(
              "https://static.wikia.nocookie.net/skies-of-arcadia/images/e/e4/Avatar_The_Last_Airbender_logo_%28alternate_version%29.png/revision/latest?cb=20180224144932"
            );
          await interaction.reply({
            embeds: [embed],
          });
        } else if (interaction.options.getString("boutique") === "arme") {
          let boutique = await ficheStore.findOne({
            _id: authId.idDatabase.storeId,
          });
          console.log(boutique);
          const embed = new EmbedBuilder()
            .setTitle(`Boutique d'arme`)
            .setDescription(`A venir, un peu de patiente`)
            .setColor(0x18e1ee)
            .setThumbnail(
              "https://static.wikia.nocookie.net/skies-of-arcadia/images/e/e4/Avatar_The_Last_Airbender_logo_%28alternate_version%29.png/revision/latest?cb=20180224144932"
            );
          await interaction.reply({
            embeds: [embed],
          });
        } else if (interaction.options.getString("boutique") === "armure") {
          let boutique = await ficheStore.findOne({
            _id: authId.idDatabase.storeId,
          });
          console.log(boutique);
          const embed = new EmbedBuilder()
            .setTitle(`Boutique d'armure'`)
            .setDescription(`A venir, un peu de patiente`)
            .setColor(0x18e1ee)
            .setThumbnail(
              "https://static.wikia.nocookie.net/skies-of-arcadia/images/e/e4/Avatar_The_Last_Airbender_logo_%28alternate_version%29.png/revision/latest?cb=20180224144932"
            );
          await interaction.reply({
            embeds: [embed],
          });
        } else if (interaction.options.getString("boutique") === "potion") {
          let boutique = await ficheStore.findOne({
            _id: authId.idDatabase.storeId,
          });
          console.log(boutique);
          const embed = new EmbedBuilder()
            .setTitle(`Boutique de potion`)
            .setDescription(`A venir, un peu de patiente`)
            .setColor(0x18e1ee)
            .setThumbnail(
              "https://static.wikia.nocookie.net/skies-of-arcadia/images/e/e4/Avatar_The_Last_Airbender_logo_%28alternate_version%29.png/revision/latest?cb=20180224144932"
            );
          await interaction.reply({
            embeds: [embed],
          });
        }
      }
    } else {
      const ChannelNameId = client.channels.cache.get(authId.Salon.JetDeDes);
      newMessage = `Tu n'es pas dans le bon salon\nTu dois faire cette commande dans le salon ${ChannelNameId}`;
      await interaction.reply({
        content: newMessage,
      });
    }
  },
};
