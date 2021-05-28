require('dotenv').config();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    supportBigInt: true
});

const { Client, Intents } = require('discord.js-commands')(require('discord.js'));
const ArchiveClient = require('./index')(Client, pool);

const client = new ArchiveClient({
    token: process.env.DISCORD_TOKEN,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    intents: Intents.ALL
});

client.on('log', (string, object) => { console.log(string) })
client.on('ready', () => client.emit('log', `[SETUP] Logged in as <${client.user.tag}>`));
pool.query().then(res => client.emit('log', `[SETUP] Connected to database <${process.env.DB_NAME}>`))
    .catch(error => client.emit('log', `[SETUP] Failed to connect to database <${process.env.DB_NAME}>`, error))
    .then(() => client.login())
