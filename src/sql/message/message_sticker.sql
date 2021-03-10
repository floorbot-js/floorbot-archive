CREATE TABLE message_sticker (
    epoch BIGINT NOT NULL,
    id BIGINT NOT NULL,
    pos INT NOT NULL,
    sticker_id BIGINT NOT NULL,
    pack_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(1024) NOT NULL,
    tags VARCHAR(1024),
    asset VARCHAR(256) NOT NULL,
    preview_asset VARCHAR(256),
    format_type ENUM('PNG', 'APNG', 'LOTTIE') NOT NULL,
    primary key (epoch, id, sticker_id)
);
