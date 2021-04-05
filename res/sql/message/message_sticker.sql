-- https://discord.com/developers/docs/resources/channel#message-object-message-sticker-structure
CREATE TABLE message_sticker (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    sticker_index INT NOT NULL,
    sticker_id BIGINT NOT NULL,
    pack_id BIGINT NOT NULL,
    name VARCHAR(512) NOT NULL,
    description VARCHAR(512) NOT NULL,
    tags VARCHAR(512),
    asset VARCHAR(512) NOT NULL,
    preview_asset VARCHAR(512),
    format_type INT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, sticker_index),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
