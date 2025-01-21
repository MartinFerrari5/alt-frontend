module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended", // Reglas específicas para TypeScript
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser", // Configuración para TypeScript
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }, // Para soportar JSX
  },
  settings: {
    react: { version: "18.2" },
  },
  plugins: [
    "react-refresh",
    "simple-import-sort",
    "@typescript-eslint", // Plugin para TypeScript
  ],
  rules: {
    "react/jsx-no-target-blank": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off", // No necesario al usar TypeScript
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ], // Ignorar variables y argumentos no usados que empiezan con "_"
    "@typescript-eslint/explicit-module-boundary-types": "off", // Opcional para funciones públicas
  },
};
