import { $fetch } from "ofetch";
import { writeFileSync } from "fs";
import type { twitchInsightsList } from "../src/types/scripts.js";
import { consola } from "consola";

consola.start("Updating bots list");

const sources = {
  twitchInsights: {
    url: "https://api.twitchinsights.net/v1/bots/all",
    bots: [] as string[]
  },
  streamCharts: {
    url: "https://streamscharts.com/tools/bots",
    bots: [] as string[]
  }
};

sources.twitchInsights.bots = await getTwitchInsightsBots();
writeFileSync("./src/data/botslist.json", JSON.stringify(sources.twitchInsights.bots));
consola.success(`Bots list updated. Bots count: ${sources.twitchInsights.bots.length}.`);

async function getTwitchInsightsBots () {
  // example of response [ 'slocool', 26012, 1565348543 ]
  const response: twitchInsightsList = await $fetch(sources.twitchInsights.url).catch(() => null);
  if (!response) return [];
  return response.bots.map((bot) => bot[0]);
}
