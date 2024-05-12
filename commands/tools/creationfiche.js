const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const { MongoClient } = require("mongodb");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("creationfiche")
    .setDescription("Creation de la fiche du perso")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Le joueur dont on créé la fiche")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("niveau")
        .setDescription("Niveau de Maitrise")
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
      const collectionbag = database.collection("fichepersobags");
      const joueur = interaction.options.getUser("target");
      // Insérez des données initiales
      let ListServer = await collection.findOne({
        _id: joueur.id,
      });
      if (ListServer) {
        const newMessage = `La fiche de ${joueur.username} est déjà présente dans la base de donnée.`;
        console.log(newMessage);
        await interaction.editReply({
          content: newMessage,
        });
      } else {
        var Niveau = interaction.options.getNumber("niveau");
        var initialData = [
          {
            _id: joueur.id,
            Username: joueur.username,
            Identite: {
              Nom: "Nom",
              Prenom: "Prenom",
              Age: 0,
              Sexe: "Sexe",
              Metier: "Metier",
              Categorie: "Categorie",
              PV: 0,
              PVMax: 0,
            },
            GainCompetence: 0,
            NiveauDeMaitrise: Niveau,
            PointDeResistance: 0,
            ResistancePhy: 0,
            ResistanceSpi: 0,
            NiveauXP: 0,
            Qualite: ["Qualite1", "Qualite2"],
            Defaut: "Defaut1",
            Faiblesse: ["Faiblesse1", "Faiblesse2"],
            Competence: {
              Force: 0,
              Constitution: 0,
              Charisme: 0,
              Intelligence: 0,
              Survie: 0,
              Adresse: 0,
              Spiritualite: 0,
              Discretion: 0,
            },
            LienFichePerso: "Lien",
            time: Date(),
          },
        ];
        var initialDataBag = [
          {
            _id: joueur.id,
            Competence: [0, 0, 0, 0, 0, 0, 0, 0],
            Sac: [String],
            Tour: [0, 0, 0, 0, 0],
            ValeurBonus: [0],
            NbrePotion: 0,
            NbrePoison: 0,
            time: Date(),
          },
        ];

        await collection.insertMany(initialData);
        await collectionbag.insertMany(initialDataBag);
        let ListServer = await collection.findOne({
          _id: joueur.id,
        });
        if (ListServer) {
          const newMessage = `La fiche de ${joueur.username} a bien été créée.`;
          console.log(newMessage);
          await interaction.editReply({
            content: newMessage,
          });
        } else {
          const newMessage = `ERREUR !! La fiche de ${joueur.username} n'a pas été créée.`;
          console.log(newMessage);
          await interaction.editReply({
            content: newMessage,
          });
        }
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
