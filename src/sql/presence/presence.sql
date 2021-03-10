-- https://discord.com/developers/docs/topics/gateway#presence-update
CREATE TABLE presence (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    -- [ommited] user
    guild_id BIGINT NOT NULL,
    -- [ommited] game
    status ENUM('IDLE', 'DND', 'ONLINE', 'OFFLINE') NOT NULL,
    -- [structure] activities
    -- [structure] client_status
    primary key (epoch, id)
);
