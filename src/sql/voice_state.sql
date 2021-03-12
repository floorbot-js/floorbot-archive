-- -- DROP ALL TABLES IN ORDER
-- DROP TABLE voice_state;

-- https://discord.com/developers/docs/resources/voice#voice-state-object
CREATE TABLE voice_state (
    epoch BIGINT NOT NULL,
    guild_id BIGINT,
    channel_id BIGINT,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(512) NOT NULL,
    deaf BOOLEAN NOT NULL,
    mute BOOLEAN NOT NULL,
    self_deaf BOOLEAN NOT NULL,
    self_mute BOOLEAN NOT NULL,
    self_stream BOOLEAN NOT NULL,
    self_video BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch)
);
