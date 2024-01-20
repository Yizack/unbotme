import { $fetch } from "ofetch";
import { options } from "~/utils/helpers";

class TwitchAPI {
  private headers: Record<string, string>;

  constructor ({ client_id, oauth_token }: { client_id: string, oauth_token: string }) {
    this.headers = {
      "Authorization": `Bearer ${oauth_token}`,
      "Client-ID": client_id,
    };
  }

  async getUserId (username: string) {
    const req = await $fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: this.headers
    });
    if (!req) return null;
    return Number(req.data[0].id) as number;
  }

  async getChatters (broadcaster_id: number) {
    const req = await $fetch(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${broadcaster_id}&moderator_id=1021164206`, {
      headers: this.headers
    });
    if (!req) return null;
    return req.data as Array<{ user_id: string, user_login: string, user_name: string }>;
  }
}

export default new TwitchAPI({
  client_id: process.env.CLIENT_ID,
  oauth_token: options.identity.password
});
