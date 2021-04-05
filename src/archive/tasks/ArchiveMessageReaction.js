const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveMessageReaction extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Message Reaction' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'MESSAGE_REACTION_ADD':
                    return this.archiveAdd(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageReactionAdd) Encountered a database error {${error.message}}`));
                case 'MESSAGE_REACTION_REMOVE':
                    return this.archiveRemove(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageReactionRemove) Encountered a database error {${error.message}}`));
                case 'MESSAGE_REACTION_REMOVE_ALL':
                    return this.archiveRemoveAll(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageReactionRemoveAll) Encountered a database error {${error.message}}`));
                case 'MESSAGE_REACTION_REMOVE_EMOJI':
                    return this.archiveRemoveEmoji(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageReactionRemoveEmoji) Encountered a database error {${error.message}}`));
            }
        })
    }

    archiveAdd(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.pool.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

    archiveRemove(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.pool.query('REPLACE INTO message_reaction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

    archiveRemoveAll(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.pool.query('SELECT * FROM message_reaction WHERE id = ? AND action = "ADD" ORDER BY epoch DESC LIMIT 1;', [data.message_id]).then(rows => {
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

    archiveRemoveEmoji(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.pool.query('SELECT * FROM message_reaction WHERE id = ? AND emoji_name = ? AND emoji_id = ? AND action = "ADD" ORDER BY epoch DESC LIMIT 1;', [
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
}
