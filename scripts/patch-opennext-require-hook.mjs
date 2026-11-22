// Widen @opennextjs/cloudflare's `require-hook` shim so it also matches the bare
// `next/dist/server/require-hook` specifier. Run by `pages:build` before the
// adapter builds.
//
// Why: the adapter swaps Next's `require-hook` for an empty module because the real
// one runs `require("module").prototype.require` at load. Its esbuild filter only
// matches the relative `./require-hook`. Next 16.4's
// `build/adapter/setup-node-env.external.js` (pulled in by every precompiled
// `*.runtime.prod.js`) requires it by the bare package path, so the real hook was
// bundled. Cloudflare Pages' production runtime has a `node:module` with no
// `prototype`, so every request threw "Cannot read properties of undefined
// (reading 'require')" (HTTP 500). Newer local workerd (what `wrangler pages dev`
// runs) does have `Module.prototype`, which is why local emulation passed.
//
// Idempotent. Fails loudly when the adapter changes shape, so a version bump
// forces a re-check instead of silently shipping the unshimmed hook. Remove this
// script once the adapter shims the bare specifier upstream.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const target = fileURLToPath(
  new URL(
    "../node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/require-hook.js",
    import.meta.url,
  ),
);

// The filter regex source as written in the adapter (inside a String.raw template).
const before = "^\\./require-hook$";
const after = "^(\\./|next/dist/server/)require-hook$";

const source = readFileSync(target, "utf8");
if (source.includes(after)) {
  console.log("patch-opennext-require-hook: already applied");
} else if (source.includes(before)) {
  writeFileSync(target, source.replace(before, after));
  console.log("patch-opennext-require-hook: applied");
} else {
  console.error(
    `patch-opennext-require-hook: expected filter not found in ${target}.\n` +
      "The adapter changed; check whether it now shims next/dist/server/require-hook " +
      "itself and delete this script, or update it.",
  );
  process.exit(1);
}
