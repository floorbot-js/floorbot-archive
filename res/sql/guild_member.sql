-- https://discord.com/developers/docs/topics/gateway#guild-member-update-guild-member-update-event-fields
CREATE TABLE guild_member (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    nick VARCHAR(512),
    joined_at BIGINT NOT NULL,
    premium_since BIGINT,
    pending BOOLEAN,
    CONSTRAINT id PRIMARY KEY (epoch, user_id, guild_id)
);
