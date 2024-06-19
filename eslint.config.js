import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended
    ],
    ignores: [
      "node_modules/**/*",
      "build/**/*",
      "dist/**/*",
      ".output/**/*",
      "**/*d.ts",
    ],
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.eslintRecommended.rules,
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "linebreak-style": ["error", "windows"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "camelcase": "off",
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "no-console": ["error", {
        "allow": ["info", "warn"]
      }],
      "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
      "no-multi-spaces": "error",
      "space-before-blocks": "error",
      "no-trailing-spaces": "error",
      "@typescript-eslint/consistent-type-imports": "error"
    }
  }
);
