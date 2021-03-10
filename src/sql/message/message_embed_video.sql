-- https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
CREATE TABLE message_embed_video (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    url VARCHAR(256),                                                   -- Video url
    proxy_url VARCHAR(256),                                             -- Video proxy url
    height INT,                                                         -- Video height
    width INT,                                                          -- Video width
    primary key (epoch, id, pos)
);
