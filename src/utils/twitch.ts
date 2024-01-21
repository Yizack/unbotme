import { $fetch } from "ofetch";
import type { CloudflareUser } from "~/types/cloudflare";

class TwitchAPI {
  private client_id: string;

  constructor (client_id: string) {
    this.client_id = client_id;
  }

  async getChatters (user: CloudflareUser) {
    const req = await $fetch(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${user.id_user}&moderator_id=${user.id_user}`, {
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Client-ID": this.client_id,
      }
    });
    if (!req) return null;
    return req.data as Array<{ user_id: string, user_login: string, user_name: string }>;
  }
}

export default new TwitchAPI(process.env.CLIENT_ID);
