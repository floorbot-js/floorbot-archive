-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-emoji
CREATE TABLE presence_activity_emoji (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    name VARCHAR(512) NOT NULL,
    emoji_id BIGINT,
    animated BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id, activity_index) REFERENCES presence_activity(epoch, user_id, activity_index) ON DELETE CASCADE
);
