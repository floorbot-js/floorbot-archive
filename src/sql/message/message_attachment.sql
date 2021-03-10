-- https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
CREATE TABLE message_attachment (
    epoch BIGINT NOT NULL,                                              -- Message version timestamp
    id BIGINT NOT NULL,                                                 -- Message id
    pos INT NOT NULL,                                                   -- Attachment index
    attachment_id BIGINT NOT NULL,                                      -- Attachment id
    filename VARCHAR(256) NOT NULL,                                     -- Attachment filename
    size INT NOT NULL,                                                  -- Attachment size
    url VARCHAR(256) NOT NULL,                                          -- Attachment url
    proxy_url VARCHAR(256) NOT NULL,                                    -- Attachment proxy url
    height INT,                                                         -- Image height
    width INT,                                                          -- Image width
    primary key (epoch, id, attachment_id)
);
