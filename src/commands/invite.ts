import type { Client, ChatUserstate } from "tmi.js";
import chalk from "chalk";

export const inviteToChannel = async (client: Client, target: string, context: ChatUserstate) => {
  const user = {
    username: context.username,
    id: context["user-id"]
  };

  const joined = await client.join(user.username).catch(() => false);
  // TODO use DB to track channels we've joined
  if (!joined) {
    console.info(`Couldn't join ${user.username}`);
    client.say(target, `@${user.username} I couldn't join your channel, sorry!`);
    return;
  }
  console.info(chalk.yellow(`🚪 Joined ${user.username} (${user.id})`));
  client.say(target, `@${user.username} I joined your channel, type /mod in your chat so I can do my duty!`);
};
