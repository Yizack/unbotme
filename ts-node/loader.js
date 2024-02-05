/*
Usage (I'm also using dotenv, but you can omit the dotenv parts if needed):
DOTENV_CONFIG_PATH=.env node -r dotenv/config --loader=./loader.js /bin/path/to/cli.ts
*/
import { pathToFileURL } from "node:url";
import { getFormat, load, resolve as resolveTs, transformSource } from "ts-node/esm";
import * as tsConfigPaths from "tsconfig-paths";

export { getFormat, transformSource, load };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

const getURL = (specifier) => {
  return specifier.startsWith("file:") ? specifier : pathToFileURL(specifier.toString()).toString();
};

export async function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);
  if (mappedSpecifier) {
    specifier = `${mappedSpecifier}.js`;

    if (mappedSpecifier.endsWith(".json")) {
      return resolveTs(getURL(mappedSpecifier), context, defaultResolver);
    }

    /*
    the resolve functionality can only work with file URLs, so we need to convert, this is especially
    the case on windows, where the path might not be a valid URL.
    */
    let resolved = null;

    try {
      resolved = await resolveTs(getURL(specifier), context, defaultResolver);
    }
    catch (e) {
      specifier = `${mappedSpecifier}/index.js`;
      resolved = await resolveTs(getURL(specifier), context, defaultResolver);
    }
    return resolved;
  }
  else {
    // If we can't find a mapping, just pass it on to the default resolver
    return resolveTs(specifier, context, defaultResolver);
  }
}
