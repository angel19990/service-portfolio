import Link from 'next/link'

/**
 * `Angelika. Cheng` — the period is the only accent mark in the chrome.
 *
 * The string is authored in `siteSettings.wordmark`, so the split happens at
 * render rather than being hardcoded: the editor can rename the site without a
 * deploy, and a name with no period simply renders without an accent.
 *
 * Prata italic at the body tier — 17px at 375, 20px at 1440, which is exactly the
 * two sizes the frames carry.
 *
 * `leading-[1.35]` survives every family swap unchanged: it was originally picked
 * because it matched Prata's auto line-height, but an *explicit* line-height
 * computes off font-size alone, so the line box — and therefore the bar heights
 * of 16+23+16 = 55 at 375 and 20+27+20 = 67 at 1440 — is family-independent.
 *
 * No `font-semibold` and no negative tracking: both were Inter's. Prata ships a
 * single 400 cut, so a weight above that is synthesised, and the slant is
 * synthesised too — stacking a fake bold on a fake oblique smears a high-contrast
 * serif. The serif and the slant are already what separate this from the nav
 * links, which is the job the weight used to do.
 */
export function Wordmark({ value = '', className = '' }: { value?: string; className?: string }) {
  const at = value.indexOf('.')
  const [head, tail] = at === -1 ? [value, ''] : [value.slice(0, at), value.slice(at + 1)]

  return (
    <Link
      href="/"
      // `whitespace-nowrap`: the footer row wraps its link list now, and without
      // this the wordmark is the thing that breaks instead — "Angelika" over
      // "Cheng" at 375.
      /*
       * `py-3 -my-3` is a hit area, not spacing. The line box is 23px tall at 375,
       * which is one pixel under WCAG 2.2's 24px minimum target — and this is the
       * home link, in the header and the footer, on every page. The padding takes
       * the tappable box to 47px and the equal negative margin gives the height
       * straight back to the flex row, so the 55/67px bar does not move.
       */
      className={`-my-3 inline-block whitespace-nowrap py-3 font-display text-body leading-[1.35] italic text-accent ${className}`}
      aria-label={`${value.replace('.', '')}, home`}
    >
      {head}
      {at !== -1 && <span className="text-accent">.</span>}
      {tail}
    </Link>
  )
}
