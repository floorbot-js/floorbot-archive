-- https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
CREATE TABLE message_embed_author (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed pos
    name VARCHAR(256),                                                  -- Author name
    url VARCHAR(256),                                                   -- Author url
    icon_url VARCHAR(256),                                              -- Author icon url
    proxy_icon_url VARCHAR(256),                                        -- Author proxy icon url
    primary key (epoch, id, pos)
);
