-- https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
CREATE TABLE message_embed_provider (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    name VARCHAR(256),                                                  -- Provider name
    url VARCHAR(256),                                                   -- Provider url
    primary key (epoch, id, pos)
);
