# floorbot-archive

An archive bot for tracking user and guild data

## Archivers

These are the different archivers and the events they track

-   **Guild Member**
    -   [x] `GUILD_MEMBER_UPDATE`
-   **Message**
    -   [x] `MESSAGE_CREATE`
    -   [x] `MESSAGE_UPDATE`
    -   [ ] ~~`CHANNEL_PINS_UPDATE`~~ (`MESSAGE_UPDATE` covers this)
-   **Message Delete**
    -   [x] `MESSAGE_DELETE`
    -   [x] `MESSAGE_DELETE_BULK`
-   **Message Reaction**
    -   [x] `MESSAGE_REACTION_ADD`
    -   [x] `MESSAGE_REACTION_REMOVE`
    -   [x] `MESSAGE_REACTION_REMOVE_ALL`
    -   [x] `MESSAGE_REACTION_REMOVE_EMOJI`
-   **Presence**
    -   [x] `PRESENCE_UPDATE`
-   **Typing**
    -   [x] `TYPING_START`
-   **Voice State**
    -   [x] `VOICE_STATE_UPDATE`
-   **Channel**
    -   [ ] `CHANNEL_CREATE`
    -   [ ] `CHANNEL_UPDATE`
    -   [ ] `CHANNEL_DELETE`
    -   [ ] `CHANNEL_PINS_UPDATE` (`CHANNEL_UPDATE` may cover this)
-   **Role**
    -   [ ] `GUILD_ROLE_CREATE`
    -   [ ] `GUILD_ROLE_UPDATE`
    -   [ ] `GUILD_ROLE_DELETE`
-   **Guild Ban**
    -   [ ] `GUILD_BAN_ADD`
    -   [ ] `GUILD_BAN_REMOVE`
-   **_Add more if/when required_**
