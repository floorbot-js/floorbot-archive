-- -- DROP ALL TABLES IN ORDER
-- DROP TABLE message_attachment;
-- DROP TABLE message_author;
-- DROP TABLE message_mention_channel;
-- DROP TABLE message_mention_role;
-- DROP TABLE message_mention_special;
-- DROP TABLE message_mention_user;
-- DROP TABLE message_activity;
-- DROP TABLE message_application;
-- DROP TABLE message_reference;
-- DROP TABLE message_sticker;

-- DROP TABLE message_embed_author;
-- DROP TABLE message_embed_field;
-- DROP TABLE message_embed_footer;
-- DROP TABLE message_embed_image;
-- DROP TABLE message_embed_provider;
-- DROP TABLE message_embed_thumbnail;
-- DROP TABLE message_embed_video;
-- DROP TABLE message_embed;

-- DROP TABLE message;

-- https://discord.com/developers/docs/resources/channel#message-object-message-structure
CREATE TABLE message (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    guild_id BIGINT,
    channel_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    timestamp BIGINT NOT NULL,
    edited_timestamp BIGINT,
    tts BOOLEAN NOT NULL,
    mention_everyone BOOLEAN NOT NULL,
    pinned BOOLEAN NOT NULL,
    webhook_id BIGINT,
    type ENUM(
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
    ) NOT NULL,
    flags INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id)
);

-- https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
CREATE TABLE message_attachment (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    attachment_index INT NOT NULL,
    attachment_id BIGINT NOT NULL,
    filename VARCHAR(512) NOT NULL,
    size INT NOT NULL,
    url VARCHAR(2083) NOT NULL,
    proxy_url VARCHAR(2083) NOT NULL,
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, attachment_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/user#user-object-user-structure
CREATE TABLE message_author (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    username VARCHAR(512) NOT NULL,
    author_id BIGINT NOT NULL,
    discriminator VARCHAR(4) NOT NULL,
    avatar VARCHAR(512) NOT NULL,
    public_flags INT,
    bot BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

CREATE TABLE message_mention_channel (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    channel_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

CREATE TABLE message_mention_role (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    role_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

CREATE TABLE message_mention_special (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    type ENUM('EVERYONE', 'HERE'),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

CREATE TABLE message_mention_user (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);


-- https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
CREATE TABLE message_activity (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    type ENUM('JOIN', 'SPECTATE', 'LISTEN', 'JOIN_REQUEST') NOT NULL,
    party_id VARCHAR(512),
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#message-object-message-application-structure
CREATE TABLE message_application (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    application_id BIGINT NOT NULL,
    cover_image VARCHAR(512),
    description VARCHAR(512) NOT NULL,
    icon VARCHAR(512),
    name VARCHAR(512) NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#message-object-message-reference-structure
CREATE TABLE message_reference (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    ref_message_id BIGINT NOT NULL,
    ref_channel_id BIGINT NOT NULL,
    ref_guild_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#message-object-message-sticker-structure
CREATE TABLE message_sticker (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    sticker_index INT NOT NULL,
    sticker_id BIGINT NOT NULL,
    pack_id BIGINT NOT NULL,
    name VARCHAR(512) NOT NULL,
    description VARCHAR(512) NOT NULL,
    tags VARCHAR(512),
    asset VARCHAR(512) NOT NULL,
    preview_asset VARCHAR(512),
    format_type ENUM('PNG', 'APNG', 'LOTTIE') NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, sticker_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
CREATE TABLE message_embed (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    title VARCHAR(512),
    type ENUM('rich', 'image', 'video', 'gifv', 'article', 'link'),
    description VARCHAR(2048),
    url VARCHAR(2083),
    timestamp BIGINT,
    color INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
CREATE TABLE message_embed_author (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    name VARCHAR(512),
    url VARCHAR(2083),
    icon_url VARCHAR(2083),
    proxy_icon_url VARCHAR(2083),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
CREATE TABLE message_embed_field (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    field_index INT NOT NULL,
    name VARCHAR(512) NOT NULL,
    value VARCHAR(512) NOT NULL,
    inline BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index, field_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
CREATE TABLE message_embed_footer (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    text VARCHAR(2048) NOT NULL,
    icon_url VARCHAR(2083),
    proxy_icon_url VARCHAR(2083),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
CREATE TABLE message_embed_image (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    url VARCHAR(2083),
    proxy_url VARCHAR(2083),
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
CREATE TABLE message_embed_provider (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    name VARCHAR(512),
    url VARCHAR(2083),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
CREATE TABLE message_embed_thumbnail (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    url VARCHAR(2083),
    proxy_url VARCHAR(2083),
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);

-- https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
CREATE TABLE message_embed_video (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    url VARCHAR(2083),
    proxy_url VARCHAR(2083),
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
