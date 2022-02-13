const voiceDiscord = require('@discordjs/voice');
const youtubeSearchAPI = require('youtube-search-api');
const ytdl = require('ytdl-core');
const player = voiceDiscord.createAudioPlayer();
const { disconnect, send, connected } = require('process');
const { get } = require('http');
const music = require('./music');
const { captureRejectionSymbol } = require('events');
const { crypto_box_NONCEBYTES } = require('libsodium-wrappers');

let songQueue = [];
let songIndex = 0;

async function play(client, mess, args) {
    let inputData = args;
    inputData.splice(0,1);
    if (inputData == '') return mess.channel.send('URL или название трека не найдены');
    let videoLink = (isURL(inputData)) ? inputData : await getLink(inputData);
    songQueue.push(videoLink);

    if (songQueue.length == 1) return await musicStream(client, mess)
    mess.channel.send('Песня была добавлена в очередь');
}

async function musicStream(client, mess) {
    const stream = ytdl(songQueue[songIndex], { filter: 'audioonly' });
    const channel = mess.member.voice.channel;

    if (!channel) return mess.channel.send('Вы должны находится в голосовом канале для прослушивания музыки') & songQueue.splice(0, songQueue.length);

    const resource = voiceDiscord.createAudioResource(stream);
    const connection = voiceDiscord.joinVoiceChannel({
      channelId: channel.id,
      guildId: mess.guild.id,
      adapterCreator: mess.guild.voiceAdapterCreator,
    });

    try {
        player.play(resource);
        connection.subscribe(player);
    } catch (error) {
        mess.channel.send('Что-то пошло не так...')
    }
    player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
        if (!songQueue[songIndex+1]) {
            mess.channel.send('Это была последняя песня в очереди');
        } else{
            songIndex++;
            return musicStream(client, mess);
        }
  });
}



function isURL(url) {
    return /^[a-z]+:\/\//i.test(url);
}

async function getLink(keyword) {
    let all_results = await youtubeSearchAPI.GetListByKeyword(keyword,[true],[1])
    let id = all_results.items[0].id;
    return 'https://www.youtube.com/watch?v=' + id;
}

function skip(client, mess) {
    songIndex++;
    if (!songQueue[songIndex]) return mess.channel.send('Треков в очереди больше нет');
    musicStream(client, mess);
}
  
function pause(client, mess) {
    player.pause();
}
  
function unpause(client, mess) {
    player.unpause();
}





module.exports = [
    {
        name: "p",
        out: play,
        about: "включить музыку",
      },
      {
        name: "skip",
        out: skip,
        about: "пропустить трек"
      },
      {
        name: "pause",
        out: pause,
        about: "поставить трек на паузу"
      },
      {
        name: "unpause",
        out: unpause,
        about: "снять трек с паузы"
      },
]