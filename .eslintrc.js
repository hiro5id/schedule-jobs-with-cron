module.exports = {
  root: true,
  ignorePatterns: ["**/*d.ts"],
  parserOptions: {
    "tsconfigRootDir": process.cwd(),
    "project": ['./tsconfig.json'],
    "createDefaultProgram": true
  },
  rules: {
    "@typescript-eslint/no-floating-promises": ["error", { "ignoreVoid": true }],
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "vars": "all",
      "args": "all",
      "ignoreRestSiblings": false,
      "caughtErrors": "all"
    }],
    "unicorn/no-unused-properties": "error",
    "unicorn/error-message": "error",
    "unicorn/expiring-todo-comments": "error",
    "unicorn/no-abusive-eslint-disable": "error",
    "unicorn/no-new-buffer": "error",
    "unicorn/no-unreadable-array-destructuring": "error",
    "unicorn/no-unsafe-regex": "error",
    "unicorn/number-literal-case": "error",
    "unicorn/throw-new-error": "error"
  },
  env: {
    "es6": true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
      "@typescript-eslint",
      "unicorn"
  ]
}
