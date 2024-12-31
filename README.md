# unbotme

Twitch bot for banning malicious bot accounts

## Environment variables

```sh
TWITCH_BOT="TWITCH_BOT_USERNAME"
TWITCH_BOT_ID="TWITCH_BOT_USER_ID"
TWITCH_CLIENT_ID="TWITCH_CLIENT_ID"
TWITCH_SECRET="TWITCH_CLIENT_SECRET"
CLOUDFLARE_AUTHORIZATION="CLOUDFLARE_API_TOKEN"
CLOUDFLARE_D1="CLOUDFLARE_DATABASE_ID"
CLOUDFLARE_ACCOUNT="CLOUDFLARE_ACCOUNT_ID"
PORT="PORT"
ORIGIN="https://YOUR_SOCKET"
```

## Authentication scopes

### Scopes for bot

- `channel:moderate`
- `chat:edit`
- `chat:read`
- `moderator:manage:banned_users`
- `user:read:email`

### Scopes for users

- `moderator:read:chatters`
- `user:read:email`

## Auto refreshing bot tokens

Authenticate to obtain your first time tokens.

```
https://id.twitch.tv/oauth2/token?client_id=TWITCH_CLIENT_ID&client_secret=TWITCH_CLIENT_SECRET&grant_type=client_credentials
```

```sh
TWITCH_ACCESS_TOKEN="TWITCH_ACCESS_TOKEN"
TWITCH_REFRESH_TOKEN="TWITCH_REFRESH_TOKEN"
```

## Bots list used
- https://api.twitchinsights.net/v1/bots/all


## Development

```sh
# generate bot list if needed
pnpm botslist

# start bot using nodemon
pnpm dev
```

## Build for production

```sh
# build using unbuild
pnpm build

# start bot using node
pnpm start

# or start bot using pm2
pnpm add pm2 -g
pnpm start:pm2
```
