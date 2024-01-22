import { defineBuildConfig } from "unbuild";
import path from "path";

export default defineBuildConfig({
  clean: true,
  alias: {
    "~": path.resolve(__dirname, "src"),
  },

  entries: [
    "./src/unbotme.ts",
  ],

  // Change outDir, default is 'dist'
  outDir: "build",

  // Generates .d.ts declaration file
  declaration: "compatible",
  externals: [
    "@types/node",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "nodemon",
    "pm2",
    "ts-node",
    "tsconfig-paths",
    "typescript",
    "unbuild"
  ],
});
