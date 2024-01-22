import { promises as fs } from "fs";
import type { LoginResult, Broadcaster, D1User } from "~/types";
import { createServer } from "http";
import { Server } from "socket.io";
import { client as tmi } from "@twurple/auth-tmi";
import { RefreshingAuthProvider } from "@twurple/auth";
import { options, onConnected, /*extractCommand,*/ joinChannels } from "~/utils/helpers";
import CloudflareAPI from "~/utils/cloudflare";
import * as cron from "~/crons/banbots";
// import * as cmd from "~/commands";
import { consola } from "consola";

const server = createServer((req, res) => {
  res.end("Hello World!");
});

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const broadcasters: Broadcaster[] = [];

const tokenData = JSON.parse(await fs.readFile("./tokens.1021164206.json", { encoding: "utf-8" }));

const authProvider = new RefreshingAuthProvider({
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_SECRET,
});

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), { encoding: "utf-8" }));
await authProvider.addUserForToken(tokenData, ["chat"]);

const client = new tmi({
  ...options,
  authProvider,
});

client.on("message", async (target, context, message, self) => {
  if (self || !message.startsWith("!")) return;
  /*
  const command = extractCommand(message);

  switch (command) {
    add commands
  }
  */
});

client.on("connected", async (address: string, port: number) => {
  onConnected(address, port);
  const users = await CloudflareAPI.getActiveUsers();
  if (users) {
    broadcasters.push(...users.map((user: D1User) => ({
      id_user: Number(user.id_user),
      user_login: user.user_login,
      refresh_token: user.refresh_token,
      access_token: null,
      refresh_count: 0
    })));

    await joinChannels(client, users);
    cron.banBots(client, broadcasters);
  }
});

client.connect();

io.on("connection", (socket) => {
  socket.on("login", async (user: LoginResult) => {
    const broadcaster: Broadcaster = {
      id_user: Number(user.id),
      user_login: user.login,
      access_token: user.tokens.access_token,
      refresh_token: user.tokens.refresh_token,
      refresh_count: 0
    };

    const index = broadcasters.findIndex((b) => b.id_user === broadcaster.id_user);
    if (index >= 0) {
      broadcasters[index].access_token = broadcaster.access_token;
      broadcasters[index].refresh_token = broadcaster.refresh_token;
      broadcasters[index].refresh_count = broadcaster.refresh_count;
    }
    else {
      broadcasters.push(broadcaster);
      await joinChannels(client, [broadcaster]);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  consola.success(`Socket open, port ${port}`);
});
