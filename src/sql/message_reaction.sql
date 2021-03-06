-- https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
CREATE TABLE message_reaction (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT,
    emoji_name VARCHAR(256) NOT NULL,
    emoji_id BIGINT NOT NULL,
    emoji_animated BOOLEAN,
    action ENUM('ADD', 'REMOVE') NOT NULL,
    primary key (epoch, id, emoji_name, emoji_id)
);
