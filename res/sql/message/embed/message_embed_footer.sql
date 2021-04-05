-- https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
CREATE TABLE message_embed_footer (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    embed_index INT NOT NULL,
    text VARCHAR(2048) NOT NULL,
    icon_url VARCHAR(2083),
    proxy_icon_url VARCHAR(2083),
    CONSTRAINT id PRIMARY KEY (epoch, message_id, embed_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
