require("dotenv").config();

//var CronJob = require("cron").CronJob;

///git add .
///git commit -m "FixedSmallIssue"
///git push origin master

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
client.commands = new Collection();
client.commandArray = [];
const counterMot = require("letter-count");
const functionFolders = fs.readdirSync(`./functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}
const prefixNewFil = "newfil";
const prefixNewCategory = "newcat";
const prefixSupprFil = "supprfil";
const prefixListActif = "filactif";
const prefixSoin = "soignezmoi";
// Gather our available slash commands (interactions)
// client.slashCommands = new Discord.Collection();
// const slashCommandsFiles = fs
//   .readdirSync("./slash-command")
//   .filter((file) => file.endsWith(".js"));
// for (const file of slashCommandsFiles) {
//   const command = require(`./slash-command/${file}`);
//   client.slashCommands.set(command.name, command);
// }

client.auth = require("./auth.json");
const token = process.env.token; //client.auth.token; Pour HEROKU
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connection to Database in");
});
/*mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }() => { }).catch(err => console.log(err));*/
/*mongoose.set("useFindAndModify", false);*/

const FichePerso = require("./FichePerso.js");
const BoutiqueMaitrise = require("./Boutique.js");
const salonTemps = require("./salonMeteo.js");
const Weather = require("./meteo");
const salonQuete = require("./salonQuete.js");
const Bonus = require("./salonBonus.js");
const ListeMetier = require("./job.js");
const salonBonusMeteo = require("./BonusRollMeteo.js");
const ficheSacPerso = require("./fichePersoSac.js");
const ficheObjetRP = require("./ficheObjet.js");
const testimage = "testimage";
const ficheAnimauxRP = require("./ficheAnimaux.js");
const ficheCombat = require("./FicheCombat.js");
client.handleEvents();
client.handleCommands();

client
  .login(token)
  .then(() => {
    createBoutique();
    createJobList();
    createWeather();
    createSalonWeather();
    createSalonQuest();
    createSalonBonus();
    createBonusMeteoRoll();
    createFicheObjetRP();
    createFicheAnimaux();
    createFicheCombat();
  })
  .catch((err) => console.log(err));
var auth = require("./auth.json");
var cron = require("node-cron");

// var job = new CronJob(
//   "* 58 15 * * *",
//   function
// cron.schedule("0 7 * * *", async () => {
//   console.log(auth.Salon.JetDeDes);
//   var tableauMeteo1 = ["☀️", "☁️", "🌤️", "🌧️", "☀️", "☁️", "🌤️", "🌧️"];
//   var tableauMeteo2 = ["☁️", "🌫️", "🌧️", "🌫️", "🌫️", "🌫️", "🌫️", "🌧️"];
//   var tableauMeteo3 = ["🌨️", "☁️", "🌨️", "🌧️", "🌧️", "🌨️", "🌨️", "🌨️"];
//   var tableauNuit = [
//     "🌑",
//     "🌒",
//     "🌒",
//     "🌓",
//     "🌔",
//     "🌔",
//     "🌕",
//     "🌖",
//     "🌖",
//     "🌗",
//     "🌘",
//   ];
//   var tableauSang = ["🌕", auth.Emote.bloodmoon, "🌕"];
//   var WeatherNord = tableauMeteo3[Math.floor(Math.random() * 8)];
//   var WeartherTempAus = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherNationFeu = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherTempOcc = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherBahSing = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherOmashu = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeatherMarais = tableauMeteo2[Math.floor(Math.random() * 8)];
//   var WeartherDesert = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherTempOr = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherKyoshi = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeartherTempBor = tableauMeteo1[Math.floor(Math.random() * 8)];
//   var WeatherSud = tableauMeteo3[Math.floor(Math.random())];
//   client.channels.fetch(auth.Salon.JetDeDes).then((channel) =>
//     channel.send(
//       `**Bulletin meteo du jour**

// __Pole Nord__ : ` +
//         WeatherNord +
//         `
// __Temple de l'air austral__: ` +
//         WeartherTempAus +
//         `
// __Nation du feu__: ` +
//         WeartherNationFeu +
//         `
// __Temple de l'air occidental__: ` +
//         WeartherTempOcc +
//         `
// __Ba Sing Se__: ` +
//         WeartherBahSing +
//         `
// __Omashu__: ` +
//         WeartherOmashu +
//         `
// __Marais__ : ` +
//         WeatherMarais +
//         `
// __Desert__: ` +
//         WeartherDesert +
//         `
// __Temple de l'air Oriental__: ` +
//         WeartherTempOr +
//         `
// __Ile de Kyoshi__: ` +
//         WeartherKyoshi +
//         `
// __Temple de l'air boreal__: ` +
//         WeartherTempBor +
//         `
// __Pole Sud__ : ` +
//         WeatherSud
//     )
//   );
//   let newFicheTemps = await Weather.findOneAndUpdate(
//     { _id: "152579868" },
//     {
//       PoleNord: WeatherNord,
//       TempleAus: WeartherTempAus,
//       NationFeu: WeartherNationFeu,
//       TempleOcc: WeartherTempOcc,
//       BaSingSe: WeartherBahSing,
//       Omashu: WeartherOmashu,
//       Marais: WeatherMarais,
//       Desert: WeartherDesert,
//       TempleOr: WeartherTempOr,
//       IleKyoshi: WeartherKyoshi,
//       TempleBor: WeartherTempBor,
//       PoleSud: WeatherSud,
//     }
//   );
//   console.log(newFicheTemps.PoleNord);
//   var FicheLune = await Weather.findOne({ _id: "152579868" });
//   console.log(FicheLune.CounterLune);
//   CountLune = FicheLune.CounterLune;
//   CountLune = CountLune + Number(1);

//   if (CountLune == 11) {
//     CountLune = Number(0);
//   }

//   if (CountLune == 6) {
//     var LuneBloodOrNot = tableauSang[Math.floor(Math.random() * 2)];
//     console.log(LuneBloodOrNot);
//     client.channels.fetch(auth.Salon.JetDeDes).then((channel) =>
//       channel.send(
//         `**Bulletin de la nuit (a partir de 19h)**

// __Lune__ : ` + LuneBloodOrNot
//       )
//     );
//     await Weather.findOneAndUpdate(
//       { _id: "152579868" },
//       { Nuit: LuneBloodOrNot }
//     );
//   } else {
//     console.log("CountLune : " + CountLune);
//     client.channels.fetch(auth.Salon.JetDeDes).then((channel) =>
//       channel.send(
//         `**Bulletin de la nuit (a partir de 18h)**

// __Lune__ : ` + tableauNuit[CountLune]
//       )
//     );
//     await Weather.findOneAndUpdate(
//       { _id: "152579868" },
//       { Nuit: tableauNuit[CountLune] }
//     );
//   }

//   await Weather.findOneAndUpdate(
//     { _id: "152579868" },
//     { CounterLune: CountLune }
//   );
// });

client.on("messageCreate", async (message) => {
  // console.log("TA MERE LA PUTE");
  petitMessage = message.content.toLowerCase();
  const firstChar = message.content.charAt(0);
  const isLetter = /^[a-zA-Z]/.test(firstChar);
  // Ajouter des salons
  // if (
  //   message.channel.id == auth.Salon.JetDeDes &&
  //   petitMessage == prefixAjouteSalonQuete
  // ) {
  //   console.log("Coucou");
  //   var guildQuete = await salonQuete.findOne({
  //     _id: auth.idDatabase.questId,
  //   });
  //   console.log(guildQuete);
  //   const argQuete = message.content.split(" ").slice(0);
  //   // const argIdCat = message.content.split(" ").slice(1);
  //   // const argIdCat1 = argIdCat[0].split("&");
  //   // const realId = argIdCat1[0].split(">");
  //   console.log(argQuete);
  //   // if (argQuete[0] == pinte) {
  //   //   tailleTableau = len(guildQuete.Pinte);
  //   //   for (salonName in tailleTableau) {
  //   //     if (guildQuete.Pinte[salonName] == "") {
  //   //       await guildQuete.findOneAndUpdate({
  //   //         _id: authId.idDatabase.questId,
  //   //         Pinte: argSalonAjout,
  //   //       });
  //   //     }
  //   //   }
  //   // }
  // }
  // Roll du niveau de maitrise
  // if (
  //   message.channel.id == auth.Salon.JetDeDes &&
  //   petitMessage == prefixMaitrise
  // ) {
  //   if (
  //     message.member.roles.cache.has(auth.RoleRP.Maitrise1) ||
  //     message.member.roles.cache.has(auth.RoleRP.Maitrise2) ||
  //     message.member.roles.cache.has(auth.RoleRP.Maitrise3)
  //   ) {
  //     message.reply("La commande se fait une seule fois");
  //   } else if (message.member.roles.cache.has(auth.RoleRP.Bienvenue)) {
  //     Niveau = Rand(3);
  //     switch (Niveau) {
  //       case 1:
  //         message.member.roles.add(auth.RoleRP.Maitrise1);
  //         message.member.roles.remove(auth.RoleRP.Bienvenue);
  //         var gifMaitrise =
  //           "https://tenor.com/view/avatar-the-last-airbender-aang-airbending-goofy-funny-gif-13514465";
  //         break;
  //       case 2:
  //         message.member.roles.add(auth.RoleRP.Maitrise2);
  //         message.member.roles.remove(auth.RoleRP.Bienvenue);
  //         var gifMaitrise =
  //           "https://cdn.discordapp.com/attachments/594824367733604361/797169637946687488/firebend___cooking.gif";
  //         break;
  //       case 3:
  //         message.member.roles.add(auth.RoleRP.Maitrise3);
  //         message.member.roles.remove(auth.RoleRP.Bienvenue);
  //         var gifMaitrise =
  //           "https://cdn.discordapp.com/attachments/594824367733604361/797169079411671071/Waterbend___trempli_attaque.gif";
  //         break;
  //       default:
  //         break;
  //     }
  //     message.reply("Tu as une maitrise de niveau " + Niveau + " ! ");
  //     client.channels.cache.get(auth.Salon.JetDeDes).send(gifMaitrise);
  //     createFichePerso(message, Niveau);
  //   }
  // }

  // POUR LE GAIN DE L'XP DANS LES FILS ET DANS LES CATEGORIE
  let guildQuete = await salonQuete.findOne({ _id: auth.idDatabase.questId });
  const tailleTableau2 = guildQuete.FilDiscussion.length;
  if (message.author.bot) return;
  if (
    !petitMessage.startsWith("/") &&
    (petitMessage.startsWith("*") || isLetter)
  ) {
    for (i = 0; i < tailleTableau2; i++) {
      if (message.channel.id == guildQuete.FilDiscussion[i]) {
        console.log("message RP");
        // if (
        //   message.channel.parent == auth.Salon.CategorieRPAzathys ||
        //   message.channel.parent == auth.Salon.CategorieRPTempleAustral ||
        //   message.channel.parent == auth.Salon.CategorieRPMasun ||
        //   message.channel.parent == auth.Salon.CategorieRPCroissant ||
        //   message.channel.parent == auth.Salon.CategorieRPTempOcci ||
        //   message.channel.parent == auth.Salon.CategorieRPBraise ||
        //   message.channel.parent == auth.Salon.CategorieRPBahSingSe ||
        //   message.channel.parent == auth.Salon.CategorieRPOmashu ||
        //   message.channel.parent == auth.Salon.CategorieRPMaraisBrumeux ||
        //   message.channel.parent == auth.Salon.CategorieRPDesertSiWang ||
        //   message.channel.parent == auth.Salon.CategorieRPTempOrient ||
        //   message.channel.parent == auth.Salon.CategorieRPIleKyoshi ||
        //   message.channel.parent == auth.Salon.CategorieRPTempBoreal ||
        //   message.channel.parent == auth.Salon.CategorieRPTribuSud ||
        //   message.channel.parent == auth.Salon.CategorieTempleTerre ||
        //   message.channel.parent == auth.Salon.CategorieSaloncache
        // ) {
        if (message.member.roles.cache.has(auth.RoleRP.progreAFaire)) {
          console.log("ne fait rien");
        } else {
          var NewXP = 0;
          var taillemessage = petitMessage.trim().length; //counterMot.count(petitMessage, "-c");
          console.log(taillemessage);
          if (taillemessage < 10) {
            console.log("C'est une slash command");
          } else if (taillemessage >= 10 && taillemessage < 100) {
            console.log("taille message inf a 100");
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { time: Date.now() }
            );
            var fichePer = await FichePerso.findOne({ _id: message.author.id });
            let con = message.content;
            const cont = `${fichePer.Identite.Prenom} ${
              fichePer.Identite.Nom
            } - ${client.channels.cache.get(message.channel.id)}: ${con}\n`;
            //console.log(cont);
            client.channels.cache.get(auth.Salon.LogMessage).send(cont);
            console.log(NewXP);
          } else if (taillemessage >= 100 && taillemessage < 200) {
            console.log("taille message inf a 200");
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            var NewXP = xPfiche.NiveauXP + Rand(30) + 10;
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
            var fichePer = await FichePerso.findOne({ _id: message.author.id });
            let con = message.content;
            const cont = `${fichePer.Identite.Prenom} ${
              fichePer.Identite.Nom
            } - ${client.channels.cache.get(message.channel.id)}: ${con}\n`;
            //console.log(cont);
            client.channels.cache.get(auth.Salon.LogMessage).send(cont);
            console.log(NewXP);
          } else if (taillemessage >= 200 && taillemessage <= 250) {
            console.log("taille message inf a 250");
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            var NewXP = xPfiche.NiveauXP + Rand(70) + 30;
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
            var fichePer = await FichePerso.findOne({ _id: message.author.id });
            let con = message.content;
            const cont = `${fichePer.Identite.Prenom} ${
              fichePer.Identite.Nom
            } - ${client.channels.cache.get(message.channel.id)}: ${con}\n`;
            //console.log(cont);
            client.channels.cache.get(auth.Salon.LogMessage).send(cont);
            console.log(NewXP);
          } else if (taillemessage > 250) {
            console.log("taille message sup a 250");
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            var NewXP = xPfiche.NiveauXP + Rand(90) + 70;
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
            var fichePer = await FichePerso.findOne({ _id: message.author.id });
            let con = message.content;
            const cont = `${fichePer.Identite.Prenom} ${
              fichePer.Identite.Nom
            } - ${client.channels.cache.get(message.channel.id)}: ${con}\n`;
            //console.log(cont);
            client.channels.cache.get(auth.Salon.LogMessage).send(cont);
            console.log(NewXP);
          }
        }
      }
    }
  }
  //console.log("Sortie de la boucle de gain d'XP");

  // POUR LES CAT
  console.log(message.channel.id);
  const tailleTableau = guildQuete.AllCategorie.length;
  if (
    !petitMessage.startsWith("/") &&
    (petitMessage.startsWith("*") || isLetter)
  ) {
    for (i = 0; i < tailleTableau; i++) {
      //console.log(guildQuete.AllCategorie[i]);
      if (message.channel.parent == guildQuete.AllCategorie[i]) {
        console.log("message RP");
        // if (
        //   message.channel.parent == auth.Salon.CategorieRPAzathys ||
        //   message.channel.parent == auth.Salon.CategorieRPTempleAustral ||
        //   message.channel.parent == auth.Salon.CategorieRPMasun ||
        //   message.channel.parent == auth.Salon.CategorieRPCroissant ||
        //   message.channel.parent == auth.Salon.CategorieRPTempOcci ||
        //   message.channel.parent == auth.Salon.CategorieRPBraise ||
        //   message.channel.parent == auth.Salon.CategorieRPBahSingSe ||
        //   message.channel.parent == auth.Salon.CategorieRPOmashu ||
        //   message.channel.parent == auth.Salon.CategorieRPMaraisBrumeux ||
        //   message.channel.parent == auth.Salon.CategorieRPDesertSiWang ||
        //   message.channel.parent == auth.Salon.CategorieRPTempOrient ||
        //   message.channel.parent == auth.Salon.CategorieRPIleKyoshi ||
        //   message.channel.parent == auth.Salon.CategorieRPTempBoreal ||
        //   message.channel.parent == auth.Salon.CategorieRPTribuSud ||
        //   message.channel.parent == auth.Salon.CategorieTempleTerre ||
        //   message.channel.parent == auth.Salon.CategorieSaloncache
        // ) {
        if (message.member.roles.cache.has(auth.RoleRP.progreAFaire)) {
          console.log("ne fait rien");
        } else {
          var NewXP = 0;
          var taillemessage = petitMessage.trim().length; //counterMot.count(petitMessage, "-c");
          console.log(taillemessage);
          if (taillemessage < 100) {
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { time: Date.now() }
            );
          }
          if (taillemessage >= 100 && taillemessage <= 200) {
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            var NewXP = xPfiche.NiveauXP + Rand(30) + 10;
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
          }
          if (taillemessage > 200 && taillemessage <= 250) {
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            var NewXP = xPfiche.NiveauXP + Rand(70) + 30;
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
          }
          if (taillemessage > 250) {
            var xPfiche = await FichePerso.findOne({ _id: message.author.id });
            var NewXP = xPfiche.NiveauXP + Rand(90) + 70;
            console.log(xPfiche.Identite.Nom, xPfiche.Identite.Prenom);
            console.log("old XP:", xPfiche.NiveauXP);
            await FichePerso.findOneAndUpdate(
              { _id: message.author.id },
              { NiveauXP: NewXP, time: Date.now() }
            );
          }
          var fichePer = await FichePerso.findOne({ _id: message.author.id });
          let con = message.content;
          const cont = `${fichePer.Identite.Prenom} ${
            fichePer.Identite.Nom
          } - ${client.channels.cache.get(message.channel.id)}: ${con}\n`;

          client.channels.cache.get(auth.Salon.LogMessage).send(cont);
          console.log(NewXP);
        }
      }
    }
  }

  //  Add SALON TO LIST FIL DISCUSSION
  if (
    petitMessage == prefixNewFil &&
    (message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff))
  ) {
    console.log("Debut boucle newfil");
    const channelID = message.channel.id;
    const tailleTableau2 = guildQuete.FilDiscussion.length;
    var testFilHere = 0;
    for (i = 0; i < tailleTableau2; i++) {
      if (channelID == guildQuete.FilDiscussion[i]) {
        testFilHere = testFilHere + 1;
      }
    }
    console.log("Il y a" + testFilHere + "nouveau fil de discussion");
    if (testFilHere == 0) {
      console.log("Condition Salon nouveau dans la liste");
      await salonQuete.findOneAndUpdate(
        { _id: auth.idDatabase.questId },
        { $push: { FilDiscussion: channelID } }
      );
      let guildQuete = await salonQuete.findOne({
        _id: auth.idDatabase.questId,
      });

      const tailleTableau = guildQuete.FilDiscussion.length;
      console.log(tailleTableau);

      let exampleEmbed = new EmbedBuilder()
        .setTitle(`Liste des fils de discussion  actifs`)
        .setColor(0x18e1ee);
      for (i = 0; i < guildQuete.FilDiscussion.length; i++) {
        const channelIds = guildQuete.FilDiscussion[i];
        const ChannelNameId = client.channels.cache.get(channelIds);
        exampleEmbed.addFields({
          name: "Salon:",
          value: `${ChannelNameId},`,
          inline: true,
        });
      }
      client.channels.cache
        .get(auth.Salon.SalonBotAdmin)
        .send({ embeds: [exampleEmbed] });
    } else {
      console.log("Condition Salon deja dans la liste");
      client.channels.cache
        .get(channelID)
        .send("Ce salon est déjà dans la liste des salons actifs");
    }
  } else if (
    petitMessage == prefixNewFil &&
    !(
      message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff)
    )
  ) {
    console.log("Pas autorisation commande newfil");
    const newMessage = `Tu n'as pas les autorisations pour faire ça`;
    message.channel.send(newMessage);
  }

  //  SUPPRIMER SALON TO LIST FIL DISCUSSION
  if (
    petitMessage == prefixSupprFil &&
    (message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff))
  ) {
    var salonFind = 0;

    const channelID = message.channel.id;
    for (i = 0; i < tailleTableau2; i++) {
      if (channelID == guildQuete.FilDiscussion[i]) {
        console.log("boucle le salon peut etre supprime");
        salonFind = salonFind + 1;
        await salonQuete.updateMany(
          { _id: auth.idDatabase.questId },
          { $pull: { FilDiscussion: { $in: [channelID] } } }
        );
        let guildQuete = await salonQuete.findOne({
          _id: auth.idDatabase.questId,
        });
        const tailleTableau = guildQuete.FilDiscussion.length;
        console.log(tailleTableau);

        let exampleEmbed = new EmbedBuilder()
          .setTitle(`Liste des fils de discussion  actifs`)
          .setColor(0x18e1ee);
        for (i = 0; i < guildQuete.FilDiscussion.length; i++) {
          const channelIds = guildQuete.FilDiscussion[i];
          const ChannelNameId = client.channels.cache.get(channelIds);
          exampleEmbed.addFields({
            name: "Salon:",
            value: `${ChannelNameId},`,
            inline: true,
          });
        }
        client.channels.cache
          .get(auth.Salon.SalonBotAdmin)
          .send({ embeds: [exampleEmbed] });
        client.channels.cache
          .get(channelID)
          .send("Ce salon a été supprimé de la liste des salons actifs");
      }
    }
    console.log(
      "Le salon est-il dans la liste ( 0 non - 1 oui) ? :  " + salonFind
    );
    if (salonFind == 0) {
      console.log("boucle le salon est pas deja actif");
      client.channels.cache
        .get(channelID)
        .send(
          "Ce salon n'est pas dans la liste des salons actifs. Il ne peut pas etre supprimé"
        );
    }
  } else if (
    petitMessage == prefixSupprFil &&
    !(
      message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff)
    )
  ) {
    console.log("Pas autorisation commande supprfil");
    const newMessage = `Tu n'as pas les autorisations pour faire ça`;
    message.channel.send(newMessage);
  }

  // LISTE DES FILS ACTIFS prefixListActif
  if (
    petitMessage == prefixListActif &&
    (message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff))
  ) {
    let guildQuete = await salonQuete.findOne({
      _id: auth.idDatabase.questId,
    });
    const tailleTableau = guildQuete.FilDiscussion.length;
    console.log(tailleTableau);

    let exampleEmbed = new EmbedBuilder()
      .setTitle(`Liste des fils de discussion  actifs`)
      .setColor(0x18e1ee);
    for (i = 0; i < guildQuete.FilDiscussion.length; i++) {
      const channelIds = guildQuete.FilDiscussion[i];
      const ChannelNameId = client.channels.cache.get(channelIds);
      exampleEmbed.addFields({
        name: "Salon:",
        value: `${ChannelNameId},`,
        inline: true,
      });
    }
    client.channels.cache
      .get(auth.Salon.SalonBotAdmin)
      .send({ embeds: [exampleEmbed] });
  } else if (
    petitMessage == prefixListActif &&
    !(
      message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff)
    )
  ) {
    console.log("Pas autorisation commande supprfil");
    const newMessage = `Tu n'as pas les autorisations pour faire ça`;
    message.channel.send(newMessage);
  }

  //  Add SALON TO LIST CATEGORIE
  if (
    petitMessage == prefixNewCategory &&
    (message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff))
  ) {
    const channelID = message.channel.parent.id;
    await salonQuete.findOneAndUpdate(
      { _id: auth.idDatabase.questId },
      { $push: { AllCategorie: channelID } }
    );
    let guildQuete = await salonQuete.findOne({ _id: auth.idDatabase.questId });

    const tailleTableau = guildQuete.AllCategorie.length;
    console.log(tailleTableau);

    let exampleEmbed = new EmbedBuilder()
      .setTitle(`Liste des catégories actives`)
      .setColor(0x18e1ee);
    for (i = 0; i < guildQuete.AllCategorie.length; i++) {
      const channelIds = guildQuete.AllCategorie[i];
      const ChannelNameId = client.channels.cache.get(channelIds);
      exampleEmbed.addFields({
        name: "Catégories:",
        value: `${ChannelNameId},`,
        inline: true,
      });
    }
    client.channels.cache
      .get(auth.Salon.SalonBotAdmin)
      .send({ embeds: [exampleEmbed] });
  } else if (
    petitMessage == prefixNewCategory &&
    !(
      message.author.id == auth.staff.emi ||
      message.author.id == auth.staff.leena ||
      message.member.roles.cache.has(auth.RoleRP.RoleStaff)
    )
  ) {
    const newMessage = `Tu n'as pas les autorisations pour faire ça`;
    message.channel.send(newMessage);
  }

  // retrouvez les PV Max
  if (
    petitMessage == prefixSoin &&
    (message.member.roles.cache.has(auth.RoleRP.RolePlay) ||
      (message.member.roles.cache.has(auth.RoleRP.RoleStaff) &&
        (message.channel.id == auth.Salon.InfirmerieBSS ||
          message.channel.id == auth.Salon.InfirmerieOmashu ||
          message.channel.id == auth.Salon.Jet)))
  ) {
    var xPfiche = await FichePerso.findOne({ _id: message.author.id });
    var PVMaxValue = math.round(15 + 0.2 * xPfiche.Competence.Constitution);
    await FichePerso.findOneAndUpdate(
      { _id: message.author.id },
      { "Identite.PV": PVMaxValue, time: Date.now() }
    );
    var fichePer = await FichePerso.findOne({ _id: message.author.id });
    if (fichePer.Identite.PV == PVMaxValue) {
      const newMessage = `Tu as retrouvé ton max de PV`;
      message.channel.send(newMessage);
    } else {
      const newMessage = `Tu n'as pas été soigné(e), demande de l'aide a Karma`;
      message.channel.send(newMessage);
    }
  }
});

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

