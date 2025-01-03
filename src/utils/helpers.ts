import type { D1User } from "~/types/cloudflare.js";
import type { Client } from "@twurple/auth-tmi";
import { consola } from "consola";
import { colors } from "consola/utils";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { RefreshingAuthProvider } from "@twurple/auth";
import type { IncomingMessage, ServerResponse } from "http";
import CloudflareAPI from "~/utils/cloudflare";
import { useConfig } from "./config";

const {
  twitchClientId,
  twitchSecret,
  twitchBot,
  twitchBotId,
  twitchAccessToken,
  twitchRefreshToken
} = useConfig();

if (!twitchClientId || !twitchSecret || !twitchBot) {
  throw new Error("Missing Twitch credentials");
}

if (!twitchAccessToken || !twitchRefreshToken) {
  throw new Error("Missing Twitch authentication tokens");
}

const tokensDir = join(process.cwd(), "tokens");

await mkdir(tokensDir, { recursive: true }).catch((e) => {
  console.warn(e);
  process.exit(1);
});

const defaultTokenData = {
  accessToken: twitchAccessToken,
  refreshToken: twitchRefreshToken,
  expiresIn: 0,
  obtainmentTimestamp: 0
};

export const bot_id = twitchBotId;

const authProvider = new RefreshingAuthProvider({
  clientId: twitchClientId,
  clientSecret: twitchSecret
});

authProvider.onRefresh(async (userId, newTokenData) => await writeFile(`${tokensDir}/${userId}.json`, JSON.stringify(newTokenData, null, 4), { encoding: "utf-8" }));
await authProvider.addUserForToken(defaultTokenData, ["chat"]);

export const options = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  channels: ["#" + twitchBot],
  authProvider
};

export const extractCommand = (message: string) => {
  return message.split(" ")[0]?.replace("!", "");
};

export function onConnected (address: string, port: number) {
  consola.success(`Connected to ${address}:${port}`);
}

export const joinChannels = async (client: Client, users: D1User[]) => {
  for (const user of users) {
    const joined = await client.join(user.user_login).catch(() => false);
    if (!joined) {
      consola.error(`❌ Couldn't join ${user.user_login}`);
      CloudflareAPI.inactivateUser(user.id_user);
      continue;
    }
    consola.success(colors.yellow(`🚪 Joined ${colors.white(user.user_login)} (${user.id_user})`));
  }
};

export const sendJsonResponse = (res: ServerResponse<IncomingMessage>, data: unknown) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};
