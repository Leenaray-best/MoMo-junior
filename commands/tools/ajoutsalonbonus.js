const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheBonus = require("../../salonBonus");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ajoutsalonbonus")
    .setDescription("Info pour le joueur")
    .addChannelOption((option) =>
      option.setName("terre").setDescription("Pour les maitres de la terre")
    )
    .addChannelOption((option) =>
      option.setName("air").setDescription("Pour les maitres de l'air")
    )
    .addChannelOption((option) =>
      option.setName("eau").setDescription("Pour les maitres de l'eau")
    )
    .addChannelOption((option) =>
      option.setName("feu").setDescription("Pour les maitres du feu")
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "ajoutsalonbonus") {
      let guildBonus = await ficheBonus.findOne({
        _id: authId.idDatabase.BonusId,
      });
      // Add a channel to Earth bender
      if (interaction.options.getChannel("terre")) {
        const channel = interaction.options.getChannel("terre");
        console.log(channel.id);
        const idChannel = channel.id;
        console.log(guildBonus);
        console.log(guildBonus.Terre.length);
        await ficheBonus.findOneAndUpdate(
          { _id: authId.idDatabase.BonusId },
          { $push: { Terre: idChannel } }
        );
        // const ChannelNameId = client.channels.cache.get(idChannel);
        // console.log(ChannelNameId.name);
        let newguildBonus = await ficheBonus.findOne({
          _id: authId.idDatabase.BonusId,
        });
        const tailleTableau = newguildBonus.Terre.length;
        console.log(tailleTableau);

        let embed = new EmbedBuilder()
          .setTitle(
            `Liste des salons avec de Bonus pour les maitres de la terre`
          )
          .setColor(0x18e1ee);
        for (i = 0; i < newguildBonus.Terre.length; i++) {
          const channelIds = newguildBonus.Terre[i];
          const ChannelNameId = client.channels.cache.get(channelIds);
          embed.addFields({
            name: "Salon:",
            value: `${ChannelNameId},`,
            inline: true,
          });
        }

        newMessage = "Le salon a été ajouté";
        await interaction.editReply({
          embeds: [embed],
          content: newMessage,
        });
      } else if (interaction.options.getChannel("air")) {
        // Add a channel to Air bender
        const channelAir = interaction.options.getChannel("air");
        console.log(channelAir.id);
        const idChannelAir = channelAir.id;
        console.log(guildBonus);
        await ficheBonus.findOneAndUpdate(
          { _id: authId.idDatabase.BonusId },
          { $push: { Air: idChannelAir } }
        );
        let newguildBonus = await ficheBonus.findOne({
          _id: authId.idDatabase.BonusId,
        });
        const tailleTableau = newguildBonus.Air.length;
        console.log(newguildBonus.Air);
        console.log(tailleTableau);

        let embed = new EmbedBuilder()
          .setTitle(`Liste des salons avec de Bonus pour les maitres de l'air`)
          .setColor(0x18e1ee);
        for (i = 0; i < newguildBonus.Air.length; i++) {
          const channelIds = newguildBonus.Air[i];
          const ChannelNameId = client.channels.cache.get(channelIds);
          embed.addFields({
            name: "Salon:",
            value: `${ChannelNameId},`,
            inline: true,
          });
        }

        newMessage = "Le salon a été ajouté";
        await interaction.editReply({
          embeds: [embed],
          content: newMessage,
        });
      } else if (interaction.options.getChannel("eau")) {
        // Add a channel to Waater bender
        const channelEau = interaction.options.getChannel("eau");
        console.log(channelEau.id);
        const idChannelEau = channelEau.id;
        console.log(guildBonus);
        await ficheBonus.findOneAndUpdate(
          { _id: authId.idDatabase.BonusId },
          { $push: { Eau: idChannelEau } }
        );
        let newguildBonus = await ficheBonus.findOne({
          _id: authId.idDatabase.BonusId,
        });
        const tailleTableau = newguildBonus.Eau.length;
        console.log(tailleTableau);

        let embed = new EmbedBuilder()
          .setTitle(`Liste des salons avec de Bonus pour les maitres de l'eau`)
          .setColor(0x18e1ee);
        for (i = 0; i < newguildBonus.Eau.length; i++) {
          const channelIds = newguildBonus.Eau[i];
          const ChannelNameId = client.channels.cache.get(channelIds);
          embed.addFields({
            name: "Salon:",
            value: `${ChannelNameId},`,
            inline: true,
          });
        }

        newMessage = "Le salon a été ajouté";
        await interaction.editReply({
          embeds: [embed],
          content: newMessage,
        });
      } else if (interaction.options.getChannel("feu")) {
        // Add a channel to Waater bender
        const channelFeu = interaction.options.getChannel("feu");
        console.log(channelFeu.id);
        const idChannelFeu = channelFeu.id;
        console.log(guildBonus);
        await ficheBonus.findOneAndUpdate(
          { _id: authId.idDatabase.BonusId },
          { $push: { Feu: idChannelFeu } }
        );

        let newguildBonus = await ficheBonus.findOne({
          _id: authId.idDatabase.BonusId,
        });

        const tailleTableau = newguildBonus.Feu.length;
        console.log(tailleTableau);

        let embed = new EmbedBuilder()
          .setTitle(`Liste des salons avec de Bonus pour les maitres du feu`)
          .setColor(0x18e1ee);
        for (i = 0; i < newguildBonus.Feu.length; i++) {
          const channelIds = newguildBonus.Feu[i];
          const ChannelNameId = client.channels.cache.get(channelIds);
          embed.addFields({
            name: "Salon:",
            value: `${ChannelNameId},`,
            inline: true,
          });
        }

        newMessage = "Le salon a été ajouté";
        await interaction.editReply({
          embeds: [embed],
          content: newMessage,
        });
      }
    }
  },
};
