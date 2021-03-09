-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-emoji
CREATE TABLE presence_activity_emoji (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    name VARCHAR(256) NOT NULL,
    emoji_id BIGINT,
    animated BOOLEAN,
    primary key (epoch, id, pos)
);
