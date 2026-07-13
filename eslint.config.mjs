import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Desactivar completamente la regla
    "no-unused-vars": "off", // Desactivar la regla de ESLint base
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "warn",
    "react/no-unescaped-entities": "off" // Desactivar la regla de comillas no escapadas
  }
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
