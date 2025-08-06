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
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Desactivar completamente la regla
      "no-unused-vars": "off", // Desactivar la regla de ESLint base
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "react/no-unescaped-entities": "off" // Desactivar la regla de comillas no escapadas
    }
  }
];

export default eslintConfig;
