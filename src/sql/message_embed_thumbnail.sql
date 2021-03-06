-- https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
CREATE TABLE message_embed_thumbnail (
    id BIGINT NOT NULL,                                                 -- Message id
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    pos INT NOT NULL,                                                   -- Embed index
    url VARCHAR(256),                                                   -- Thumbnail url
    proxy_url VARCHAR(256),                                             -- Thumbnail proxy url
    height INT,                                                         -- Thumbnail height
    width INT,                                                          -- Thumbnail width
    primary key (epoch, id, pos)
);
