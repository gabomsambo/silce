import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'node_modules/**',
      'public/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Pre-existing violations across components that predate this config.
      // Kept visible as warnings rather than deleted, so the config passes on
      // the current tree without a sweeping cosmetic refactor. Fix opportunistically.
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-sync-scripts': 'warn',
    },
  },
];

export default config;
