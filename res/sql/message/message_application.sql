-- https://discord.com/developers/docs/resources/channel#message-object-message-application-structure
CREATE TABLE message_application (
    epoch BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    application_id BIGINT NOT NULL,
    cover_image VARCHAR(512),
    description VARCHAR(512) NOT NULL,
    icon VARCHAR(512),
    name VARCHAR(512) NOT NULL,
    CONSTRAINT id PRIMARY KEY (epoch, message_id),
    FOREIGN KEY (epoch, message_id) REFERENCES message(epoch, message_id) ON DELETE CASCADE
);
