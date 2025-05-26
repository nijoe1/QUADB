import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // .strict is a super set of recommended
  // ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      "dist",
      "node_modules",
      "ui-shadcn",
      ".next/**/*",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tailwind.configs["flat/recommended"],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "tailwindcss/enforces-shorthand": "off",
      // never used var disable
      "no-unused-vars": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/class-literal-property-style": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-undef": "off",
    },
  },
  eslintConfigPrettier
);
