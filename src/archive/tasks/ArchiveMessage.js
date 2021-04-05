const ArchiveTask = require('../ArchiveTask');

module.exports = class ArchiveMessage extends ArchiveTask {
    constructor(client, options) {
        options = Object.assign(options, { name: 'Archive Message' });
        super(client, options);

        client.on('raw', packet => {
            switch (packet.t) {
                case 'MESSAGE_CREATE':
                    return this.archiveCreate(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageCreate) Encountered a database error {${error.message}}`));
                case 'MESSAGE_UPDATE':
                    return this.archiveUpdate(packet).catch(error => this.client.emit('log', `[ARCHIVE](MessageUpdate) Encountered a database error {${error.message}}`));
                case 'CHANNEL_PINS_UPDATE':
                    return; // This will also trigger a 'MESSAGE_UPDATE' and can be ignored
            }
        })
    }

    archiveUpdate(packet) {
        return this.client.api.channels[packet.d.channel_id].messages[packet.d.id].get().then(data => {
            Object.assign(packet.d, data);
            return this.archiveCreate(packet);
        })
    }

    archiveCreate(packet) {
        const data = packet.d;
        data.epoch = new Date(data.edited_timestamp || data.timestamp).getTime();
        return this.message(data).then(() => {
            return Promise.all([
                this.messageAuthor(data),
                this.messageReference(data),
                this.messageMentionSpecial(data),
                this.messageMentionChannel(data),
                this.messageMentionRole(data),
                this.messageMentionUser(data),
                this.messageActivity(data),
                this.messageApplication(data),
                this.messageAttachment(data),
                this.messageSticker(data),
                Promise.all(data.embeds.map((embed, embedIndex) => {
                    embed.index = embedIndex;
                    return this.messageEmbed(data, embed).then(() => {
                        return Promise.all([
                            this.messageEmbedAuthor(data, embed),
                            this.messageEmbedFooter(data, embed),
                            this.messageEmbedImage(data, embed),
                            this.messageEmbedThumbnail(data, embed),
                            this.messageEmbedProvider(data, embed),
                            this.messageEmbedVideo(data, embed),
                            Promise.all((embed.fields || []).map((field, fieldIndex) => {
                                field.index = fieldIndex;
                                return this.messageEmbedField(data, embed, field);
                            }))
                        ]);
                    })
                }))
            ]);
        });
    }

    message(data) {
        return this.pool.query('REPLACE INTO message VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            data.guild_id ?? null,
            data.channel_id,
            data.content,
            new Date(data.timestamp).getTime(),
            data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null,
            data.tts,
            data.mention_everyone,
            data.pinned,
            data.webhook_id ?? null,
            data.type,
            data.flags ?? null
        ]);
    }

    messageAuthor(data) {
        return this.pool.query('REPLACE INTO message_author VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            data.author.username,
            data.author.id,
            data.author.discriminator,
            data.author.avatar,
            data.author.public_flags ?? null,
            data.author.bot ?? false
        ]);
    }

    messageReference(data) {
        if (!data.message_reference) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_reference VALUES (?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            data.message_reference.message_id,
            data.message_reference.channel_id,
            data.message_reference.guild_id
        ]);
    }

    messageMentionSpecial(data) {
        const matches = [...data.content.matchAll(/@(everyone|here)/g)];
        return Promise.all(matches.map((match, mentionIndex) => {
            return this.pool.query('REPLACE INTO message_mention_special VALUES (?, ?, ?, ?)', [
                data.epoch,
                data.id,
                mentionIndex,
                match[1].toUpperCase()
            ]);
        }));
    }

    messageMentionChannel(data) {
        const matches = [...data.content.matchAll(/<#(\d{17,19})>/g)];
        return Promise.all(matches.map((match, mentionIndex) => {
            return this.pool.query('REPLACE INTO message_mention_channel VALUES (?, ?, ?, ?)', [
                data.epoch,
                data.id,
                mentionIndex,
                match[1]
            ]);
        }));
    }

    messageMentionRole(data) {
        const matches = [...data.content.matchAll(/<@&(\d{17,19})>/g)];
        return Promise.all(matches.map((match, mentionIndex) => {
            return this.pool.query('REPLACE INTO message_mention_role VALUES (?, ?, ?, ?)', [
                data.epoch,
                data.id,
                mentionIndex,
                match[1]
            ]);
        }));
    }

    messageMentionUser(data) {
        const matches = [...data.content.matchAll(/<@!?(\d{17,19})>/g)];
        return Promise.all(matches.map((match, mentionIndex) => {
            return this.pool.query('REPLACE INTO message_mention_user VALUES (?, ?, ?, ?)', [
                data.epoch,
                data.id,
                mentionIndex,
                match[1]
            ]);
        }));
    }

    messageActivity(data) {
        if (!data.activity) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_activity VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.id,
            data.activity.type,
            data.activity.party_id ?? null
        ]);
    }

    messageApplication(data) {
        if (!data.application) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_application VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            data.application.id,
            data.application.cover_image ?? null,
            data.application.description,
            data.application.icon ?? null,
            data.application.name
        ]);
    }

    messageAttachment(data) {
        if (!data.attachments) return Promise.resolve();
        return Promise.all(data.attachments.map((attachment, attachmentIndex) => {
            return this.pool.query('REPLACE INTO message_attachment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                data.epoch,
                data.id,
                attachmentIndex,
                attachment.id,
                attachment.filename,
                attachment.size,
                attachment.url,
                attachment.proxy_url,
                attachment.height ?? null,
                attachment.width ?? null
            ]);
        }));
    }

    messageSticker(data) {
        if (!data.stickers) return Promise.resolve();
        return Promise.all(data.stickers.map((sticker, stickerIndex) => {
            return this.pool.query('REPLACE INTO message_sticker VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                data.epoch,
                data.id,
                stickerIndex,
                sticker.id,
                sticker.pack_id,
                sticker.name,
                sticker.description,
                sticker.tags ?? null,
                sticker.asset,
                sticker.preview_asset ?? null,
                sticker.format_type
            ]);
        }));
    }

    messageEmbed(data, embed) {
        return this.pool.query('REPLACE INTO message_embed VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.title ?? null,
            embed.type ?? null,
            embed.description ?? null,
            embed.url ?? null,
            embed.timestamp ? new Date(embed.timestamp).getTime() : null,
            embed.color ?? null
        ]);
    }

    messageEmbedAuthor(data, embed) {
        if (!embed.author) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_author VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.author.name ?? null,
            embed.author.url ?? null,
            embed.author.icon_url ?? null,
            embed.author.proxy_icon_url ?? null
        ]);
    }

    messageEmbedFooter(data, embed) {
        if (!embed.footer) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_footer VALUES (?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.footer.text,
            embed.footer.icon_url ?? null,
            embed.footer.proxy_icon_url ?? null
        ]);
    }

    messageEmbedImage(data, embed) {
        if (!embed.image) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_image VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.image.url ?? null,
            embed.image.proxy_url ?? null,
            embed.image.height ?? null,
            embed.image.width ?? null,
        ]);
    }

    messageEmbedThumbnail(data, embed) {
        if (!embed.thumbnail) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_thumbnail VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.thumbnail.url ?? null,
            embed.thumbnail.proxy_url ?? null,
            embed.thumbnail.height ?? null,
            embed.thumbnail.width ?? null,
        ]);
    }

    messageEmbedProvider(data, embed) {
        if (!embed.provider) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_provider VALUES (?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.provider.name ?? null,
            embed.provider.url ?? null,
        ]);
    }

    messageEmbedVideo(data, embed) {
        if (!embed.video) return Promise.resolve();
        return this.pool.query('REPLACE INTO message_embed_video VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            embed.video.url ?? null,
            embed.video.proxy_url ?? null,
            embed.video.height ?? null,
            embed.video.width ?? null
        ]);
    }

    messageEmbedField(data, embed, field) {
        return this.pool.query('REPLACE INTO message_embed_field VALUES (?, ?, ?, ?, ?, ?, ?)', [
            data.epoch,
            data.id,
            embed.index,
            field.index,
            field.name,
            field.value,
            field.inline ?? false
        ]);
    }
}
