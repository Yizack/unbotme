import type { Client } from "tmi.js";
import { options } from "~/utils/helpers";
import TwitchAPI from "~/utils/twitch";
import botslist from "~/data/botslist";
import goodbots from "~/data/goodbots";
import chalk from "chalk";

const broadcasters = [];

export const banBots = async (client: Client) => {
  const interval = 1 * 10 * 1000;
  await banBotHandler(client);
  setInterval(() => banBotHandler(client), interval);
};

async function banBotHandler (client: Client) {
  for (const channel of client.getChannels()) {
    const channel_name = channel.replace("#", "");
    if (channel_name === options.identity.username) continue;
    if (!broadcasters.some((broadcaster) => broadcaster.name === channel_name)) {
      const user_id = await TwitchAPI.getUserId(channel_name);
      broadcasters.push({ name: channel_name, id: user_id });
    }
    console.info(chalk.green(`🤖 Banning bots in ${chalk.white(channel)}...`));
    const user_id = broadcasters.find((broadcaster) => broadcaster.name === channel_name).id;
    const chatters = await TwitchAPI.getChatters(user_id);
    if (!chatters) continue;
    for (const chatter of chatters) {
      const { user_login } = chatter;
      if (goodbots.includes(user_login)) continue;
      if (botslist.includes(user_login)) {
        console.info(chalk.blue(`....🔨 Banning ${chalk.white(user_login)} in ${chalk.white(channel)}`));
        // client.ban(channel, user_login, "Bot");
      }
    }
  }
}
