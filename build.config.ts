import path from "path";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  entries: [
    "./src/unbotme.ts"
  ],
  outDir: "build",
  rollup: {
    esbuild: {
      target: "es2022",
      minify: true
    },
    alias: {
      entries: [
        {
          find: "~",
          replacement: path.resolve(__dirname, "src")
        }
      ]
    },
    resolve: {
      browser: false
    },
    inlineDependencies: true
  },
  declaration: false
});
