CREATE TABLE message_message_reference (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    primary key (epoch, id)
);
