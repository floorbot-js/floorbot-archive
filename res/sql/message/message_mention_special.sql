CREATE TABLE message_mention_special (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    type ENUM('EVERYONE', 'HERE'),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
