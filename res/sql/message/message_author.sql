-- https://discord.com/developers/docs/resources/user#user-object-user-structure
CREATE TABLE message_author (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    username VARCHAR(512) NOT NULL,
    author_id BIGINT NOT NULL,
    discriminator VARCHAR(4) NOT NULL,
    avatar VARCHAR(512) NOT NULL,
    public_flags INT,
    bot BOOLEAN NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
