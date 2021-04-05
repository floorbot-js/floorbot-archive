-- https://discord.com/developers/docs/topics/gateway#client-status-object
CREATE TABLE presence_client_status (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    desktop ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    mobile ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    web ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE') NOT NULL,
    CONSTRAINT id PRIMARY KEY(epoch, user_id),
    FOREIGN KEY (epoch, user_id) REFERENCES presence(epoch, user_id) ON DELETE CASCADE
);
