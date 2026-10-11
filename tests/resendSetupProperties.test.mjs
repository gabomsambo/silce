import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { after, test } from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = fileURLToPath(new URL("..", import.meta.url))
const transcripts = []

function runSetup(scenario) {
  const result = spawnSync(
    process.execPath,
    ["--import", new URL("./resend-fetch-stub.mjs", import.meta.url).href, "scripts/resend-setup-properties.mjs"],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        RESEND_KEY: "re_test_local_only",
        RESEND_STUB_SCENARIO: scenario,
      },
      encoding: "utf8",
    },
  )
  return {
    scenario,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  }
}

test("setup exits nonzero when an existing property has the wrong type and does not recreate it", () => {
  const result = runSetup("mismatch")
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Incompatible property locale: expected type=string, found type=number/)
  assert.doesNotMatch(result.stdout, /created:/)
  assert.doesNotMatch(result.stderr, /Failed to create/)
  transcripts.push(result)
})

test("setup leaves an already-correct account unchanged", () => {
  const result = runSetup("already-string")
  assert.equal(result.status, 0)
  assert.match(result.stdout, /skip: locale \(already declared\)/)
  assert.match(result.stdout, /skip: newsletter_interests \(already declared\)/)
  assert.match(result.stdout, /verified: locale type=string/)
  assert.match(result.stdout, /verified: newsletter_interests type=string/)
  assert.match(result.stdout, /No new properties created/)
  assert.doesNotMatch(result.stdout, /created:/)
  transcripts.push(result)
})

test("setup creates only missing string properties", () => {
  const result = runSetup("missing")
  assert.equal(result.status, 0)
  assert.match(result.stdout, /created: locale/)
  assert.match(result.stdout, /created: newsletter_interests/)
  assert.match(result.stdout, /verified: locale type=string/)
  assert.match(result.stdout, /verified: newsletter_interests type=string/)
  assert.match(result.stdout, /Created properties: locale, newsletter_interests/)
  transcripts.push(result)
})

after(() => {
  const directory = process.env.EVIDENCE_DIR
  if (!directory) return
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    `${directory}/resend-setup-properties.txt`,
    transcripts
      .map(
        (result) =>
          `=== ${result.scenario} (exit ${result.status}) ===\n${result.stdout}${result.stderr ? `\nstderr:\n${result.stderr}` : ""}`,
      )
      .join("\n"),
  )
})
