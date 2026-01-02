export default [
  {
    files: ["web/**/*.js", "web/**/*.vue"],
    languageOptions: {
      ecmaVersion: 2020,
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
        alert: "readonly",
        confirm: "readonly",
        // Vue/Webpack globals
        Vue: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "web/node_modules/**",
      "web/dist/**",
      "web/build/**",
      "web/public/**",
      ".devenv/**",
      ".direnv/**",
      "bin/**",
    ],
  },
];
