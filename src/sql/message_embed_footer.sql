-- https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
CREATE TABLE message_embed_footer (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    text VARCHAR(2048) NOT NULL,                                        -- Footer text
    icon_url VARCHAR(256),                                              -- Footer icon url
    proxy_icon_url VARCHAR(256),                                        -- Footer proxy icon url
    primary key (epoch, id, pos)
);
