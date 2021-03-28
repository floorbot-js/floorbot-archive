-- -- DROP ALL TABLES IN ORDER
-- DROP TABLE typing_start;

-- https://discord.com/developers/docs/topics/gateway#typing-start-typing-start-event-fields
CREATE TABLE typing_start (
    epoch BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT,
    user_id BIGINT NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, channel_id, user_id)
);
