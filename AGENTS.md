# Portfolio maintenance

- Preserve the approved editorial design and AI Engineer identity across
  domains, explicitly including science. Do not restart content intake.
- Read README.md and inspect existing source before making changes. Project
  descriptions use Summary, without separate contribution sections.
- Keep the fixed hero headline and four-category carousel, with pause/manual
  controls and reduced-motion behavior.
- Retain project-specific demonstrations, keyboard/touch access, readable
  static states, lazy media loading and no autoplay audio.
- Do not invent metrics, model internals, acceptance status or deployment
  claims. Distinguish schematic animations, prepared examples and actual
  saved results. Preserve collaborator credit and figure axes/scale bars.
- No private materials, manuscripts, source archives, credentials or private
  drafts belong in this public repository. Copy only explicitly selected
  public assets. No live model or bank API calls are needed.
- Build with `node scripts/build.mjs`; run `node --test tests/*.test.mjs`.
  Check desktop/mobile and relevant keyboard/demo behavior for UI changes.
- Work on a feature branch and prepare a pull request for review. Do not
  merge, push or deploy unless authorized. The current workflow is build-only;
  migration is not yet ready to merge. See README.md.
- The historical root index.html is not the new site's source. The builder
  produces the new homepage and all routes under dist/.
