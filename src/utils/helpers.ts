import type { D1User } from "~/types/cloudflare.js";
import type { Client } from "@twurple/auth-tmi";
import { consola } from "consola";
import { colors } from "consola/utils";
import { promises as fs } from "fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import * as dotenv from "dotenv";
import type { IncomingMessage, ServerResponse } from "http";

dotenv.config();

export const bot_id = process.env.TWITCH_BOT_ID;

const tokenData = JSON.parse(await fs.readFile(`./tokens.${bot_id}.json`, { encoding: "utf-8" }));

const authProvider = new RefreshingAuthProvider({
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_SECRET
});

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), { encoding: "utf-8" }));
await authProvider.addUserForToken(tokenData, ["chat"]);

export const options = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  channels: ["#" + process.env.TWITCH_BOT],
  authProvider
};

export const extractCommand = (message: string) => {
  return message.split(" ")[0].replace("!", "");
};

export function onConnected (address: string, port: number) {
  consola.success(`Connected to ${address}:${port}`);
}

export const joinChannels = async (client: Client, users: D1User[]) => {
  for (const user of users) {
    const joined = await client.join(user.user_login).catch(() => false);
    if (!joined) {
      consola.error(`❌ Couldn't join ${user.user_login}`);
      continue;
    }
    consola.success(colors.yellow(`🚪 Joined ${colors.white(user.user_login)} (${user.id_user})`));
  }
};

export const sendJsonResponse = (res: ServerResponse<IncomingMessage>, data: unknown) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};
