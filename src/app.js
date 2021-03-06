require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

require('./index')(client);

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));
client.login(process.env.DiscordToken);
