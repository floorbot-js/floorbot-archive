module.exports = (client) => {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 25,
        supportBigInt: true
    });
    pool.getConnection().then(conn => {
        console.log(`Connected to database \x1b[35m${process.env.DB_NAME}\x1b[0m!`);
        return conn.release();
    }).catch(err => {
        console.log(`Failed to connect to database \x1b[35m${process.env.DB_NAME}\x1b[0m!`, err);
    });

    const messageCreate = require('./archivers/messageCreate');
    const messageUpdate = require('./archivers/messageUpdate');
    const messageDelete = require('./archivers/messageDelete');
    const messageReaction = require('./archivers/messageReaction');
    const presenceUpdate = require('./archivers/presenceUpdate');
    const voiceStateUpdate = require('./archivers/voiceStateUpdate');
    const typingStart = require('./archivers/typingStart');
    const guildMemberUpdate = require('./archivers/guildMemberUpdate');

    const tracked = [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'MESSAGE_REACTION_REMOVE_EMOJI',
        'PRESENCE_UPDATE',
        'VOICE_STATE_UPDATE',
        'TYPING_START',
        'GUILD_MEMBER_UPDATE'
    ];
    const totals = {};
    client.on('raw', packet => {
        return new Promise((resolve, reject) => {
            if (packet.t) {
                totals[packet.t] = totals[packet.t] ? ++totals[packet.t] : 1;
                console.log('\x1b[91m', '\n-------------- Totals --------------', '\x1b[0m');
                Object.keys(totals).forEach(key => {
                    const type = tracked.includes(key) ? '\x1b[32m[tracked]\x1b[0m' : '\x1b[31m[ignored]\x1b[0m'
                    if (key === packet.t) console.log(type, key, totals[key], '\x1b[36m(latest)\x1b[0m')
                    else console.log(type, key, totals[key])
                })
            }

            switch (packet.t) {
                case 'MESSAGE_CREATE':
                    return resolve(messageCreate(client, packet, pool));
                case 'MESSAGE_UPDATE':
                    return resolve(messageUpdate(client, packet, pool));
                case 'MESSAGE_DELETE':
                case 'MESSAGE_DELETE_BULK':
                    return resolve(messageDelete(client, packet, pool));
                case 'MESSAGE_REACTION_ADD':
                case 'MESSAGE_REACTION_REMOVE':
                case 'MESSAGE_REACTION_REMOVE_ALL':
                case 'MESSAGE_REACTION_REMOVE_EMOJI':
                    return resolve(messageReaction(client, packet, pool));
                case 'PRESENCE_UPDATE':
                    return resolve(presenceUpdate(client, packet, pool));
                case 'VOICE_STATE_UPDATE':
                    return resolve(voiceStateUpdate(client, packet, pool));
                case 'TYPING_START':
                    return resolve(typingStart(client, packet, pool));
                case 'GUILD_MEMBER_UPDATE':
                    return resolve(guildMemberUpdate(client, packet, pool));

                case 'CHANNEL_PINS_UPDATE': // This causes a message update too
                default:
                    // return console.log('packet', packet.t);
                    return resolve();
            }
        }).catch(err => {
            console.log('Database Error', err);
        });
    });
}
