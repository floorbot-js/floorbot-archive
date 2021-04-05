const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveGuildMember extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Guild Member' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'GUILD_MEMBER_UPDATE':
                    return this.archive(packet).catch(error => this.client.emit('log', `[ARCHIVE](GuildMember) Encountered a database error {${error.message}}`));
            }
        })
    }

    archive(packet) {
        const data = packet.d;
        data.epoch = Date.now();
        return this.guildMember(data).then(() => {
            return Promise.all([
                this.guildMemberUser(data),
                Promise.all((data.roles || []).map((roleID, roleIDIndex) => {
                    return this.guildMemberRole(data, { id: roleID, index: roleIDIndex })
                }))
            ]);
        });
    }

    guildMember(data) {
        return this.pool.query('REPLACE INTO guild_member VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            data.guild_id,
            data.nick ?? null,
            new Date(data.joined_at).getTime(),
            data.premium_since ? new Date(data.premium_since).getTime() : null,
            data.pending ?? null
        ]);
    }

    guildMemberUser(data) {
        return this.pool.query('REPLACE INTO guild_member_user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

    guildMemberRole(data, role) {
        return this.pool.query('REPLACE INTO guild_member_role VALUES (?, ?, ?, ?, ?)', [
            data.epoch,
            data.user.id,
            data.guild_id,
            role.id,
            role.index
        ]);
    }
}
