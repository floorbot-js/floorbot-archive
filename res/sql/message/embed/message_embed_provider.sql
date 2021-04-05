-- https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
CREATE TABLE message_embed_provider (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    name VARCHAR(512),
    url VARCHAR(2083),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
