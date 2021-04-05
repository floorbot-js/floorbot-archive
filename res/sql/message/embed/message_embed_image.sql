-- https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
CREATE TABLE message_embed_image (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    url VARCHAR(2083),
    proxy_url VARCHAR(2083),
    height INT,
    width INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
