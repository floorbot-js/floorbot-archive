-- https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
CREATE TABLE message_embed_field (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    field_index INT NOT NULL,
    name VARCHAR(512) NOT NULL,
    value VARCHAR(512) NOT NULL,
    inline BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index, field_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
