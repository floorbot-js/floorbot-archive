-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-structure
CREATE TABLE presence_activity (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    name VARCHAR(256) NOT NULL,
    type ENUM('GAME', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING') NOT NULL,
    activity_id VARCHAR(256),
    url VARCHAR(256),
    created_at BIGINT NOT NULL,
    -- [structure] timestamps
    application_id BIGINT,
    details VARCHAR(256),
    state VARCHAR(256),
    -- [structure] emoji
    -- [structure] party
    -- [structure] assets
    -- [structure] secrets
    instance BOOLEAN,
    flags INT,
    primary key (epoch, id, pos)
);
