import * as tmi from "tmi.js";
import * as cron from "~/crons/banbots";
import * as cmd from "~/commands";
import { options, onConnected, extractCommand, joinChannels } from "~/utils/helpers";
import CloudflareAPI from "~/utils/cloudflare";

const broadcasters = [];

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
  broadcasters.push(...users);
  await joinChannels(client, users);
});

client.connect();
