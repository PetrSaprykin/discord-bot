const axios = require('axios');

async function bitcoin(client, mess) {
    const list = await axios.get('https://blockchain.info/ticker');
    let course = Math.round(list.data.USD.last)
    mess.channel.send(`Курс биткоина сейчас равен ${course} долларам`);
}
module.exports = {
    name: "btc",
    out: bitcoin,
    about: "узнать курс биткоина"
}