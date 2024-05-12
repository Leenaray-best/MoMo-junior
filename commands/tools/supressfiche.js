const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const { MongoClient } = require("mongodb");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("supressfiche")
    .setDescription("Suppression de la fiche du perso")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Le joueur dont on créé la fiche")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    if (
      interaction.member.roles.cache.has(authId.staff.StaffBot) &&
      interaction.channelId == authId.Salon.SalonBotAdmin
    ) {
      const guildId = message.guildId;
      const guild = client.guilds.cache.get(guildId);
      // Vérifiez si l'objet Guild existe (par exemple, si le message a été envoyé dans un DM, guild sera undefined)

      // Obtenez le nom du serveur
      var guildName = guild.name;
      var guildName = guildName.split(" ").join("");
      var guildName = "test";
      // Utilisez guildName comme nécessaire
      console.log(`Le message a été posté dans le serveur : ${guildName}`);

      const mongoClient = new MongoClient(process.env["MONGODB_URI"], {});
      mongoClient.connect();
      console.log("Connecté à la base de données MongoDB");
      const database = mongoClient.db(guildName);
      const collection = database.collection("fichepersos");
      const collectionBag = database.collection("fichepersobags");
      const joueur = interaction.options.getUser("target");
      // Insérez des données initiales
      let ListServer = await collection.findOne({
        _id: joueur.id,
      });
      if (ListServer) {
        await collection.findOneAndDelete({
          _id: joueur.id,
        });
        await collectionBag.findOneAndDelete({
          _id: joueur.id,
        });
        let newListServer = await collection.findOne({
          _id: joueur.id,
        });
        if (!newListServer) {
          const newMessage = `La fiche de ${joueur.username} a été supprimée la base de donnée.\nIl faut enlever tout les roles lies au RolePlay et celui de Maitrise. Lui mettre le role Bienvenue et lui faire retirer sa maitrise`;
          console.log(newMessage);
          await interaction.editReply({
            content: newMessage,
          });
        } else {
          const newMessage = `La fiche de ${joueur.username} est toujours dans la base de donnée.`;
          console.log(newMessage);
          await interaction.editReply({
            content: newMessage,
          });
        }
      } else {
        const newMessage = `Le joueur ${joueur.username} n'a pas de fiche dans la base de donnée.`;
        console.log(newMessage);
        await interaction.editReply({
          content: newMessage,
        });
      }
    } else {
      const newMessage = `Tu n'as pas les autorisations pour faire ca`;
      console.log(newMessage);
      await interaction.editReply({
        content: newMessage,
      });
    }

    //await wait(5000);
    //await interaction.deleteReply();
  },
};
