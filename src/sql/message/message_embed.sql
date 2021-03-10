-- https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
CREATE TABLE message_embed (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    title VARCHAR(256),                                                 -- Embed title
    type ENUM('rich', 'image', 'video', 'gifv', 'article', 'link'),     -- Embed type
    description VARCHAR(2048),                                          -- Embed description
    url VARCHAR(256),                                                   -- Embed url
    timestamp BIGINT,                                                   -- Embed timestamp
    color INT,                                                          -- Embed colour
    primary key (epoch, id, pos)
);
