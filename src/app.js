require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.once('ready', () => require('./index')(client));

client.once('ready', () => console.log(`Logged in as \x1b[35m${client.user.tag}\x1b[0m!`));
client.login(process.env.DiscordToken);
