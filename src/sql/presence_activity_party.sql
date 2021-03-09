-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-party
CREATE TABLE presence_activity_party (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    party_id VARCHAR(256),
    current_size INT,
    max_size INT,
    primary key (epoch, id, pos)
);
