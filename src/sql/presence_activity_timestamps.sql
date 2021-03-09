-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-timestamps
CREATE TABLE presence_activity_timestamps (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    start BIGINT,
    end BIGINT,
    primary key (epoch, id, pos)
);
