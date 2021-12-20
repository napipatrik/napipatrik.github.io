'use strict';

const helper = require('./helper');
const handlers = require('./handlers');
const { Client, Intents } = require('discord.js');
const client = new Client({partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});

const commandData = {
  name: helper.sitename,
  description: 'Keress kedvenc napipatrik idézeteid között',
  options: [
    {
      name: 'mai',
      type: 'SUB_COMMAND',
      description: 'Napi tuti lekérdekzése',
    },
    {
      name: 'kép',
      type: 'SUB_COMMAND',
      description: 'Napi kép lekérdezése',
    },
    {
      name: 'random',
      type: 'SUB_COMMAND',
      description: 'Véletlen tuti lekérdezése',
    },
    {
      name: 'keress',
      type: 'SUB_COMMAND',
      description: 'Tuti keresése kulcsszavak alapján',
      options: [
        {
          name: 'keywords',
          description: 'Keresőszavak',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'id',
      type: 'SUB_COMMAND',
      description: 'Adott tuti lekérdezése',
      options: [{
        name: 'id',
        description: 'Azonosító',
        type: 'INTEGER',
        required: true,
      }],
    },
  ],
};

client.on('ready', () => {
  console.log('Registering slash commands');
  client.application.commands.create(commandData);

  console.log(helper.sitename + ' bot is ready!');
});

client.on('interactionCreate', interaction => {
  if (!interaction.isCommand()) {
    return;
  }

  if (interaction.commandName === helper.sitename) {
    let what = helper.unaccent(interaction.options.getSubcommand().toLowerCase()), args = [];

    if (['id'].includes(what)) {
      args = [interaction.options.getInteger('id')];
    }
    if (['keress'].includes(what)) {
      args = helper.unaccent(interaction.options.getString('keywords').toLowerCase()).split(' ');
    }

    if (what === 'kep') {
      what = 'kep-embed';
    }

    handlers.getTuti(what, ...args)
      .then(tuti => {
        if (tuti === 'Ilyen nincs bazmeg!') {
          return {
            content: tuti,
            ephemeral: true,
          };
        }

        return tuti;
      })
      .then(tuti => {
        interaction.reply(tuti);
      })
      .catch(console.error);
  }
});

client.on('messageCreate', message => {
  const parts = helper.unaccent(message.content.toLowerCase()).split(' ');

  if (message.author.bot) {
    return false;
  }

  if (parts[0] !== helper.sitename && !message.mentions.has(client.user.id)) {
    if (message.channel.type === 'DM') {
      parts.unshift('napipatrik');
    } else {
      return;
    }
  }

  let what, args = [];
  if (parts.length === 1) {
    what = 'napi';
  } else if (!isNaN(parts[1].replace('#', ''))) {
    what = 'id';
    args = [parts[1].replace('#', '')];
  } else {
    what = parts[1];
    args = parts.splice(2);
  }

  handlers.getTuti(what, ...args)
    .catch(() => 'Hallod, nem értem. Ezt mondjad:\n`' + helper.sitename + '` -> mai tuti\n`napipatrik kép` -> a mai kép beszúrása\n`napipatrik random` -> véletlen tuti\n`napipatrik <id>` -> adott tuti\n`napipatrik keress <kulcsszavak>` -> beszúr egy véletlen idézetet ami tartalmazza a kulcsszavakat')
    .then(tuti => {
      return message.channel
        .send(tuti);
    })
    .catch(console.error);
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN environment variable!');
  process.exit(1);
}
client.login(process.env.DISCORD_BOT_TOKEN);
