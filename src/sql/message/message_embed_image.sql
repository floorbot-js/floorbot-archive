-- https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
CREATE TABLE message_embed_image (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    url VARCHAR(256),                                                   -- Image url
    proxy_url VARCHAR(256),                                             -- Image proxy url
    height INT,                                                         -- Image height
    width INT,                                                          -- Image width
    primary key (epoch, id, pos)
);
