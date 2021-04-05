-- https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
CREATE TABLE message_attachment (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    attachment_index INT NOT NULL,
    attachment_id BIGINT NOT NULL,
    filename VARCHAR(512) NOT NULL,
    size INT NOT NULL,
    url VARCHAR(2083) NOT NULL,
    proxy_url VARCHAR(2083) NOT NULL,
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, attachment_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
