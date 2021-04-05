const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveTyping extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Typing' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'TYPING_START':
                    return this.archive(packet).catch(error => this.client.emit('log', `[ARCHIVE](Typing) Encountered a database error {${error.message}}`));
            }
        })
    }

    archive(packet) {
        const data = packet.d;
        return this.pool.query('REPLACE INTO typing_start VALUES (?, ?, ?, ?)', [
                BigInt(data.timestamp) * 1000n,
                data.channel_id,
                data.guild_id ?? null,
                data.user_id
            ]);
    }
}
