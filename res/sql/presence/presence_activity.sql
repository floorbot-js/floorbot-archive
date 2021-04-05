-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-structure
CREATE TABLE presence_activity (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_index INT NOT NULL,
    name VARCHAR(512) NOT NULL,
    type INT NOT NULL,
    activity_id VARCHAR(512),
    url VARCHAR(2083),
    created_at BIGINT NOT NULL,
    application_id BIGINT,
    details VARCHAR(512),
    state VARCHAR(512),
    instance BOOLEAN NOT NULL,
    flags INT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, activity_index),
    FOREIGN KEY (epoch, user_id) REFERENCES presence(epoch, user_id) ON DELETE CASCADE
);
