-- https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
CREATE TABLE message_embed (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    title VARCHAR(512),
    type ENUM('rich', 'image', 'video', 'gifv', 'article', 'link'),
    description VARCHAR(2048),
    url VARCHAR(2083),
    timestamp BIGINT,
    color INT,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
