module.exports = (client, packet, pool) => {
    const data = packet.d;
    data.epoch = new Date(data.edited_timestamp || data.timestamp).getTime();
    return message(pool, data).then(() => {
        return Promise.all([
            messageAuthor(pool, data),
            messageReference(pool, data),
            messageMentionSpecial(pool, data),
            messageMentionChannel(pool, data),
            messageMentionRole(pool, data),
            messageMentionUser(pool, data),
            messageActivity(pool, data),
            messageApplication(pool, data),
            messageAttachment(pool, data),
            messageSticker(pool, data),
            Promise.all(data.embeds.map((embed, embedIndex) => {
                embed.index = embedIndex;
                return messageEmbed(pool, data, embed).then(() => {
                    return Promise.all([
                        messageEmbedAuthor(pool, data, embed),
                        messageEmbedFooter(pool, data, embed),
                        messageEmbedImage(pool, data, embed),
                        messageEmbedThumbnail(pool, data, embed),
                        messageEmbedProvider(pool, data, embed),
                        messageEmbedVideo(pool, data, embed),
                        Promise.all((embed.fields || []).map((field, fieldIndex) => {
                            field.index = fieldIndex;
                            return messageEmbedField(pool, data, embed, field);
                        }))
                    ]);
                })
            }))
        ]);
    });
}

function message(pool, data) {
    return pool.query('REPLACE INTO message VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

function messageAuthor(pool, data) {
    return pool.query('REPLACE INTO message_author VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
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

function messageReference(pool, data) {
    if (!data.message_reference) return Promise.resolve();
    return pool.query('REPLACE INTO message_reference VALUES (?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        data.message_reference.message_id,
        data.message_reference.channel_id,
        data.message_reference.guild_id
    ]);
}

function messageMentionSpecial(pool, data) {
    const matches = [...data.content.matchAll(/@(everyone|here)/g)];
    return Promise.all(matches.map((match, mentionIndex) => {
        return pool.query('REPLACE INTO message_mention_special VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.id,
            mentionIndex,
            match[1].toUpperCase()
        ]);
    }));
}

function messageMentionChannel(pool, data) {
    const matches = [...data.content.matchAll(/<#(\d{17,19})>/g)];
    return Promise.all(matches.map((match, mentionIndex) => {
        return pool.query('REPLACE INTO message_mention_channel VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.id,
            mentionIndex,
            match[1]
        ]);
    }));
}

function messageMentionRole(pool, data) {
    const matches = [...data.content.matchAll(/<@&(\d{17,19})>/g)];
    return Promise.all(matches.map((match, mentionIndex) => {
        return pool.query('REPLACE INTO message_mention_role VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.id,
            mentionIndex,
            match[1]
        ]);
    }));
}

function messageMentionUser(pool, data) {
    const matches = [...data.content.matchAll(/<@!?(\d{17,19})>/g)];
    return Promise.all(matches.map((match, mentionIndex) => {
        return pool.query('REPLACE INTO message_mention_user VALUES (?, ?, ?, ?)', [
            data.epoch,
            data.id,
            mentionIndex,
            match[1]
        ]);
    }));
}

function messageActivity(pool, data) {
    if (!data.activity) return Promise.resolve();
    return pool.query('REPLACE INTO message_activity VALUES (?, ?, ?, ?)', [
        data.epoch,
        data.id,
        data.activity.type,
        data.activity.party_id ?? null
    ]);
}

function messageApplication(pool, data) {
    if (!data.application) return Promise.resolve();
    return pool.query('REPLACE INTO message_application VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        data.application.id,
        data.application.cover_image ?? null,
        data.application.description,
        data.application.icon ?? null,
        data.application.name
    ]);
}

function messageAttachment(pool, data) {
    if (!data.attachments) return Promise.resolve();
    return Promise.all(data.attachments.map((attachment, attachmentIndex) => {
        return pool.query('REPLACE INTO message_attachment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

function messageSticker(pool, data) {
    if (!data.stickers) return Promise.resolve();
    return Promise.all(data.stickers.map((sticker, stickerIndex) => {
        return pool.query('REPLACE INTO message_sticker VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

function messageEmbed(pool, data, embed) {
    return pool.query('REPLACE INTO message_embed VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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

function messageEmbedAuthor(pool, data, embed) {
    if (!embed.author) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_author VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.author.name ?? null,
        embed.author.url ?? null,
        embed.author.icon_url ?? null,
        embed.author.proxy_icon_url ?? null
    ]);
}

function messageEmbedFooter(pool, data, embed) {
    if (!embed.footer) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_footer VALUES (?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.footer.text,
        embed.footer.icon_url ?? null,
        embed.footer.proxy_icon_url ?? null
    ]);
}

function messageEmbedImage(pool, data, embed) {
    if (!embed.image) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_image VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.image.url ?? null,
        embed.image.proxy_url ?? null,
        embed.image.height ?? null,
        embed.image.width ?? null,
    ]);
}

function messageEmbedThumbnail(pool, data, embed) {
    if (!embed.thumbnail) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_thumbnail VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.thumbnail.url ?? null,
        embed.thumbnail.proxy_url ?? null,
        embed.thumbnail.height ?? null,
        embed.thumbnail.width ?? null,
    ]);
}

function messageEmbedProvider(pool, data, embed) {
    if (!embed.provider) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_provider VALUES (?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.provider.name ?? null,
        embed.provider.url ?? null,
    ]);
}

function messageEmbedVideo(pool, data, embed) {
    if (!embed.video) return Promise.resolve();
    return pool.query('REPLACE INTO message_embed_video VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        embed.video.url ?? null,
        embed.video.proxy_url ?? null,
        embed.video.height ?? null,
        embed.video.width ?? null
    ]);
}

function messageEmbedField(pool, data, embed, field) {
    return pool.query('REPLACE INTO message_embed_field VALUES (?, ?, ?, ?, ?, ?, ?)', [
        data.epoch,
        data.id,
        embed.index,
        field.index,
        field.name,
        field.value,
        field.inline ?? false
    ]);
}
