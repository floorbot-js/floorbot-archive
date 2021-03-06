CREATE TABLE message_mention_special (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    type ENUM('EVERYONE', 'HERE'),
    primary key (epoch, id, pos, type)
);
