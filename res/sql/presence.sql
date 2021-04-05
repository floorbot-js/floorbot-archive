-- https://discord.com/developers/docs/topics/gateway#presence-update
CREATE TABLE presence (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    status ENUM('IDLE', 'DND', 'ONLINE', 'OFFLINE') NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, user_id)
);
