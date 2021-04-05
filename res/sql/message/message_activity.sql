-- https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
CREATE TABLE message_activity (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    type INT NOT NULL,
    party_id VARCHAR(512),
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
