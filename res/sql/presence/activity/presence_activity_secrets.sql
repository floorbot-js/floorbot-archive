-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-secrets
CREATE TABLE presence_activity_secrets (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    join_secret VARCHAR(512),
    spectate_secret VARCHAR(512),
    match_secret VARCHAR(512),
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id, activity_index) REFERENCES presence_activity(epoch, user_id, activity_index) ON DELETE CASCADE
);
