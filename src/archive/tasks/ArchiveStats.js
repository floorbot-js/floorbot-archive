const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveStats extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Stats' });
        super(client, options);
        this.intervalId = null;
    }

    initialise() {
        this.log();
        if (this.intervalId) clearInterval(this.intervalId);
        return this.intervalId = setInterval(() => this.log(), 1000 * 60 * 60);
    }

    finalise() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        return true;
    }

    log() {
        return Promise.all([
            this.pool.query('SELECT COUNT(*) AS total FROM message;'),
            this.pool.query('SELECT COUNT(DISTINCT(message_id)) AS total FROM message;'),
            this.pool.query('SELECT COUNT(*) AS total FROM message_delete;'),
            this.pool.query('SELECT COUNT(*) AS total FROM message_reaction;'),
            this.pool.query('SELECT COUNT(*) AS total FROM voice_state;'),
            this.pool.query('SELECT COUNT(*) AS total FROM presence;'),
            this.pool.query('SELECT COUNT(*) AS total FROM guild_member;'),
            this.pool.query('SELECT COUNT(*) AS total FROM typing_start;')
        ]).then(totals => {
            const totalMessages = totals[1][0].total;
            const totalMessageEdits = totals[0][0].total - totals[1][0].total;
            const totalMessageDeletes = totals[2][0].total;
            const totalMessageReactions = totals[3][0].total;
            const totalVoiceUpdates = totals[4][0].total;
            const totalPresenceUpdates = totals[5][0].total;
            const totalMemberUpdates = totals[6][0].total;
            const totalTypingEvents = totals[7][0].total;

            this.client.emit('log', (
                '[Archive](log) Statistics:\n' +
                ` - Messages           ${totalMessages}\n` +
                ` - Message Edits      ${totalMessageEdits}\n` +
                ` - Messages Deleted   ${totalMessageDeletes}\n` +
                ` - Messages Reactions ${totalMessageDeletes}\n` +
                ` - Presence Updates   ${totalVoiceUpdates}\n` +
                ` - Member Updates     ${totalMemberUpdates}\n` +
                ` - Typing Events      ${totalTypingEvents}`
            ))
        })
    }
}
