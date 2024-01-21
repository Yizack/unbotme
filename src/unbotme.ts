import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as tmi from "tmi.js";
import * as cron from "~/crons/banbots";
import * as cmd from "~/commands";
import { options, onConnected, extractCommand, joinChannels } from "~/utils/helpers";
import type { CloudflareUser } from "./types/cloudflare";
import CloudflareAPI from "~/utils/cloudflare";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

const broadcasters: CloudflareUser[] = [];

const client = new tmi.client(options);
cron.banBots(client, broadcasters);

client.on("message", async (target, context, message, self) => {
  if (self || !message.startsWith("!")) return;

  const command = extractCommand(message);

  switch (command) {
  // Invite command
  case "invite":
    if (target !== "#" + options.identity.username) return;
    await cmd.inviteToChannel(client, target, context);
    break;
  }
});

client.on("connected", async (address: string, port: number) => {
  onConnected(address, port);
  const users = await CloudflareAPI.getActiveUsers();
  if (users) {
    broadcasters.push(...users);
    await joinChannels(client, users);
  }
});

client.connect();

io.on("connection", (socket) => {
  socket.on("login", (user: CloudflareUser) => {
    console.info(user);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.info(`Socket open, port ${port}`);
});
