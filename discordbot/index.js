'use strict';

const helper = require('./helper');
const patrikok = require('./patrikok');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Napipatrik bot is ready!');
});

client.on('message', message => {
  const parts = message.content.split(' ');

  if (parts[0] !== 'napipatrik') {
    return;
  }

  if (parts.length === 1) {
    console.log('Napituti lekérdezés');
    helper.fetchContent('napipatrik', (napituti, error) => {
      if (error) {
        message.channel
          .send('Ismeretlen hiba. A bot erdészt kíván!')
          .catch(console.error);
      } else {
        message.channel
          .send(napituti)
          .catch(console.error);
      }
    });
    return;
  }

  if (['kép', 'kep', 'napikép', 'napikep', 'pic', 'picture'].includes(parts[1])) {
    console.log('Napikép lekérdezés');
    message.channel
      .send({
        files: [{
          attachment: 'https://napipatrik.hu/napipatrik.jpg',
          name: 'napipatrik.jpg'
        }]
      })
      .catch(console.error);
    return;
  }

  if (['random', 'véletelen', 'veletlen'].includes(parts[1])) {
    console.log('Random lekérdezés');
    let tuti = patrikok.get(Math.floor(Math.random() * patrikok.count()));
    message.channel
        .send(tuti)
        .catch(console.error);
    return;
  }

  if (['keres', 'keress', 'kereső', 'kereso', 'find'].includes(parts[1])) {
    const keywords = Object.assign([], parts.splice(2));

    if (keywords.length > 20) {
      message.channel
          .send('Ezt én nem csinálom!')
          .catch(console.error);
      return;
    }
    console.log('Tuti keresés alapján: ' + keywords.join(' '));

    let tuti = patrikok.find(keywords);
    if (tuti) {
      message.channel
          .send(tuti)
          .catch(console.error);
    } else {
      message.channel
          .send('Ilyen nincs bazmeg!')
          .catch(console.error);
    }
    return;
  }

  if (Number.isInteger(+parts[1])) {
    console.log('Tuti ID alapján: ' + parts[1]);

    let tuti = patrikok.get(parts[1]);
    if (tuti) {
      message.channel
        .send(tuti)
        .catch(console.error);
    } else {
      message.channel
        .send('Ilyen nincs bazmeg!')
        .catch(console.error);
    }
    return;
  }

  message.channel
    .send('Hallod, nem értem. Ezt mondjad:\n`napipatrik` -> mai tuti\n`napipatrik kép` -> a mai kép beszúrása\n`napipatrik random` -> véletlen tuti\n`napipatrik <id>` -> adott tuti\n`napipatrik keress <kulcsszavak>` -> beszúr egy véletlen idézetet ami tartalmazza a kulcsszavakat')
    .catch(console.error);
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN environment variable!');
  process.exit(1);
}
client.login(process.env.DISCORD_BOT_TOKEN);
