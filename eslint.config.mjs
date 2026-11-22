import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

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
  ...nextCoreWebVitals,
  {
    rules: {
      // Pre-existing violations across components that predate this config.
      // Kept visible as warnings rather than deleted, so the config passes on
      // the current tree without a sweeping cosmetic refactor. Fix opportunistically.
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      // Added by eslint-config-next 16 (React Compiler-derived checks). They flag
      // existing component patterns (setState in effects, ref reads during render,
      // components defined in render); fixing them changes component behaviour, so
      // they stay visible as warnings until someone owns that refactor.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];

export default config;
