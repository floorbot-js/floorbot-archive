CREATE TABLE message_mention_user (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    user_id BIGINT NOT NULL,
    primary key (epoch, id, pos, user_id)
);
