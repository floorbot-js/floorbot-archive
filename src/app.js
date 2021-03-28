require('dotenv').config();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 50,
    supportBigInt: true
});
pool.getConnection().then(conn => {
    client.emit('log', `[SETUP] Connected to database <${process.env.DB_NAME}>`);
    return conn.release();
}).catch(err => {
    client.emit('log', `[SETUP] Failed to connect to database <${process.env.DB_NAME}>`, error);
});

const { Client, Intents, Task } = require('discord.js-commands')(require('discord.js'));
const Archivers = require('./index');
const client = new Client({
    token: process.env.DISCORD_TOKEN,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    intents: Intents.ALL,

    tasks: {
        archiveGuildMember: { class: Archivers.ArchiveGuildMember, options: { pool: pool } },
        archiveMessage: { class: Archivers.ArchiveMessage, options: { pool: pool } },
        archiveMessageDelete: { class: Archivers.ArchiveMessageDelete, options: { pool: pool } },
        archiveMessageReaction: { class: Archivers.ArchiveMessageReaction, options: { pool: pool } },
        archivePresence: { class: Archivers.ArchivePresence, options: { pool: pool } },
        archiveTyping: { class: Archivers.ArchiveTyping, options: { pool: pool } },
        archiveVoiceState: { class: Archivers.ArchiveVoiceState, options: { pool: pool } }
    }
});

client.on('ready', () => client.emit('log', `[SETUP] Logged in as <${client.user.tag}>`));
client.login(process.env.DiscordToken);
