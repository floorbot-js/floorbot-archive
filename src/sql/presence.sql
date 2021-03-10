-- -- DROP ALL TABLES IN ORDER
-- DROP TABLE presence_activity_assets;
-- DROP TABLE presence_activity_emoji;
-- DROP TABLE presence_activity_party;
-- DROP TABLE presence_activity_secrets;
-- DROP TABLE presence_activity_timestamps;
-- DROP TABLE presence_activity;
-- DROP TABLE presence_client_status;
-- DROP TABLE presence;

-- https://discord.com/developers/docs/topics/gateway#presence-update
CREATE TABLE presence (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    status ENUM('IDLE', 'DND', 'ONLINE', 'OFFLINE') NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, user_id)
);

-- https://discord.com/developers/docs/topics/gateway#client-status-object
CREATE TABLE presence_client_status (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    desktop ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    mobile ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    web ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    CONSTRAINT id PRIMARY KEY(epoch, user_id),
    FOREIGN KEY (epoch, user_id) REFERENCES presence(epoch, user_id)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-structure
CREATE TABLE presence_activity (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    name VARCHAR(256) NOT NULL,
    type ENUM('GAME', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING') NOT NULL,
    activity_id VARCHAR(256),
    url VARCHAR(256),
    created_at BIGINT NOT NULL,
    application_id BIGINT,
    details VARCHAR(256),
    state VARCHAR(256),
    instance BOOLEAN NOT NULL,
    flags INT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id) REFERENCES presence(epoch, user_id)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-timestamps
CREATE TABLE presence_activity_timestamps (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    start BIGINT,
    end BIGINT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id, pos) REFERENCES presence_activity(epoch, user_id, pos)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-secrets
CREATE TABLE presence_activity_secrets (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    join_secret VARCHAR(256),
    spectate_secret VARCHAR(256),
    match_secret VARCHAR(256),
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id, pos) REFERENCES presence_activity(epoch, user_id, pos)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-party
CREATE TABLE presence_activity_party (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    party_id VARCHAR(256),
    current_size INT,
    max_size INT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id, pos) REFERENCES presence_activity(epoch, user_id, pos)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-emoji
CREATE TABLE presence_activity_emoji (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    name VARCHAR(256) NOT NULL,
    emoji_id BIGINT,
    animated BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id, pos) REFERENCES presence_activity(epoch, user_id, pos)
);

-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets
CREATE TABLE presence_activity_assets (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    pos INT NOT NULL,
    large_image VARCHAR(256),
    large_text VARCHAR(256),
    small_image VARCHAR(256),
    small_text VARCHAR(256),
    CONSTRAINT id PRIMARY KEY(epoch, user_id, pos),
    FOREIGN KEY (epoch, user_id, pos) REFERENCES presence_activity(epoch, user_id, pos)
);
