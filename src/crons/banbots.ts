import type { Client } from "@twurple/auth-tmi";
import type { Broadcaster } from "~/types";
import { options } from "~/utils/helpers";
import CloudflareAPI from "~/utils/cloudflare";
import TwitchAPI from "~/utils/twitch";
import botslist from "~/data/botslist";
import goodbots from "~/data/goodbots";
import { consola } from "consola";
import { colors } from "consola/utils";

export const banBots = async (client: Client, broadcasters: Broadcaster[]) => {
  const interval = 15 * 60 * 1000; // 15 min monitoring
  await banBotHandler(client, broadcasters);
  setInterval(() => banBotHandler(client, broadcasters), interval);
};

async function banBotHandler (client: Client, broadcasters: Broadcaster[]) {
  for (const channel of client.getChannels()) {
    if (channel === options.channels[0]) continue;
    const channel_name = channel.replace("#", "");
    const i = broadcasters.findIndex((broadcaster) => broadcaster.user_login === channel_name);
    if (!broadcasters[i].access_token || broadcasters[i].refresh_count >= 10) {
      const refreshRequest = await TwitchAPI.refreshToken(broadcasters[i].refresh_token);
      if (!refreshRequest) {
        consola.error(colors.redBright(`Failed to refresh token for ${colors.white(broadcasters[i].user_login)}`));
        CloudflareAPI.inactivateUser(broadcasters[i].id_user);
        continue;
      }
      broadcasters[i].access_token = refreshRequest.access_token;
      broadcasters[i].refresh_token = refreshRequest.refresh_token;
      broadcasters[i].refresh_count = 0;

      if (broadcasters[i].refresh_token !== refreshRequest.refresh_token) {
        consola.info(colors.yellow(`Updating refresh token for ${colors.white(broadcasters[i].user_login)}`));
        await CloudflareAPI.updateRefreshToken(broadcasters[i].id_user, broadcasters[i].refresh_token);
      }
    }
    const chatters = await TwitchAPI.getChatters(broadcasters[i]);
    if (!chatters) continue;
    broadcasters[i].refresh_count++;
    consola.start(colors.green(`🤖 Banning bots in ${colors.white(channel)}...`));
    for (const chatter of chatters) {
      const { user_login, user_id } = chatter;
      if (goodbots.includes(user_login)) continue;
      if (botslist.includes(user_login)) {
        consola.info(colors.blue(`...🔨 Banning ${colors.white(user_login)} in ${colors.white(channel)}`));
        await TwitchAPI.banUser(broadcasters[i].id_user, { user_id, reason: "Malicious bot detected" });
      }
    }
  }
}
