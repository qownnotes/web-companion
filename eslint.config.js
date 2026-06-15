import prettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".devenv/**",
      ".direnv/**",
      ".quasar/**",
      "bin/**",
    ],
  },
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{js,vue}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Node.js globals
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        chrome: "readonly",
        alert: "readonly",
        confirm: "readonly",
        // Vue/Webpack globals
        Vue: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
];
