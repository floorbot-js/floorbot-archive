-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets
CREATE TABLE presence_activity_assets (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    large_image VARCHAR(512),
    large_text VARCHAR(512),
    small_image VARCHAR(512),
    small_text VARCHAR(512),
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id, activity_index) REFERENCES presence_activity(epoch, user_id, activity_index) ON DELETE CASCADE
);
