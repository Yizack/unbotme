import { defineBuildConfig } from "unbuild";
import path from "path";

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
      "~": path.resolve(__dirname, "src"),
    },
    resolve: {
      browser: false
    },
    inlineDependencies: true
  },
  declaration: false
});
