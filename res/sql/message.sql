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
    type INT NOT NULL,
    flags INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id)
);
