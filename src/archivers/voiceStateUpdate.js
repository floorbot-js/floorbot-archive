module.exports = (client, packet, pool) => {
    const data = packet.d;
    const now = Date.now();
    return pool.getConnection().then(connection => {
        return connection.query('REPLACE INTO voice_state VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            now,
            data.guild_id ?? null,
            data.channel_id ?? null,
            data.user_id,
            data.session_id,
            data.deaf,
            data.mute,
            data.self_deaf,
            data.self_mute,
            data.self_stream ?? false,
            data.self_video
        ]).then(res => {
            connection.release();
        }).catch(err => {
            connection.release();
            console.log('Critical error', err);
        });
    }).catch(err => {
        console.log(err)
        console.log('Database down...')
    });
}
