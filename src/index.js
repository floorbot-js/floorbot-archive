module.exports = (client) => {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10
    });
    pool.getConnection().catch(err => {
        console.log("Failed to connect to database", process.env.DB_NAME, err);
    }).then(conn => {
        console.log('Connected to database', process.env.DB_NAME);
        return conn.release();
    })

    const messageCreate = require('./archivers/messageCreate');
    const messageUpdate = require('./archivers/messageUpdate');
    const messageDelete = require('./archivers/messageDelete');
    const messageReaction = require('./archivers/messageReaction');

    client.on('raw', packet => {
        if (packet.t) console.log('Event', packet.t);
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

            case 'CHANNEL_PINS_UPDATE': // This causes a message update too
            default:
                // return console.log('packet', packet.t);
                return null;
        }
    });
}
