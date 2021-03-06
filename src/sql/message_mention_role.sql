CREATE TABLE message_mention_role (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    role_id BIGINT NOT NULL,
    primary key (epoch, id, pos, role_id)
);
