const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveVoiceState extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Voice State' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'VOICE_STATE_UPDATE':
                    return this.archive(packet).catch(error => this.client.emit('log', `[ARCHIVE](VoiceState) Encountered a database error {${error.message}}`));
            }
        })
    }

    archive(packet) {
        const data = packet.d;
        const now = Date.now();
        return this.pool.query('REPLACE INTO voice_state VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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
        ]);
    }
}
