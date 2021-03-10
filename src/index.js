module.exports = (client) => {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
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

    const totals = {};
    client.on('raw', packet => {
        return new Promise((resolve, reject) => {
            if (packet.t) {
                totals[packet.t] = totals[packet.t] ? ++totals[packet.t] : 1;
                console.log('\x1b[31m', '\n--------- Totals ---------', '\x1b[0m');
                Object.keys(totals).forEach(key => {
                    if (key === packet.t) console.log(key, totals[key], '\x1b[36m(latest)\x1b[0m')
                    else console.log(key, totals[key])
                })
            }

            switch (packet.t) {
                case 'MESSAGE_CREATE':
                    return messageCreate(client, packet, pool);
                case 'MESSAGE_UPDATE':
                    return messageUpdate(client, packet, pool);
                case 'MESSAGE_DELETE':
                case 'MESSAGE_DELETE_BULK':
                    return messageDelete(client, packet, pool);
                case 'MESSAGE_REACTION_ADD':
                    return messageReaction.add(client, packet, pool);
                case 'MESSAGE_REACTION_REMOVE':
                    return messageReaction.remove(client, packet, pool);
                case 'MESSAGE_REACTION_REMOVE_ALL':
                    return messageReaction.removeAll(client, packet, pool);
                case 'MESSAGE_REACTION_REMOVE_EMOJI':
                    return messageReaction.removeEmoji(client, packet, pool);
                case 'PRESENCE_UPDATE':
                    return presenceUpdate(client, packet, pool);
                case 'VOICE_STATE_UPDATE':
                    return voiceStateUpdate(client, packet, pool);
                case 'CHANNEL_PINS_UPDATE': // This causes a message update too
                default:
                    // return console.log('packet', packet.t);
                    return null;
            }
        }).catch(err => {
            console.log(err);
            console.log('Database down...');
        });
    });
}
