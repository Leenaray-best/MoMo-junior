const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "gems",
  aliases: ["gem", "s", "shard"],
  description:
    "Get a list of routes where you can obtain a particular type of gem",
  args: [
    {
      name: "type",
      type: "STRING",
      description: "Gem type",
      required: true,
      choices: [
        {
          name: "Maitrise",
          value: "maitrise",
        },
        {
          name: "Force",
          value: "force",
        },
        {
          name: "Water",
          value: "Water",
        },
        {
          name: "Electric",
          value: "Electric",
        },
        {
          name: "Grass",
          value: "Grass",
        },
        {
          name: "Ice",
          value: "Ice",
        },
        {
          name: "Fighting",
          value: "Fighting",
        },
        {
          name: "Poison",
          value: "Poison",
        },
        {
          name: "Ground",
          value: "Ground",
        },
        {
          name: "Flying",
          value: "Flying",
        },
        {
          name: "Psychic",
          value: "Psychic",
        },
        {
          name: "Bug",
          value: "Bug",
        },
        {
          name: "Rock",
          value: "Rock",
        },
        {
          name: "Ghost",
          value: "Ghost",
        },
        {
          name: "Dragon",
          value: "Dragon",
        },
        {
          name: "Dark",
          value: "Dark",
        },
        {
          name: "Steel",
          value: "Steel",
        },
        {
          name: "Fairy",
          value: "Fairy",
        },
      ],
    },
    {
      name: "order",
      type: "STRING",
      description: "Order by",
      required: false,
      choices: [
        {
          name: "Chance",
          value: "chance",
        },
        {
          name: "Route",
          value: "route",
        },
      ],
    },
  ],
  guildOnly: true,
  cooldown: 3,
  botperms: ["SEND_MESSAGES", "EMBED_LINKS"],
  userperms: [],
  channels: ["bot-commands"],
  execute: async (interaction) => {
    const [type, order] = [
      interaction.options.get("type").value,
      interaction.options.get("order")?.value || "chance",
    ];

    const sortFunc =
      order == "chance" ? (a, b) => b[1] - a[1] : (a, b) => a[0] - b[0];

    const embed = new MessageEmbed()
      .setTitle(`${type} Gem Routes`)
      .setColor("#3498db");
  },
};
