import { createServer } from "http";
import { Server } from "socket.io";
import { client as tmi } from "@twurple/auth-tmi";
import { consola } from "consola";
import { useConfig } from "./utils/config";
import { joinChannels, onConnected, options, sendJsonResponse } from "~/utils/helpers";
import CloudflareAPI from "~/utils/cloudflare";
import * as cron from "~/crons/banbots";
// import * as cmd from "~/commands";
import type { Broadcaster, D1User, JoinResult, LeaveResult } from "~/types";

const { websiteOrigin, websocketPort } = useConfig();

const server = createServer((req, res) => {
  const endpoints = {
    "/api/botslist": () => sendJsonResponse(res, cron.botslist),
    "/api/goodbots": () => sendJsonResponse(res, cron.goodbots),
    "/api/badbots": () => sendJsonResponse(res, cron.badbots),
    "/": () => res.writeHead(301, { Location: websiteOrigin }) && res.end()
  };
  const handler = endpoints[req.url as keyof typeof endpoints] || endpoints["/"];
  handler();
});

const io = new Server(server, {
  cors: {
    origin: websiteOrigin
  }
});

const broadcasters: Broadcaster[] = [];

const client = new tmi(options);

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
      refresh_count: 10
    })));

    await joinChannels(client, users);
    cron.banBots(client, broadcasters);
  }
});

client.connect();

io.on("connection", (socket) => {
  socket.on("join", async (user: JoinResult) => {
    const broadcaster: Broadcaster = {
      id_user: Number(user.id),
      user_login: user.login,
      access_token: user.tokens.access_token,
      refresh_token: user.tokens.refresh_token,
      refresh_count: 0
    };

    const index = broadcasters.findIndex(b => b.id_user === broadcaster.id_user);
    if (index >= 0 && broadcasters[index]) {
      broadcasters[index].access_token = broadcaster.access_token;
      broadcasters[index].refresh_token = broadcaster.refresh_token;
      broadcasters[index].refresh_count = broadcaster.refresh_count;
    }
    else {
      broadcasters.push(broadcaster);
      await joinChannels(client, [broadcaster]);
    }
  });

  socket.on("leave", async (user: LeaveResult) => {
    const index = broadcasters.findIndex(b => b.id_user === Number(user.id_user));
    if (index >= 0) {
      broadcasters.splice(index, 1);
      await client.part(user.username);
    }
  });
});

const port = websocketPort || 3000;
server.listen(port, () => {
  consola.success(`Socket open, port ${port}`);
});
