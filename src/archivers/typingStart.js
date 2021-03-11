module.exports = (client, packet, pool) => {
    const data = packet.d;
    return pool.query('REPLACE INTO typing_start VALUES (?, ?, ?, ?)', [
        BigInt(data.timestamp) * 1000n,
        data.channel_id,
        data.guild_id ?? null,
        data.user_id
    ]);
}
