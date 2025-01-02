import { $fetch } from "ofetch";
import type { Broadcaster, TwitchRefreshResponse, TwitchChattersResponse } from "~/types";
import { bot_id, options } from "~/utils/helpers";
import { useConfig } from "./config";

class TwitchAPI {
  private client_id: string;
  private client_secret: string;

  constructor ({ client_id, client_secret }: { client_id: string | undefined, client_secret: string | undefined }) {
    if (!client_id || !client_secret) {
      throw new Error("Missing Twitch credentials");
    }
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  async refreshToken (refresh_token: Broadcaster["refresh_token"]): Promise<TwitchRefreshResponse | void> {
    const urlParams = new URLSearchParams({
      refresh_token,
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token"
    });

    const req = await $fetch(`https://id.twitch.tv/oauth2/token?${urlParams}`, {
      method: "POST"
    }).catch(() => null);
    if (!req) return;
    return req;
  }

  async getChatters (broadcaster: Broadcaster): Promise<TwitchChattersResponse[] | void> {
    const req = await $fetch(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${broadcaster.id_user}&moderator_id=${broadcaster.id_user}&first=1000`, {
      headers: {
        "Authorization": `Bearer ${broadcaster.access_token}`,
        "Client-ID": this.client_id
      }
    }).catch(() => null);
    if (!req) return;
    return req.data;
  }

  async banUser (broadcaster_id: number, data: { user_id: string, reason: string }): Promise<void> {
    const access_token = (await options.authProvider.getAccessTokenForUser(bot_id!))?.accessToken;
    await $fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${broadcaster_id}&moderator_id=${bot_id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Client-ID": this.client_id
      },
      body: { data }
    }).catch(() => null);
  }
}

const {
  twitchClientId,
  twitchSecret
} = useConfig();

export default new TwitchAPI({
  client_id: twitchClientId,
  client_secret: twitchSecret
});
