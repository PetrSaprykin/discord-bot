//внешние модули в папке commands
const music = require('./commands/music.js');
const bitcoin = require('./commands/bitcoin.js');

// Список команд //

let comms_list = [
  {
    name: "help",
    out: command_list,
    about: "показать список команд"
  },
  bitcoin,
];

music.forEach(element => {
  comms_list.push(element)
});
// Name - название команды, на которую будет реагировать бот
// Out - название функции с командой
// About - описание команды 

// вообщем тут все команды из music попадают в comms_list

function command_list(client, mess, args){
  for (let i = 0; i < comms_list.length; i++) {
    if (i == 2) {
      mess.channel.send('Введите !' + comms_list[i].name + ' и url песни через пробел чтобы ' + comms_list[i].about);
      continue;
    }
    mess.channel.send('Введите !' + comms_list[i].name + ' чтобы '  + comms_list[i].about);
  }
}

module.exports.comms = comms_list;