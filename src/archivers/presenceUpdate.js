module.exports = (client, packet, pool) => {
    const data = packet.d;
    data.epoch = Date.now();
    return presence(pool, data).then(() => {
        return Promise.all([
            presenceClientStatus(pool, data),
            Promise.all(data.activities.map((activity, activityPos) => {
                activity.pos = activityPos;
                return presenceActivity(pool, data, activity).then(() => {
                    return Promise.all[
                        presenceActivityTimestamps(pool, data, activity),
                        presenceActivitySecrets(pool, data, activity),
                        presenceActivityParty(pool, data, activity),
                        presenceActivityEmoji(pool, data, activity),
                        presenceActivityAssets(pool, data, activity)
                    ]
                })
            }))
        ])
    });
}

function presence(pool, data) {
    return pool.query('REPLACE INTO presence VALUES (?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        data.guild_id,
        data.status.toUpperCase()
    ]);
}

function presenceClientStatus(pool, data) {
    return pool.query('REPLACE INTO presence_client_status VALUES (?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        (data.client_status.desktop ?? 'OFFLINE').toUpperCase(),
        (data.client_status.mobile ?? 'OFFLINE').toUpperCase(),
        (data.client_status.web ?? 'OFFLINE').toUpperCase()
    ]);
}

function presenceActivity(pool, data, activity) {
    return pool.query('REPLACE INTO presence_activity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.name,
        ['GAME', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING'][activity.type],
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

function presenceActivityTimestamps(pool, data, activity) {
    if (!activity.timestamps) return Promise.resolve();
    return pool.query('REPLACE INTO presence_activity_timestamps VALUES (?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.timestamps?.start ?? null,
        activity.timestamps?.end ?? null
    ]);
}

function presenceActivitySecrets(pool, data, activity) {
    if (!activity.secrets) return Promise.resolve();
    return pool.query('REPLACE INTO presence_activity_secrets VALUES (?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.secrets?.join ?? null,
        activity.secrets?.spectate ?? null,
        activity.secrets?.match ?? null
    ]);
}

function presenceActivityParty(pool, data, activity) {
    if (!activity.party) return Promise.resolve();
    return pool.query('REPLACE INTO presence_activity_party VALUES (?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.party.id ?? null,
        activity.party.size?. [0] ?? null,
        activity.party.size?. [1] ?? null
    ]);
}

function presenceActivityEmoji(pool, data, activity) {
    if (!activity.emoji) return Promise.resolve();
    return pool.query('REPLACE INTO presence_activity_emoji VALUES (?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.emoji.name,
        activity.emoji.id ?? null,
        activity.emoji.animated ?? false
    ]);
}

function presenceActivityAssets(pool, data, activity) {
    if (!activity.assets) return Promise.resolve();
    return pool.query('REPLACE INTO presence_activity_assets VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        activity.pos,
        activity.assets.large_image ?? null,
        activity.assets.large_text ?? null,
        activity.assets.small_image ?? null,
        activity.assets.small_text ?? null,
    ]);
}
