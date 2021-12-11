const config = require('./config.json');
const prefix = config.prefix;
const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: 32767 });
const voiceDiscord = require('@discordjs/voice');
const youtubesearchapi = require('youtube-search-api');
const ytdl = require('ytdl-core');
const player = voiceDiscord.createAudioPlayer();
const { disconnect, send } = require('process');

// command //

function isURL(url) {
  return /^[a-z]+:\/\//i.test(url);
}

let getVideoID = async function(keyword) {
  let all_results = await youtubesearchapi.GetListByKeyword(keyword,[true],[1])
  let id = all_results.items[0].id;
  return id
}

let music_queue = [];
let i = 0;

async function play(client, mess, args) {
  let url = args[1, 2, 3, 4, 5, 6, 7, 8, 9];
  url = args.splice(0, 1);
  url = args.join('');

  if(!url) return mess.channel.send('URL not found');

  if (!isURL(url)) {
    let id = await getVideoID(url)
    url = 'https://www.youtube.com/watch?v=' + id;
  }

  music_queue.push(url);

  if (music_queue.length == 1) {
    playStream(client, mess);
  }
}


  function playStream(client, mess) {
    if (i >= music_queue.length) {
      music_queue.splice(0, music_queue.length);
      i = 0;
      return mess.channel.send('Music queue is empty');
    }
    const stream = ytdl(music_queue[i], { filter: 'audioonly' });
    const channel = mess.member.voice.channel;
    if (!channel) return mess.channel.send('You must be in the voice channel') & music_queue.splice(0, music_queue.length);
    mess.channel.send("Now playing " + music_queue[i]);
    const resource = voiceDiscord.createAudioResource(stream);
    const connection = voiceDiscord.joinVoiceChannel({
      channelId: channel.id,
      guildId: mess.guild.id,
      adapterCreator: mess.guild.voiceAdapterCreator,
  });
  player.play(resource);
  connection.subscribe(player);

  player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
    i++;
    playStream(client, mess);
  });
}





function skip(client, mess) {
  i++;
  if (i >= music_queue.length) return mess.channel.send('No songs in the queue');
  playStream(client, mess);
}




function pause(client, mess) {
  player.pause();
}




function unpause(client, mess) {
  player.unpause();
}
















// command list //

let comms_list = [
{
  name: "p",
  out: play,
  about: "play music",
},
{
  name: "help",
  out: command_list,
  about: "show command list"
},
{
  name: "s",
  out: skip,
  about: "skip song"
},
{
  name: "pause",
  out: pause,
  about: "paused song"
},
{
  name: "unpause",
  out: unpause,
  about: "unpaused song"
},
];

function command_list(client, mess, args){
  for (let i = 0; i < comms_list.length; i++) {
    if (i == 0) {
      mess.channel.send('Enter !' + comms_list[i].name + ' and songs URL to ' + comms_list[i].about);
      continue;
    }
    mess.channel.send('Enter !' + comms_list[i].name + ' to '  + comms_list[i].about);
  }
}

module.exports.comms = comms_list;