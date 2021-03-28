module.exports = {

    // Archiver Task Base Class
    ArchiveTask: require('./classes/ArchiveTask'),

    // Archiver Task Implementations
    ArchiveGuildMember: require('./tasks/ArchiveGuildMember'),
    ArchiveMessage: require('./tasks/ArchiveMessage'),
    ArchiveMessageDelete: require('./tasks/ArchiveMessageDelete'),
    ArchiveMessageReaction: require('./tasks/ArchiveMessageReaction'),
    ArchivePresence: require('./tasks/ArchivePresence'),
    ArchiveTyping: require('./tasks/ArchiveTyping'),
    ArchiveVoiceState: require('./tasks/ArchiveVoiceState')
}
