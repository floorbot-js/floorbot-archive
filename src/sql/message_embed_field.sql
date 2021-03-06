-- https://discord.com/developers/docs/resources/channel#embed-limits
CREATE TABLE message_embed_field (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Embed index
    field_pos INT NOT NULL,                                             -- Field index
    name VARCHAR(256) NOT NULL,                                         -- Field name
    value VARCHAR(1024) NOT NULL,                                       -- Field value
    inline BOOLEAN,                                                     -- Field inline
    primary key (epoch, id, pos, field_pos)
);
