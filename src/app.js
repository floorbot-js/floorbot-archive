require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.once('ready', () => require('./index')(client));

client.once('ready', () => console.log(`Logged in as ${client.user.tag}!`));
client.login(process.env.DiscordToken);
