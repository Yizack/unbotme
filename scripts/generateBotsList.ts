import { $fetch } from "ofetch";
import { writeFileSync } from "fs";
import type { twitchInsightsList } from "../src/types/scripts.js";

const sources = {
  twitchInsights: {
    url: "https://api.twitchinsights.net/v1/bots/all",
    bots: []
  },
  streamCharts: {
    url: "https://streamscharts.com/tools/bots",
    bots: []
  },
};

sources.twitchInsights.bots = await getTwitchInsightsBots();
writeFileSync("./src/data/botslist.ts", `export default ${JSON.stringify(sources.twitchInsights.bots)};`);

async function getTwitchInsightsBots () {
  // example of response [ 'slocool', 26012, 1565348543 ]
  const response: twitchInsightsList = await $fetch(sources.twitchInsights.url).catch(() => null);
  if (!response) return [];
  return response.bots.map((bot) => bot[0]);
}
