import type { LoginResult, D1User } from "~/types";
import { createServer } from "http";
import { Server } from "socket.io";
import * as tmi from "tmi.js";
import * as cron from "~/crons/banbots";
import * as cmd from "~/commands";
import { options, onConnected, extractCommand, joinChannels } from "~/utils/helpers";
import CloudflareAPI from "~/utils/cloudflare";

const server = createServer((req, res) => {
  res.end("Hello World!");
});

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const broadcasters: D1User[] = [];

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
  socket.on("login", async (result: LoginResult) => {
    const broadcaster: D1User = {
      id_user: Number(result.user.id),
      user_login: result.user.login,
      token: result.tokens.access_token
    };
    broadcasters.push(broadcaster);
    await joinChannels(client, [broadcaster]);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.info(`Socket open, port ${port}`);
});
