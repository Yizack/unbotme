process.loadEnvFile();

const {
  TWITCH_CLIENT_ID,
  TWITCH_SECRET,
  TWITCH_BOT,
  TWITCH_BOT_ID,
  TWITCH_ACCESS_TOKEN,
  TWITCH_REFRESH_TOKEN,
  CLOUDFLARE_ACCOUNT,
  CLOUDFLARE_D1,
  CLOUDFLARE_AUTHORIZATION,
  WEBSOCKET_PORT,
  WEBSITE_ORIGIN
} = process.env;

export const useConfig = () => ({
  twitchClientId: TWITCH_CLIENT_ID,
  twitchSecret: TWITCH_SECRET,
  twitchBot: TWITCH_BOT,
  twitchBotId: TWITCH_BOT_ID,
  twitchAccessToken: TWITCH_ACCESS_TOKEN,
  twitchRefreshToken: TWITCH_REFRESH_TOKEN,
  cloudflareAccount: CLOUDFLARE_ACCOUNT,
  cloudflareD1: CLOUDFLARE_D1,
  cloudflareAuthorization: CLOUDFLARE_AUTHORIZATION,
  websocketPort: WEBSOCKET_PORT,
  websiteOrigin: WEBSITE_ORIGIN
});
