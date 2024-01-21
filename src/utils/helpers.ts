import type { CloudflareUser } from "~/types/cloudflare.js";
import type { Client } from "tmi.js";
import chalk from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

export const options = {
  identity: {
    username: "unbotme",
    password: process.env.TWITCH_TOKEN
  },
  channels: ["unbotme"]
};

export const extractCommand = (message: string) => {
  return message.split(" ")[0].replace("!", "");
};

export function onConnected(address: string, port: number) {
  console.info(`Connected to ${address}:${port}`);
}

export const joinChannels = async (client: Client, users: CloudflareUser[]) => {
  for (const user of users) {
    const joined = await client.join(user.user_login).catch(() => false);
    if (!joined) {
      console.info(`❌ Couldn't join ${user.user_login}`);
      continue;
    }
    console.info(chalk.yellow(`🚪 Joined ${user.user_login} (${user.id_user})`));
  }
};
