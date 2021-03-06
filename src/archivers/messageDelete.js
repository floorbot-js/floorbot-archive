module.exports = (client, packet, pool) => {
    const now = Date.now();
    const data = packet.d;
    if (data.id) data.ids = [data.id];
    return pool.getConnection().then(connection => {
        return connection.batch('REPLACE INTO message_delete VALUES (?, ?, ?, ?)', data.ids.map(id => {
            return [now, id, data.channel_id, data.guild_id ?? null]
        })).then(res => {
            connection.release();
        }).catch(err => {
            connection.release();
            console.log('Critical error', err);
        });
    }).catch(err => {
        console.log('Database down...')
    });
}
