-- https://discord.com/developers/docs/resources/user#user-object-user-structure
CREATE TABLE message_author (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    username VARCHAR(256) NOT NULL,
    author_id BIGINT NOT NULL,
    discriminator VARCHAR(4) NOT NULL,
    avatar VARCHAR(256) NOT NULL,
    public_flags INT,
    bot BOOLEAN,
    primary key (epoch, id)
);
