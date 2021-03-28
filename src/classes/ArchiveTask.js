const { Task } = require('discord.js');

module.exports = class ArchiveTask extends Task {
    constructor(client, options = {}) {
        super(client, options);
        this.pool = options.pool;
    }
}
