import type { Client } from "tmi.js";
import type { CloudflareUser } from "~/types/cloudflare";
import { options } from "~/utils/helpers";
import TwitchAPI from "~/utils/twitch";
import botslist from "~/data/botslist";
import goodbots from "~/data/goodbots";
import chalk from "chalk";

export const banBots = async (client: Client, broadcasters: CloudflareUser[]) => {
  const interval = 1 * 10 * 1000;
  await banBotHandler(client, broadcasters);
  setInterval(() => banBotHandler(client, broadcasters), interval);
};

async function banBotHandler (client: Client, broadcasters: CloudflareUser[]) {
  for (const channel of client.getChannels()) {
    const channel_name = channel.replace("#", "");
    if (channel_name === options.identity.username) continue;
    console.info(chalk.green(`🤖 Banning bots in ${chalk.white(channel)}...`));
    const user = broadcasters.find((broadcaster) => broadcaster.user_login === channel_name);
    const chatters = await TwitchAPI.getChatters(user);
    if (!chatters) continue;
    for (const chatter of chatters) {
      const { user_login } = chatter;
      if (goodbots.includes(user_login)) continue;
      if (botslist.includes(user_login)) {
        console.info(chalk.blue(`...🔨 Banning ${chalk.white(user_login)} in ${chalk.white(channel)}`));
        // client.ban(channel, user_login, "Bot");
      }
    }
  }
}
