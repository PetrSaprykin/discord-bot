const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: 32767 });
const comms = require("./comms.js");
const fs = require('fs');
let config = require('./config.json');
let token = config.token;
let prefix = config.prefix;
const ytdl = require('ytdl-core');
const { info } = require('console');
const { send } = require('process');
























client.on("ready", function() {
  console.log(client.user.username + " start!");
});

client.on('messageCreate', (msg) => {
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


client.login(token);