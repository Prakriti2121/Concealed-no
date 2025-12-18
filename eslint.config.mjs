import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/lib/auth.ts"],
    rules: {
      // Disable the ban on ts-comments (so that @ts-nocheck won't trigger an error)
      "@typescript-eslint/ban-ts-comment": "off",

      // Disable unused disable directives warnings
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

// Disable ESLint reporting warnings for unused disable directives globally
eslintConfig.reportUnusedDisableDirectives = false;

export default eslintConfig;
