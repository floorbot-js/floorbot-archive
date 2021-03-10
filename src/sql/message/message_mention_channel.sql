CREATE TABLE message_mention_channel (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    channel_id BIGINT NOT NULL,
    primary key (epoch, id, pos, channel_id)
);
