const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchivePresence extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Presence' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'PRESENCE_UPDATE':
                    return this.archive(packet).catch(error => this.client.emit('log', `[ARCHIVE](Presence) Encountered a database error {${error.message}}`));
            }
        })
    }

    archive(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.presence(data).then(() => {
            return Promise.all([
                this.presenceClientStatus(data),
                Promise.all(data.activities.map((activity, activityIndex) => {
                    activity.index = activityIndex;
                    return this.presenceActivity(data, activity).then(() => {
                        return Promise.all[
                            this.presenceActivityTimestamps(data, activity),
                            this.presenceActivitySecrets(data, activity),
                            this.presenceActivityParty(data, activity),
                            this.presenceActivityEmoji(data, activity),
                            this.presenceActivityAssets(data, activity)
                        ]
                    })
                }))
            ])
        });
    }

    presence(data) {
        return this.pool.query('REPLACE INTO presence VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            data.guild_id,
            data.status.toUpperCase()
        ]);
    }

    presenceClientStatus(data) {
        return this.pool.query('REPLACE INTO presence_client_status VALUES (?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            (data.client_status.desktop ?? 'OFFLINE').toUpperCase(),
            (data.client_status.mobile ?? 'OFFLINE').toUpperCase(),
            (data.client_status.web ?? 'OFFLINE').toUpperCase()
        ]);
    }

    presenceActivity(data, activity) {
        return this.pool.query('REPLACE INTO presence_activity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.name,
            activity.type,
            activity.id ?? null,
            activity.url ?? null,
            activity.created_at,
            activity.application_id ?? null,
            activity.details ?? null,
            activity.state ?? null,
            activity.instance ?? false,
            activity.flags ?? null
        ]);
    }

    presenceActivityTimestamps(data, activity) {
        if (!activity.timestamps) return Promise.resolve();
        return this.pool.query('REPLACE INTO presence_activity_timestamps VALUES (?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.timestamps?.start ?? null,
            activity.timestamps?.end ?? null
        ]);
    }

    presenceActivitySecrets(data, activity) {
        if (!activity.secrets) return Promise.resolve();
        return this.pool.query('REPLACE INTO presence_activity_secrets VALUES (?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.secrets?.join ?? null,
            activity.secrets?.spectate ?? null,
            activity.secrets?.match ?? null
        ]);
    }

    presenceActivityParty(data, activity) {
        if (!activity.party) return Promise.resolve();
        return this.pool.query('REPLACE INTO presence_activity_party VALUES (?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.party.id ?? null,
            activity.party.size?. [0] ?? null,
            activity.party.size?. [1] ?? null
        ]);
    }

    presenceActivityEmoji(data, activity) {
        if (!activity.emoji) return Promise.resolve();
        return this.pool.query('REPLACE INTO presence_activity_emoji VALUES (?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.emoji.name,
            activity.emoji.id ?? null,
            activity.emoji.animated ?? false
        ]);
    }

    presenceActivityAssets(data, activity) {
        if (!activity.assets) return Promise.resolve();
        return this.pool.query('REPLACE INTO presence_activity_assets VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            activity.index,
            activity.assets.large_image ?? null,
            activity.assets.large_text ?? null,
            activity.assets.small_image ?? null,
            activity.assets.small_text ?? null,
        ]);
    }
}
