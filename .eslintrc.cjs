module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [{
    "files": ["*.vue", "*.js", "*.ts"],
    "rules": {
      "no-undef": "off"
    }
  }],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
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
    "@typescript-eslint/consistent-type-imports": "error",
  },
  "ignorePatterns": [
    "node_modules/**/*",
    ".nuxt/**/*",
    "dist/**/*",
    ".output/**/*"
  ]
};
