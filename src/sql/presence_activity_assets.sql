-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets
CREATE TABLE presence_activity_assets (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    large_image VARCHAR(256),
    large_text VARCHAR(256),
    small_image VARCHAR(256),
    small_text VARCHAR(256),
    primary key (epoch, id, pos)
);
