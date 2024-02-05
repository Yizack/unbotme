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
SSH_HOST="SERER_IP"
SSH_USERNAME="SERER_NAME"
SSH_PASSWORD="SERVER_PASSWORD"
GH_TOKEN="GITHUB_PERSONAL_ACCESS_TOKEN"
PORT="80"
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

Create a json file in your project's root folder named `tokens.<BOT_ID>.json`

```json
{
  "accessToken": "YOUR_ACCESS_TOKEN",
  "refreshToken": "YOUR_REFRESH_TOKEN",
  "expiresIn": 0,
  "obtainmentTimestamp": 0
}
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
