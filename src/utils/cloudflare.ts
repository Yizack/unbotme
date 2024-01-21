import { $fetch } from "ofetch";
import type { CloudflareAPIOptions, CloudflareSQLResponse, CloudflareUser } from "~/types/cloudflare.js";

class CloudflareAPI {
  private readonly base_url: string = "https://api.cloudflare.com/client/v4";
  private account_identifier: string;
  private database_identifier: string;
  private authorization: string;

  constructor (options: CloudflareAPIOptions) {
    this.account_identifier = options.account_identifier;
    this.database_identifier = options.database_identifier;
    this.authorization = options.authorization;
  }

  async query (query: string, bindings?: unknown[]) {
    const req: CloudflareSQLResponse = await $fetch(`${this.base_url}/accounts/${this.account_identifier}/d1/database/${this.database_identifier}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.authorization}`,
        "Content-Type": "application/json"
      },
      body: {
        sql: query,
        params: bindings
      }
    }).catch(() => null);
    if (!req) return null;
    return req.result[0].results;
  }

  async getActiveUsers () {
    const users = await this.query("SELECT id_user, user_login, token FROM users WHERE active = ?", [1]);
    if (!users) return null;
    return users as CloudflareUser[];
  }
}

export default new CloudflareAPI({
  account_identifier: process.env.CLOUDFLARE_ACCOUNT,
  database_identifier: process.env.CLOUDFLARE_D1,
  authorization: process.env.CLOUDFLARE_AUTHORIZATION
});
