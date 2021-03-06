module.exports = {
    add: (client, packet, pool) => {
        const data = packet.d;
        return pool.getConnection().then(connection => {
            return connection.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                Date.now(),
                data.message_id,
                data.user_id,
                data.channel_id,
                data.guild_id ?? null,
                data.emoji.name,
                data.emoji.id ?? 0,
                data.emoji.animated ?? null,
                'ADD'
            ]).then(res => {
                connection.release();
            }).catch(err => {
                connection.release();
                console.log('Critical error', err);
            });
        }).catch(err => {
            console.log('Database down...')
        });
    },
    remove: (client, packet, pool) => {
        const data = packet.d;
        return pool.getConnection().then(connection => {
            return connection.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    Date.now(),
                    data.message_id,
                    data.user_id,
                    data.channel_id,
                    data.guild_id ?? null,
                    data.emoji.name,
                    data.emoji.id ?? 0,
                    data.emoji.animated ?? null,
                    'REMOVE'
                ]).then(res => {
                connection.release();
            }).catch(err => {
                connection.release();
                console.log('Critical error', err);
            });
        }).catch(err => {
            console.log('Database down...')
        });
    },
    removeAll: (client, packet, pool) => {
        const now = Date.now();
        const data = packet.d;
        return pool.getConnection().then(connection => {
            return connection.query('SELECT * FROM message_reaction WHERE id = ? ORDER BY epoch DESC LIMIT 1;', [data.message_id]).then(rows => {
                rows = rows.filter(row.action === 'ADD');
                if (!rows.length) return Promise.resolve();
                return connection.batch('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', rows.map(row => {
                    return [
                        now,
                        row.id,
                        data.user_id,
                        data.channel_id,
                        data.guild_id,
                        data.emoji_name,
                        data.emoji_id,
                        data.emoji_animated,
                        'REMOVE'
                    ]
                }));
            });
        }).catch(err => {
            console.log('Database down...')
        });
    },
    removeEmoji: (client, packet, pool) => {
        const now = Date.now();
        const data = packet.d;
        return pool.getConnection().then(connection => {
            return connection.query('SELECT * FROM message_reaction WHERE id = ? AND emoji_name = ? AND emoji_id = ? ORDER BY epoch DESC LIMIT 1;', [
                data.message_id,
                data.emoji.name,
                data.emoji.id ?? 0
            ]).then(rows => {
                rows = rows.filter(row.action === 'ADD');
                if (!rows.length) return Promise.resolve();
                return connection.batch('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', rows.map(row => {
                    return [
                        now,
                        row.id,
                        data.user_id,
                        data.channel_id,
                        data.guild_id,
                        data.emoji_name,
                        data.emoji_id,
                        data.emoji_animated,
                        'REMOVE'
                    ]
                }));
            });
        }).catch(err => {
            console.log('Database down...')
        });
    }
}
