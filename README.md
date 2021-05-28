# floorbot-archive

An archive bot for tracking user and guild data

### Useful Commands

```bash
> git clone https://github.com/floorbot-js/floorbot-archive  ## Cloning the repository
> npm install git://github.com/floorbot-js/floorbot-archive  ## Installing the repository
```

### Environment Variables

These booru environment variabes are _optional_ and can be added with a `.env` file with the following format.

```dosini
# .env.example, committed to repo

DISCORD_TOKEN = <Discord Token>
DISCORD_PUBLIC_KEY = <Discord Public Key>

DB_HOST = <Database IP>
DB_NAME = <Database Name>
DB_USERNAME = <Database Username>
DB_PASSWORD = <Database Password>
```

## Archivers Progress

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
