import { $fetch } from "ofetch";
import type { CloudflareAPIOptions, CloudflareSQLResponse, D1User } from "~/types/cloudflare.js";

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

  private async query (query: string, bindings?: unknown[]): Promise<Record<string, unknown>[] | void> {
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
    if (!req) return;
    return req.result[0].results;
  }

  async getActiveUsers (): Promise<D1User[] | void> {
    const users = await this.query("SELECT id_user, user_login, refresh_token FROM users WHERE active = ?", [1]);
    if (!users) return;
    return users as D1User[];
  }

  async updateRefreshToken (id_user: number, refresh_token: string): Promise<void> {
    const today = Date.now();
    await this.query("UPDATE users SET refresh_token = ? AND updated_at = ? WHERE id_user = ?", [refresh_token, today, id_user]);
  }

  async inactivateUser (id_user: number): Promise<void> {
    const today = Date.now();
    await this.query("UPDATE users SET active = ? AND updated_at = ? WHERE id_user = ?", [0, today, id_user]);
  }
}

if (!process.env.CLOUDFLARE_ACCOUNT || !process.env.CLOUDFLARE_D1 || !process.env.CLOUDFLARE_AUTHORIZATION) {
  throw new Error("Missing Cloudflare credentials");
}

export default new CloudflareAPI({
  account_identifier: process.env.CLOUDFLARE_ACCOUNT,
  database_identifier: process.env.CLOUDFLARE_D1,
  authorization: process.env.CLOUDFLARE_AUTHORIZATION
});
