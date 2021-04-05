-- https://discord.com/developers/docs/resources/user#user-object-user-structure
CREATE TABLE guild_member_role (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    role_index INT NOT NULL,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, guild_id),
    FOREIGN KEY (epoch, user_id, guild_id) REFERENCES guild_member(epoch, user_id, guild_id) ON DELETE CASCADE
);