function Rand(valeur) {
  return Math.floor(Math.random() * valeur + 1);
}

function createJobList() {
  const JobList = new ListeMetier({
    _id: "15257987",
    Souverain: 500,
    Princesse: 350,
    Pretresse: 200,
    AgentSecret: 500,
    Probender: 200,
    Soldat: 300,
    Commercant: 300,
    Ministre: 400,
    Mafieux: 200,
    Journaliste: 200,
    Artiste: 200,
    Moine: 200,
    CouteauSuisse: 150,
    Jobless: 0,
    time: Date(),
  });
  JobList.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createWeather() {
  const Meteo = new Weather({
    _id: "152579868",
    PoleNord: "🌨️",
    TempleAus: "🌨️",
    NationFeu: "🌨️",
    TempleOcc: "🌨️",
    BaSingSe: "🌨️",
    Omashu: "🌨️",
    Marais: "🌨️",
    Desert: "🌨️",
    TempleOr: "🌨️",
    IleKyoshi: "🌨️",
    TempleBor: "🌨️",
    PoleSud: "🌨️",
    Nuit: "🌑",
    CounterLune: 0,
    time: Date(),
  });
  Meteo.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createBoutique() {
  const Boutique = new BoutiqueMaitrise({
    _id: "15257986",
    Maitrise: {
      Maitrise2: "2 000 XP",
      Maitrise3: "3 000 XP",
      Maitrise4: "4 000 XP",
      Maitrise5: "5 000 XP",
      Maitrise6: "6 000 XP",
      Maitrise7: "7 000 XP",
      Maitrise8: "8 000 XP",
      Maitrise9: "9 000 XP",
      Maitrise10: "10 000 XP",
      Maitrise11: "11 000 XP",
      Maitrise12: "12 000 XP",
      Maitrise13: "13 000 XP",
      Maitrise14: "14 000 XP",
      Maitrise15: "15 000 XP",
      Maitrise16: "16 000 XP",
      Maitrise17: "17 000 XP",
      Maitrise18: "18 000 XP",
      Maitrise19: "19 000 XP",
      Maitrise20: "20 000 XP",
    },
    Arme: [
      "Bonus +3 à tous tes jets de force (500 utilisations) : 5000 XP",
      "Bonus +3 à tous tes jets de dextérité (500 utilisations) : 5000 XP",
    ],
    Potion: [
      "Bonus +5 à tous les jets de la cible pendant 5 tours : 1000 XP",
      "Malus -5 à tous les jets de la cible pendant 5 tours : 1000 XP",
    ],
    Armure: [
      "Bonus +3 à tous tes jets de constitution (500 utilisations) : 5000 XP",
    ],
    time: Date(),
  });
  Boutique.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createSalonWeather() {
  const salonWeather = new salonTemps({
    _id: "00001",
    Salon: [
      "1006874253414641744",
      "798679722577100861",
      "798679881323774032",
      "798679991717068821",
      "639052023693836299",
      "639208167351255078",
      "798680046965227600",
      "798680074886316032",
      "798680109330464838",
      "798680144998301747",
      "798680177987026964",
      "1006934477186019339",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    time: Date(),
  });
  salonWeather
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createSalonQuest() {
  const salonQuest = new salonQuete({
    _id: "00002",
    Barreau: ["852592485108678686"],
    Bateau: [
      "800685820629352448",
      "799951811556802580",
      "799951829453635586",
      "800685473215021086",
      "639045866950361091",
      "842008055926227004",
      "639045990497779732",
      "801510289857052712",
      "799951886995685377",
      "799958020745855016",
      "853309291909742632",
      "853309291909742632",
      "846750128832380938",
    ],
    Parchemin: [
      "858980354026110976",
      "800685254947110912",
      "799956692619362324",
      "800684022530441226",
      "798859610122485791",
      "800682251267997697",
      "800679834275151894",
    ],
    Frotter: [
      "799958182549913600",
      "846488707741909012",
      "859002036557316117",
      "858979943941799936",
      "800685204531838988",
      "799956666191315014",
      "800683968734560256",
      "798859562332717076",
    ],
    Lit: [
      "859001789453697044",
      "800682007423746068",
      "842228043887017994",
      "639046073511575573",
      "639046105312788491",
      "799950975791529994",
      "800678848348815371",
      "800680015431204885",
      "846488707741909012",
      "859002036557316117",
    ],
    Pinte: ["799958182549913600", "846488707741909012", "859002036557316117"],
    Statue: [
      "997498871133515897",
      "799951099511046144",
      "842228286373363712",
      "864505030036160522",
      "800685334916628480",
      "799957146795114506",
      "800684417664155670",
      "844653244873572388",
      "799957335694770206",
      "799952008957394954",
    ],
    Attente: [
      "799951016782987294",
      "800679213388267520",
      "800681958745178132",
      "846420437520220172",
      "799951886995685377",
      "799958020745855016",
      "853309291909742632",
      "846750128832380938",
      "799951056180215838",
      "842017587751944192",
    ],
    Branche: [
      "842008003280502794",
      "997033238491058207",
      "846692919888314378",
      "800686032408412180",
      "842112799349407746",
    ],
    Bain: [
      "843904678320013342",
      "800680443355201546",
      "799951811556802580",
      "799951829453635586",
      "800685473215021086",
      "1002108417852309554",
      "1002108499196657814",
      "800682407824064533",
      "842008055926227004",
      "639045866950361091",
    ],
    AllCategorie: [
      "639042028205899776",
      "797909735739228230",
      "797909381290131527",
      "797909436223717378",
      "797909857650606140",
      "797909487683895296",
      "797910003439632405",
      "797910051645030472",
      "797911987777830920",
      "797912048255107123",
      "797912306788859904",
      "797910091042783292",
      "797912434936774738",
      "801509718207365150",
      "858813078203269121",
      "919300861333733466",
    ],
    Escargot: [
      "801439342173224980",
      "799951099511046144",
      "800679653060640778",
      "864873965847314442",
    ],
    Pardon: [
      "997498871133515897",
      "843902209438515243",
      "842228286373363712",
      "864505030036160522",
    ],
    Putois: [
      "801439342173224980",
      "799951099511046144",
      "800679653060640778",
      "864873965847314442",
      "800684864827424778",
      "997033170509779094",
      "799951937327726612",
      "800679037278093322",
      "800679653060640778",
      "",
    ],
    AchatRp: ["799951016782987294", "800679213388267520", "800681958745178132"],
    FilDiscussion: ["1157702938580488313"],
    time: Date(),
  });
  salonQuest
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createSalonBonus() {
  const salonBonus = new Bonus({
    _id: "00003",
    Terre: [
      "842048445178576946",
      "800680315507965963",
      "859035012175364106",
      "854299854996897792",
      "800681144298766357",
      "798859382678224948",
      "859023983209873418",
      "800683283411238912",
    ],
    Air: [],
    Eau: [],
    Feu: [],
    time: Date(),
  });
  salonBonus
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createFichePerso(message, Niveau) {
  const Identity = new FichePerso({
    _id: message.author.id,
    Username: message.author.username,
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
  });

  Identity.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createBonusMeteoRoll() {
  const meteoSalonBonus = new salonBonusMeteo({
    _id: "00004",
    EauBonus1: ["🌧️", "🌨️"],
    EauBonus2: ["🌫️"],
    EauBonusNuit: ["🌕", "🌔", "🌖", "🌑", "🌒", "🌘"],
    FeuBonus1: ["☀️"],
    time: Date(),
  });
  meteoSalonBonus
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createFicheBagPerso() {
  const fichepersobags = new ficheSacPerso({
    _id: message.author.id,
    Competence: [0, 0, 0, 0, 0, 0, 0, 0],
    Sac: [String],
    Tour: [0, 0, 0, 0, 0],
    ValeurBonus: [0],
    NbrePotion: 0,
    NbrePoison: 0,
    time: Date(),
  });
  fichepersobags
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createFicheObjetRP() {
  const ficheobject = new ficheObjetRP({
    _id: "00005",
    Dague: [1, 0, 0, 0, 0, 0, 0, 0],
    Armure: [0, 0, 0, 0, 0, 0, 0, 0],
    Potion: [0],
    time: Date(),
  });
  ficheobject
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createFicheAnimaux() {
  const FicheAnimaux = new ficheAnimauxRP({
    _id: "Animaux",
    Username: "Nom",
    Competence: [0, 0, 0, 0, 0, 0, 0, 0],
    Avantage: ["Avantage"],
    Inconvenient: ["Inconvenient"],
    Actions: ["Action"],
    Histoire: "Story",
    PointDeVie: 0,
    Image: "Name",
    time: Date(),
  });
  FicheAnimaux.save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

function createFicheCombat(
  Numero,
  Target0,
  Target1,
  Target2,
  Target3,
  Target4
) {
  const IdentityCombat = new ficheCombat({
    _id: 1,
    TourGlobal: [0],
    IdJoueur: [Target0, Target1, Target2, Target3, Target4],
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
