'use strict';

const helper = require('./helper');
const handlers = require('./handlers');
const {SlashCommandBuilder} = require('@discordjs/builders');
const {REST, Routes, Client, Events, PermissionsBitField, Partials, GatewayIntentBits, ChannelType} = require('discord.js');
const {MessageType} = require("discord-api-types/v10");
const client = new Client({partials: [Partials.Channel], intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]});

const commands = [
  new SlashCommandBuilder()
    .setName(helper.sitename)
    .setDescription('Keress kedvenc napipatrik idézeteid között')
    .setDefaultMemberPermissions(PermissionsBitField.All)
    .addSubcommand(subcommand =>
      subcommand
        .setName('mai')
        .setDescription('Napi tuti lekérdekzése')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kép')
        .setDescription('Napi kép lekérdezése')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('random')
        .setDescription('Véletlen tuti lekérdezése')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('keress')
        .setDescription('Tuti keresése kulcsszavak alapján')
        .addStringOption(option =>
          option
            .setName('keywords')
            .setDescription('Keresőszavak')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('id')
        .setDescription('Adott tuti lekérdezése')
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('Azonosító')
            .setRequired(true)
        )
    )
].map(command => command.toJSON());


client.on(Events.ClientReady, c => {
  console.log('Registering slash commands');
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  rest.put(Routes.applicationCommands(client.application.id), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

  console.log(`${helper.sitename} bot is ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
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

client.on(Events.MessageCreate, message => {
  const parts = helper.unaccent(message.content.toLowerCase()).split(' ');

  if (message.author.bot) {
    return false;
  }

  if (parts[0] !== helper.sitename && !message.mentions.has(client.user.id, {ignoreRoles: true, ignoreRepliedUser: true, ignoreEveryone: true})) {
    if (message.channel.type === ChannelType.DM) {
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
