module.exports = (client, packet, pool) => {
    const data = packet.d;
    data.epoch = Date.now();
    return guildMember(pool, data).then(() => {
        return Promise.all([
            guildMemberUser(pool, data),
            Promise.all((data.roles || []).map((roleID, roleIDIndex) => {
                return guildMemberRole(pool, data, { id: roleID, index: roleIDIndex })
            }))
        ]);
    });
}

function guildMember(pool, data) {
    return pool.query('REPLACE INTO guild_member VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        data.guild_id,
        data.nick ?? null,
        new Date(data.joined_at).getTime(),
        data.premium_since ? new Date(data.premium_since).getTime() : null,
        data.pending ?? null
    ]);
}

function guildMemberUser(pool, data) {
    return pool.query('REPLACE INTO guild_member_user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        data.guild_id,
        data.user.username,
        data.user.discriminator,
        data.user.avatar ?? null,
        data.user.bot ?? false,
        data.user.system ?? false,
        data.user.mfa_enabled ?? null,
        data.user.locale ?? null,
        data.user.verified ?? null,
        data.user.email ?? null,
        data.user.flags ?? null,
        data.user.premium_type ?? null,
        data.user.public_flags ?? null
    ]);
}

function guildMemberRole(pool, data, role) {
    return pool.query('REPLACE INTO guild_member_role VALUES (?, ?, ?, ?, ?)', [
        data.epoch,
        data.user.id,
        data.guild_id,
        role.id,
        role.index
    ]);
}
