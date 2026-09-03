/**
 * Wordmark.
 *
 * `tone` picks the surface the wordmark sits on. It exists because the
 * wordmark is rendered on both the white navbar and the near-black
 * (`bg-primary`, #1a1a1a) footer: a single hardcoded palette makes it
 * invisible on one of them. "SILVER" was `text-primary` on both, which on the
 * footer is #1a1a1a on #1a1a1a — 1.00:1, literally invisible.
 *
 * dark  (light surface): #1a1a1a "SILVER" (17.40:1 on white) + tan-ink
 *                        "PINEAPPLE" (5.13:1 on white)
 * light (dark surface):  white "SILVER" (17.40:1 on #1a1a1a) + tan
 *                        "PINEAPPLE" (8.82:1 on #1a1a1a)
 */
export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const silver = tone === "light" ? "text-white" : "text-primary"
  const pineapple = tone === "light" ? "text-tan" : "text-tan-ink"

  return (
    <div className="flex items-center">
      <div className="text-2xl font-bold tracking-tight">
        <span className={silver}>SILVER</span>
        <span className={pineapple}>PINEAPPLE</span>
      </div>
    </div>
  )
}
