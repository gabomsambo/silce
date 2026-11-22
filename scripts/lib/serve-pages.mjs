// Serve the built site (`npm run pages:build` -> .open-next/) the way Cloudflare
// Pages does: static files plus the Functions under functions/, via
// `wrangler pages dev`. `next start` cannot serve a static export, and a plain
// file server would not reproduce Pages' URL handling (`/en` -> en.html,
// `/en/` -> 308 `/en`) or the Functions.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const wranglerBin = path.join(
  path.dirname(require.resolve('wrangler/package.json')),
  'bin/wrangler.js',
);

/** Starts wrangler on `port`; returns a `stop()` that reaps its process group. */
export function startPagesServer(port) {
  const child = spawn(
    process.execPath,
    [
      wranglerBin,
      'pages',
      'dev',
      '.open-next',
      '--port',
      String(port),
      '--ip',
      '127.0.0.1',
      '--compatibility-date=2024-09-23',
      '--compatibility-flag=nodejs_compat',
    ],
    {
      stdio: ['ignore', 'ignore', 'inherit'],
      detached: true,
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' },
    },
  );
  console.log(`Started wrangler pages dev on port ${port} (pid ${child.pid})`);
  return () => {
    if (!child.pid) return;
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      child.kill('SIGTERM');
    }
  };
}
