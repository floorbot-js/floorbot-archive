-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-timestamps
CREATE TABLE presence_activity_timestamps (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    start BIGINT,
    end BIGINT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id, activity_index) REFERENCES presence_activity(epoch, user_id, activity_index) ON DELETE CASCADE
);
