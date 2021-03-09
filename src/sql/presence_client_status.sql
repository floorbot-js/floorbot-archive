-- https://discord.com/developers/docs/topics/gateway#client-status-object
CREATE TABLE presence_client_status (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    desktop ENUM('ONLINE', 'IDLE', 'DND'),
    mobile ENUM('ONLINE', 'IDLE', 'DND'),
    web ENUM('ONLINE', 'IDLE', 'DND'),
    primary key (epoch, id)
);
