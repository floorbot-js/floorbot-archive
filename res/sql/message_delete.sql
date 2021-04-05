-- https://discord.com/developers/docs/topics/gateway#message-delete-message-delete-event-fields
CREATE TABLE message_delete (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT,
    CONSTRAINT id PRIMARY KEY (message_id)
);
