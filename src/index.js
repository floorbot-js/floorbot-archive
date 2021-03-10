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
        console.log('Connected to database', process.env.DB_NAME);
        return conn.release();
    }).then(() => {
        const messageCreate = require('./archivers/messageCreate');
        const messageUpdate = require('./archivers/messageUpdate');
        const messageDelete = require('./archivers/messageDelete');
        const messageReaction = require('./archivers/messageReaction');
        const presenceUpdate = require('./archivers/presenceUpdate');
        const voiceStateUpdate = require('./archivers/voiceStateUpdate');

        const totals = {};
        client.on('raw', packet => {
            // if (packet.t) {
            //     if (Object.keys(totals).length) {
            //         for (let i = 0; i < Object.keys(totals).length + 3; i++) {
            //             process.stdout.moveCursor(0, -1) // up one line
            //             process.stdout.clearLine(1) // from cursor to end
            //         }
            //     }
            //
            //     if (!totals[packet.t]) totals[packet.t] = 0;
            //     totals[packet.t]++;
            //
            //     console.log();
            //     console.log('----------Totals----------');
            //     Object.keys(totals).forEach(key => {
            //         if (key === packet.t) console.log(key, totals[key], '(latest)')
            //         else console.log(key, totals[key])
            //     })
            //     console.log('--------------------------');
            // }

            // if (packet.t) console.log('[', new Date(), ']', 'Event', counter++, packet.t);
            switch (packet.t) {

                // case 'MESSAGE_CREATE':
                //     return messageCreate(client, packet, pool);
                // case 'MESSAGE_UPDATE':
                //     return messageUpdate(client, packet, pool);
                // case 'MESSAGE_DELETE':
                // case 'MESSAGE_DELETE_BULK':
                //     return messageDelete(client, packet, pool);
                //
                // case 'MESSAGE_REACTION_ADD':
                //     return messageReaction.add(client, packet, pool);
                // case 'MESSAGE_REACTION_REMOVE':
                //     return messageReaction.remove(client, packet, pool);
                // case 'MESSAGE_REACTION_REMOVE_ALL':
                //     return messageReaction.removeAll(client, packet, pool);
                // case 'MESSAGE_REACTION_REMOVE_EMOJI':
                //     return messageReaction.removeEmoji(client, packet, pool);
                //
                // case 'PRESENCE_UPDATE':
                //     return presenceUpdate(client, packet, pool);

                case 'VOICE_STATE_UPDATE':
                    return voiceStateUpdate(client, packet, pool);

                case 'CHANNEL_PINS_UPDATE': // This causes a message update too
                default:
                    // return console.log('packet', packet.t);
                    return null;
            }
        });
    }).catch(err => {
        console.log("Failed to connect to database", process.env.DB_NAME, err);
    })
}
