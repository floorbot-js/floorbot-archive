module.exports = (client, packet, pool) => {
    const data = packet.d;
    return pool.getConnection().then(connection => {
        return Promise.all([
            message(data, connection),
            messageAuthor(data, connection),
            messageMessageReference(data, connection),
            messageMentionSpecial(data, connection),
            messageMentionChannel(data, connection),
            messageMentionRole(data, connection),
            messageMentionUser(data, connection),
            messageAttachment(data, connection),
            messageSticker(data, connection),
            messageEmbed(data, connection),
            messageEmbedField(data, connection),
            messageEmbedAuthor(data, connection),
            messageEmbedFooter(data, connection),
            messageEmbedImage(data, connection),
            messageEmbedThumbnail(data, connection),
            messageEmbedProvider(data, connection),
            messageEmbedVideo(data, connection),
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

function message(data, connection) {
    return connection.query('REPLACE INTO message VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        new Date(data.edited_timestamp || data.timestamp).getTime(),
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
        [
            'DEFAULT',
            'RECIPIENT_ADD',
            'RECIPIENT_REMOVE',
            'CALL',
            'CHANNEL_NAME_CHANGE',
            'CHANNEL_ICON_CHANGE',
            'CHANNEL_PINNED_MESSAGE',
            'GUILD_MEMBER_JOIN',
            'USER_PREMIUM_GUILD_SUBSCRIPTION',
            'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
            'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
            'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
            'CHANNEL_FOLLOW_ADD',
            'GUILD_DISCOVERY_DISQUALIFIED',
            'GUILD_DISCOVERY_REQUALIFIED',
            'REPLY',
            'APPLICATION_COMMAND'
        ][data.type],
        data.flags ?? null
    ]);
}

function messageAuthor(data, connection) {
    return connection.query('REPLACE INTO message_author VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
        new Date(data.edited_timestamp || data.timestamp).getTime(),
        data.id,
        data.author.username,
        data.author.id,
        data.author.discriminator,
        data.author.avatar,
        data.author.public_flags ?? null,
        data.author.bot ?? null
    ]);
}

function messageMessageReference(data, connection) {
    if (!data.message_reference) return Promise.resolve();
    return connection.query('REPLACE INTO message_message_reference VALUES (?, ?, ?, ?, ?)', [
        new Date(data.edited_timestamp || data.timestamp).getTime(),
        data.id,
        data.message_reference.message_id,
        data.message_reference.channel_id,
        data.message_reference.guild_id
    ]);
}

function messageMentionSpecial(data, connection) {
    const matches = [...data.content.matchAll(/@(everyone|here)/g)];
    return Promise.all(matches.map((match, pos) => {
        return connection.query('REPLACE INTO message_mention_special VALUES (?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            match[1].toUpperCase()
        ]);
    }));
}

function messageMentionChannel(data, connection) {
    const matches = [...data.content.matchAll(/<#(\d{17,19})>/g)];
    return Promise.all(matches.map((match, pos) => {
        return connection.query('REPLACE INTO message_mention_channel VALUES (?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            match[1]
        ]);
    }));
}

function messageMentionRole(data, connection) {
    const matches = [...data.content.matchAll(/<@&(\d{17,19})>/g)];
    return Promise.all(matches.map((match, pos) => {
        return connection.query('REPLACE INTO message_mention_role VALUES (?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            match[1]
        ]);
    }));
}

function messageMentionUser(data, connection) {
    const matches = [...data.content.matchAll(/<@!?(\d{17,19})>/g)];
    return Promise.all(matches.map((match, pos) => {
        return connection.query('REPLACE INTO message_mention_user VALUES (?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            match[1]
        ]);
    }));
}

function messageAttachment(data, connection) {
    if (!data.attachments) return Promise.resolve();
    return Promise.all(data.attachments.map((attachment, pos) => {
        return connection.query('REPLACE INTO message_attachment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
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

function messageSticker(data, connection) {
    if (!data.stickers) return Promise.resolve();
    return Promise.all(data.stickers.map((sticker, pos) => {
        return connection.query('REPLACE INTO message_sticker VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            sticker.id,
            sticker.pack_id,
            sticker.name,
            sticker.description,
            sticker.tags ?? null,
            sticker.asset,
            sticker.preview_asset ?? null,
            ['PNG', 'APNG', 'LOTTIE'][sticker.format_type]
        ]);
    }));
}

function messageEmbed(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        return connection.query('REPLACE INTO message_embed VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.title ?? null,
            embed.type ?? null,
            embed.description ?? null,
            embed.url ?? null,
            embed.timestamp ? new Date(embed.timestamp).getTime() : null,
            embed.color ?? null
        ]);
    }));
}

function messageEmbedField(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.fields) return Promise.resolve();
        return Promise.all(embed.fields.map((field, fieldPos) => {
            return connection.query('REPLACE INTO message_embed_field VALUES (?, ?, ?, ?, ?, ?, ?)', [
                new Date(data.edited_timestamp || data.timestamp).getTime(),
                data.id,
                pos,
                fieldPos,
                field.name,
                field.value,
                field.inline ?? null
            ]);
        }));
    }));
}

function messageEmbedAuthor(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.author) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_author VALUES (?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.author.name ?? null,
            embed.author.url ?? null,
            embed.author.icon_url ?? null,
            embed.author.proxy_icon_url ?? null
        ]);
    }));
}

function messageEmbedFooter(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.footer) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_footer VALUES (?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.footer.text,
            embed.footer.icon_url ?? null,
            embed.footer.proxy_icon_url ?? null
        ]);
    }));
}

function messageEmbedImage(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.image) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_image VALUES (?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.image.url ?? null,
            embed.image.proxy_url ?? null,
            embed.image.height ?? null,
            embed.image.width ?? null,
        ]);
    }));
}

function messageEmbedThumbnail(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.thumbnail) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_thumbnail VALUES (?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.thumbnail.url ?? null,
            embed.thumbnail.proxy_url ?? null,
            embed.thumbnail.height ?? null,
            embed.thumbnail.width ?? null,
        ]);
    }));
}

function messageEmbedProvider(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.provider) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_provider VALUES (?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.provider.name ?? null,
            embed.provider.url ?? null,
        ]);
    }));
}

function messageEmbedVideo(data, connection) {
    return Promise.all(data.embeds.map((embed, pos) => {
        if (!embed.video) return Promise.resolve();
        return connection.query('REPLACE INTO message_embed_video VALUES (?, ?, ?, ?, ?, ?, ?)', [
            new Date(data.edited_timestamp || data.timestamp).getTime(),
            data.id,
            pos,
            embed.video.url ?? null,
            embed.video.proxy_url ?? null,
            embed.video.height ?? null,
            embed.video.width ?? null
        ]);
    }));
}
