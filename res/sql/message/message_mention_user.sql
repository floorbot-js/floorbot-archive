CREATE TABLE message_mention_user (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    mention_index INT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, mention_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
