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
