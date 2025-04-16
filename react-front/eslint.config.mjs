import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
      extends: ["next/core-web-vitals", "next/typescript"],
      rules: {
//       TODO: temp measure aiming for allowing for building not-quite ready image
          '@typescript-eslint/no-unused-vars': 'off'
          '@ts-expect-error': 'off'
      },
}),
];

export default eslintConfig;
