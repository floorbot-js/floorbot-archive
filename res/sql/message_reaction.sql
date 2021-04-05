-- https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
CREATE TABLE message_reaction (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT,
    emoji_name VARCHAR(512) NOT NULL,
    emoji_id BIGINT NOT NULL,
    emoji_animated BOOLEAN NOT NULL,
    action ENUM('ADD', 'REMOVE') NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id, emoji_name, emoji_id)
);
