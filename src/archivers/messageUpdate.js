const messageCreate = require('./messageCreate');

module.exports = (client, packet, pool) => {
    return client.api.channels[packet.d.channel_id].messages[packet.d.id].get().then(data => {
        Object.assign(packet.d, data);
        return messageCreate(client, packet, pool);
    })
}
