module.exports = (client, packet, pool) => {
    const data = packet.d;
    const now = Date.now();
    return pool.getConnection().then(connection => {
        return Promise.all([
            presence(data, connection, now),
            presenceClientStatus(data, connection, now),
            presenceActivity(data, connection, now),
            presenceActivityTimestamps(data, connection, now),
            presenceActivitySecrets(data, connection, now),
            presenceActivityParty(data, connection, now),
            presenceActivityEmoji(data, connection, now),
            presenceActivityAssets(data, connection, now)
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

function presence(data, connection, now) {
    return connection.query('REPLACE INTO presence VALUES (?, ?, ?, ?)', [
        now,
        data.user.id,
        data.guild_id,
        data.status.toUpperCase()
    ]);
}

function presenceClientStatus(data, connection, now) {
    return connection.query('REPLACE INTO presence_client_status VALUES (?, ?, ?, ?, ?)', [
        now,
        data.user.id,
        data.client_status.desktop?.toUpperCase() ?? null,
        data.client_status.mobile?.toUpperCase() ?? null,
        data.client_status.web?.toUpperCase() ?? null
    ]);
}

function presenceActivity(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        return connection.query('REPLACE INTO presence_activity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.name,
            ['GAME', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING'][activity.type],
            activity.id ?? null,
            activity.url ?? null,
            activity.created_at,
            activity.application_id ?? null,
            activity.details ?? null,
            activity.state ?? null,
            activity.instance ?? null,
            activity.flags ?? null
        ]);
    }));
}

function presenceActivityTimestamps(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        if (!activity.timestamps) return Promise.resolve();
        return connection.query('REPLACE INTO presence_activity_timestamps VALUES (?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.timestamps?.start ?? null,
            activity.timestamps?.end ?? null
        ]);
    }));
}

function presenceActivitySecrets(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        if (!activity.secrets) return Promise.resolve();
        return connection.query('REPLACE INTO presence_activity_secrets VALUES (?, ?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.secrets?.join ?? null,
            activity.secrets?.spectate ?? null,
            activity.secrets?.match ?? null
        ]);
    }));
}

function presenceActivityParty(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        if (!activity.party) return Promise.resolve();
        return connection.query('REPLACE INTO presence_activity_party VALUES (?, ?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.party.id ?? null,
            activity.party.size?. [0] ?? null,
            activity.party.size?. [1] ?? null
        ]);
    }));
}

function presenceActivityEmoji(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        if (!activity.emoji) return Promise.resolve();
        return connection.query('REPLACE INTO presence_activity_emoji VALUES (?, ?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.emoji.name,
            activity.emoji.id ?? null,
            activity.emoji.animated ?? null
        ]);
    }));
}

function presenceActivityAssets(data, connection, now) {
    return Promise.all(data.activities.map((activity, pos) => {
        if (!activity.assets) return Promise.resolve();
        return connection.query('REPLACE INTO presence_activity_assets VALUES (?, ?, ?, ?, ?, ?, ?)', [
            now,
            data.user.id,
            pos,
            activity.assets.large_image ?? null,
            activity.assets.large_text ?? null,
            activity.assets.small_image ?? null,
            activity.assets.small_text ?? null,
        ]);
    }));
}
