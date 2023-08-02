const { channel } = require("diagnostics_channel");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
var authId = JSON.parse(fs.readFileSync("./auth.json"));
const mongoose = require("mongoose");
const ficheBonus = require("../../BonusRollMeteo");
const ficheSalonBonusLieu = require("../../salonBonus");
const fichePerso = require("../../FichePerso");
const ficheCombat = require("../../FicheCombat");
const ficheMeteo = require("../../meteo");
const ficheMeteotest = require("../../salonMeteo");

const ficheBagPerso = require("../../fichePersoSac");
const wait = require("node:timers/promises").setTimeout;

function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("combat")
    .setDescription("Lancement d'un combat")
    .addNumberOption((option) =>
      option
        .setName("numerofiche")
        .setDescription("Numero Fiche Combat")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target0")
        .setDescription("Un joueur prenant part au combat")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target1")
        .setDescription("Un joueur prenant part au combat")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("target2")
        .setDescription("Un joueur prenant part au combat")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("target3")
        .setDescription("Un joueur prenant part au combat")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("target4")
        .setDescription("Un joueur prenant part au combat")
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

    if (interaction.commandName === "combat") {
      if (
        user.id == authId.staff.emi ||
        interaction.member.roles.cache.has(authId.RoleRP.RolePlay)
      ) {
        var joueur1 = interaction.options.getUser("target0");
        var joueur2 = interaction.options.getUser("target1");
        var joueur3 = interaction.options.getUser("target2");
        var joueur4 = interaction.options.getUser("target3");
        var joueur5 = interaction.options.getUser("target4");

        let TableauJoueur = [joueur1, joueur2, joueur3, joueur4, joueur5];
        let newTableauJoueur = [];
        console.log(TableauJoueur);
        console.log(newTableauJoueur);
        var i = 0;
        while (TableauJoueur[i] != null) {
          console.log(TableauJoueur[i].id);
          var GMember = Guild.member(TableauJoueur[i].id);
          GMember.roles.add(auth.RoleRP.Combat);
          var Nombrejoueur = i + 1;
          newTableauJoueur = newTableauJoueur.concat(TableauJoueur[i].id);
          i++;
        }

        for (j = i; j < 5; j++) {
          newTableauJoueur = newTableauJoueur.concat("X");
        }

        console.log(Nombrejoueur);
        console.log(newTableauJoueur);
        var fichesCollect = await ficheCombat.find({});
        var numberFiche = fichesCollect.length;
        var FicheNumero = interaction.options.getNumber("numerofiche");
        if (numberFiche == 1) {
          FicheNumero = 2;
        } else {
          FicheNumero = numberFiche + 1;
        }
        createFicheCombat(FicheNumero);
        let ficheCombatOld = await ficheCombat.findOne({
          _id: FicheNumero,
        });
        console.log(ficheCombatOld);
        await ficheCombat.updateMany(
          { _id: FicheNumero },
          {
            $set: {
              IdJoueur: newTableauJoueur,
            },
          }
        );
        let ficheCombatNew = await ficheCombat.findOne({
          _id: FicheNumero,
        });
        console.log(ficheCombatNew);
        console.log();
        const ChannelNameIdJet = client.channels.cache.get(authId.Salon.Jet);
        const newMessage = `La fiche combat numero ${FicheNumero} a bien été créée.\nLe fight peut commencer`;
        // client.channels.cache
        //  .get(channelMessage)
        //  .send(newMessage)
        //  .then((msg) => setTimeout(() => msg.delete(), 5000));
        await interaction.editReply({
          content: newMessage,
        });
        //await interaction.editReply({});
        //  content: newMessage,
        //});
        await wait(5000);
        await interaction.deleteReply();
      }
    }
  },
};

function createFicheCombat(Numero) {
  const IdentityCombat = new ficheCombat({
    _id: Numero,
    TourGlobal: [0],
    IdJoueur: ["Target0", "Target1", "Target2", "Target3", "Target4"],
    TourJoueur: [0, 0, 0, 0, 0],
    TM16: [0, 0, 0, 0, 0],
    M16Activ: [0, 0, 0, 0, 0],
    M16ActivAbove10: [0, 0, 0, 0, 0],
    TM10: [0, 0, 0, 0, 0],
    TM3: [0, 0, 0, 0, 0],
    time: Date(),
  });

  IdentityCombat.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}
