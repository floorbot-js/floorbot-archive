-- https://discord.com/developers/docs/topics/gateway#activity-object-activity-secrets
CREATE TABLE presence_activity_secrets (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    join_secret VARCHAR(256),
    spectate_secret VARCHAR(256),
    match_secret VARCHAR(256),
    primary key (epoch, id, pos)
);
