const fs = require('fs');

module.exports = (CommandClient, pool) => class extends CommandClient {
    constructor(options) {
        options.tasks = Object.assign({
            archiveStats: { class: require('./archive/tasks/ArchiveStats'), options: { pool } },

            archiveGuildMember: { class: require('./archive/tasks/ArchiveGuildMember'), options: { pool } },
            archiveMessage: { class: require('./archive/tasks/ArchiveMessage'), options: { pool } },
            archiveMessageDelete: { class: require('./archive/tasks/ArchiveMessageDelete'), options: { pool } },
            archiveMessageReaction: { class: require('./archive/tasks/ArchiveMessageReaction'), options: { pool } },
            archivePresence: { class: require('./archive/tasks/ArchivePresence'), options: { pool } },
            archiveTyping: { class: require('./archive/tasks/ArchiveTyping'), options: { pool } },
            archiveVoiceState: { class: require('./archive/tasks/ArchiveVoiceState'), options: { pool } }
        }, options.tasks);
        super(options);

        this.predicates.push(
            () => {
                return Promise.allSettled([
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/guild_member.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/message_delete.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/message_reaction.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/message.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/typing_start.sql`, 'utf8')),
                    pool.query(fs.readFileSync(`${__dirname}/../res/sql/voice_state.sql`, 'utf8'))
                ]).then(results => {
                    const error = results.find(result => result.reason && result.reason.code && result.reason.code !== 'ER_TABLE_EXISTS_ERROR');
                    if (error) return Promise.reject(error);
                    else return Promise.allSettled([
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/guild_member/guild_member_role.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/guild_member/guild_member_user.sql`, 'utf8')),

                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_activity.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_application.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_attachment.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_author.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_embed.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_mention_channel.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_mention_role.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_mention_special.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_mention_user.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_reference.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/message_sticker.sql`, 'utf8')),

                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/presence_activity.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/presence_client_status.sql`, 'utf8')),
                    ])
                }).then(results => {
                    const error = results.find(result => result.reason && result.reason.code && result.reason.code !== 'ER_TABLE_EXISTS_ERROR');
                    if (error) return Promise.reject(error);
                    else return Promise.allSettled([
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_author.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_field.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_footer.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_image.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_provider.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_thumbnail.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/message/embed/message_embed_video.sql`, 'utf8')),

                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/activity/presence_activity_assets.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/activity/presence_activity_emoji.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/activity/presence_activity_party.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/activity/presence_activity_secrets.sql`, 'utf8')),
                        pool.query(fs.readFileSync(`${__dirname}/../res/sql/presence/activity/presence_activity_timestamps.sql`, 'utf8'))
                    ])
                }).then(results => {
                    const error = results.find(result => result.reason && result.reason.code && result.reason.code !== 'ER_TABLE_EXISTS_ERROR');
                    if (!error) return this.emit('log', '[SETUP](AniList) database setup successful');
                    else return Promise.reject(error);
                }).catch(error => {
                    console.log(error)
                    this.emit('log', '[SETUP](AniList) database setup failed', error)
                })
            }
        )
    }
}
