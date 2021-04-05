-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-party
CREATE TABLE presence_activity_party (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    party_id VARCHAR(512),
    current_size INT,
    max_size INT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id, activity_index) REFERENCES presence_activity(epoch, user_id, activity_index) ON DELETE CASCADE
);
