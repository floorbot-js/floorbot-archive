const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveMessageDelete extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Message Delete' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'MESSAGE_DELETE':
                    return this.archive(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageDelete) Encountered a database error {${error.message}}`));
                case 'MESSAGE_DELETE_BULK':
                    return this.archiveBulk(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageDeleteBulk) Encountered a database error {${error.message}}`));
            }
        })
    }

    archive(packet) {
        packet.d.ids = [data.id];
        return this.archiveBulk(packet);
    }

    archiveBulk(packet) {
        const now = Date.now();
        const data = packet.d;
        return this.pool.batch('REPLACE INTO message_delete VALUES (?, ?, ?, ?)', data.ids.map(id => {
            return [now, id, data.channel_id, data.guild_id ?? null];
        }));
    }
}
