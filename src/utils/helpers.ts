import type { D1User } from "~/types/cloudflare.js";
import type { Client } from "@twurple/auth-tmi";
import { consola } from "consola";
import { colors } from "consola/utils";
import * as dotenv from "dotenv";

dotenv.config();

export const options = {
  identity: {
    username: "unbotme",
    password: "oauth:" + process.env.TWITCH_TOKEN
  },
  channels: ["unbotme"]
};

export const extractCommand = (message: string) => {
  return message.split(" ")[0].replace("!", "");
};

export function onConnected(address: string, port: number) {
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
