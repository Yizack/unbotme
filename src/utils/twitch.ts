import { $fetch } from "ofetch";
import type { Broadcaster, TwitchRefreshResponse, TwitchChattersResponse } from "~/types";

class TwitchAPI {
  private client_id: string;
  private client_secret: string;

  constructor ({ client_id, client_secret }: { client_id: string, client_secret: string }) {
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  async refreshToken (refresh_token: Broadcaster["refresh_token"]): Promise<TwitchRefreshResponse | void> {
    const urlParams = new URLSearchParams({
      refresh_token,
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token",
    });

    const req = await $fetch(`https://id.twitch.tv/oauth2/token?${urlParams}`, {
      method: "POST"
    }).catch(() => null);
    if (!req) return;
    return req;
  }

  async getChatters (broadcaster: Broadcaster): Promise<TwitchChattersResponse[] | void> {
    const req = await $fetch(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${broadcaster.id_user}&moderator_id=${broadcaster.id_user}`, {
      headers: {
        "Authorization": `Bearer ${broadcaster.access_token}`,
        "Client-ID": this.client_id,
      }
    });
    if (!req) return;
    return req.data;
  }
}

export default new TwitchAPI({
  client_id: process.env.TWITCH_CLIENT_ID,
  client_secret: process.env.TWITCH_SECRET
});
