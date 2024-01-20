import { options, onConnected, extractCommand } from "~/utils/helpers";
import * as cron from "~/crons/banbots";
import * as cmd from "~/commands";
import * as tmi from "tmi.js";

const client = new tmi.client(options);

cron.banBots(client);

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

client.on("connected", onConnected);

client.connect();
