const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: 32767 });
const { disconnect, send } = require('process');
const comms = require("./comms.js");
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;

client.on("ready", function() {
  console.log(client.user.username + " запустился!");
});

client.on('messageCreate', (msg) => { // Реагирование на сообщения
  if (msg.author.username != client.user.username && msg.author.discriminator != client.user.discriminator) {
    let comm = msg.content.trim() + " ";
    let comm_name = comm.slice(0, comm.indexOf(" "));
    let messArr = comm.split(" ");
    for (comm_count in comms.comms) {
      let comm2 = prefix + comms.comms[comm_count].name;
      if (comm2 == comm_name) {
        comms.comms[comm_count].out(client, msg, messArr);
      }
    }
  }
});

client.login(token); // Авторизация бота