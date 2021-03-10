-- https://discord.com/developers/docs/resources/channel#message-object-message-structure
CREATE TABLE message (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    guild_id BIGINT,
    channel_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    timestamp BIGINT NOT NULL,
    edited_timestamp BIGINT,
    tts BOOLEAN NOT NULL,
    mention_everyone BOOLEAN NOT NULL,
    -- [ommited] reactions
    -- [ommited] nonce
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
    -- [ommited] activity
    -- [ommited] application
    flags INT,
    -- [structure] stickers
    -- [ommited] referenced_message
    primary key (epoch, id)
);
