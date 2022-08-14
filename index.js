require("dotenv").config();
//var CronJob = require("cron").CronJob;
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const fs = require("fs");
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

const functionFolders = fs.readdirSync(`./functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

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
const token = process.env.token; //client.auth.token;
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
//const salonQuete = require("./salonQuete.js");
const Bonus = require("./salonBonus.js");
const ListeMetier = require("./job.js");
const prefixMaitrise = "roll-maitrise";
client.handleEvents();
client.handleCommands();

client
  .login(token)
  .then(() => {
    createBoutique();
    createJobList();
    createWeather();
    createSalonWeather();
    //createSalonQuest();
    createSalonBonus();
  })
  .catch((err) => console.log(err));
var auth = require("./auth.json");
//var cron = require("node-cron");

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
});

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
    Arme: {
      Couteau: "1000 XP",
    },
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

// function createSalonQuest() {
//   const salonQuest = new salonQuete({
//     _id: "00002",
//     Pinte: ["1006593631832002642", "1008075876497362985", "", "", ""],
//     time: Date(),
//   });
//   salonQuest
//     .save()
//     .then((result) => console.log(result))
//     .catch((err) => console.log(err));
// }

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
    },
    GainCompetence: 0,
    NiveauDeMaitrise: Niveau,
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
