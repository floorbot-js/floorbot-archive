CREATE TABLE message_delete (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT,
    primary key (id)
);
