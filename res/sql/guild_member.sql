-- -- DROP ALL TABLES IN ORDER
-- DROP TABLE guild_member;
-- DROP TABLE guild_member_user;
-- DROP TABLE guild_member_role;

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

-- https://discord.com/developers/docs/resources/user#user-object-user-structure
CREATE TABLE guild_member_user (
    epoch BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    username VARCHAR(512) NOT NULL,
    discriminator VARCHAR(4) NOT NULL,
    avatar VARCHAR(512),
    bot BOOLEAN NOT NULL,
    system BOOLEAN NOT NULL,
    mfa_enabled BOOLEAN,
    locale VARCHAR(512),
    verified BOOLEAN,
    email VARCHAR(512),
    flags INT,
    premium_type INT,
    public_flags INT,
    CONSTRAINT id PRIMARY KEY(epoch, user_id, guild_id),
    FOREIGN KEY (epoch, user_id, guild_id) REFERENCES guild_member(epoch, user_id, guild_id) ON DELETE CASCADE
);

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
