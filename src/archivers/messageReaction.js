module.exports = (client, packet, pool) => {
    const data = packet.d;
    data.epoch = Date.now();
    switch (packet.t) {
        case 'MESSAGE_REACTION_ADD':
            return messageReactionAdd(data, pool);
        case 'MESSAGE_REACTION_REMOVE':
            return messageReactionRemove(data, pool);
        case 'MESSAGE_REACTION_REMOVE_ALL':
            return messageReactionRemoveAll(data, pool);
        case 'MESSAGE_REACTION_REMOVE_EMOJI':
            return messageReactionRemoveEmoji(data, pool);
        default:
            return Promise.reject();
    }
}

function messageReactionAdd(data, pool) {
    return pool.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.message_id,
        data.user_id,
        data.channel_id,
        data.guild_id ?? null,
        data.emoji.name,
        data.emoji.id ?? 0,
        data.emoji.animated ?? false,
        'ADD'
    ]);
}

function messageReactionRemove(data, pool) {
    return pool.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.message_id,
        data.user_id,
        data.channel_id,
        data.guild_id ?? null,
        data.emoji.name,
        data.emoji.id ?? 0,
        data.emoji.animated ?? false,
        'REMOVE'
    ]);
}

function messageReactionRemoveAll(data, pool) {
    return pool.query('SELECT * FROM message_reaction WHERE id = ? AND action = "ADD" ORDER BY epoch DESC LIMIT 1;', [data.message_id]).then(rows => {
        if (!rows.length) return Promise.resolve();
        return pool.batch('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', rows.map(row => {
            return [
                data.epoch,
                row.id,
                data.user_id,
                data.channel_id,
                data.guild_id ?? null,
                data.emoji_name,
                data.emoji_id ?? 0,
                data.emoji_animated ?? false,
                'REMOVE'
            ]
        }));
    });
}

function messageReactionRemoveEmoji(data, pool) {
    return pool.query('SELECT * FROM message_reaction WHERE id = ? AND emoji_name = ? AND emoji_id = ? AND action = "ADD" ORDER BY epoch DESC LIMIT 1;', [
        data.message_id,
        data.emoji.name,
        data.emoji.id ?? 0
    ]).then(rows => {
        if (!rows.length) return Promise.resolve();
        return pool.batch('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', rows.map(row => {
            return [
                data.epoch,
                row.id,
                data.user_id,
                data.channel_id,
                data.guild_id ?? null,
                data.emoji_name,
                data.emoji_id ?? 0,
                data.emoji_animated ?? false,
                'REMOVE'
            ]
        }));
    });
}
