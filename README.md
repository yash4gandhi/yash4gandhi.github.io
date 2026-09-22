# Yash Gandhi — portfolio

Multipage AI engineering and research portfolio for https://yash4gandhi.github.io/.
Built with dependency-free Node.js and progressive browser JavaScript.

## Local development

Use Node.js 22 or newer. No dependency installation is required.

```sh
node scripts/build.mjs
node --test tests/*.test.mjs
node scripts/serve.mjs
```

Open http://127.0.0.1:4321/ after starting the server. If that address is already
in use, stop the other portfolio preview first. Always serve the generated
`dist/` directory, not the repository root.

## Source layout

- `src/`: project content, styles, interactions and explanatory animations.
- `scripts/`: static builder and local preview server.
- `public/`: selected public figures, licensed fonts, landmark photo and résumé.
- `content/writing/`: Markdown writing workflow; no posts are published yet.
- `tests/`: build, navigation and interaction checks.

Only intentionally public content belongs in this repository. A blog draft
excluded from the website build is still public if committed to a public
repository. Keep private drafts outside the repository.

Research figures retain their axes, scale bars and attribution. Demonstrations
distinguish conceptual animations and fictional examples from saved research
results. The tourist photo is credited on its project page, and font licenses
are included with the fonts. No private manuscripts or source archives are
required to build the site.

## Publishing status

This branch prepares the new portfolio for review. The existing root
`index.html` is the previous website and is temporarily preserved during
migration; the new homepage is generated as `dist/index.html`.

The current GitHub Actions workflow builds, tests and saves an artifact only.
It does not deploy. GitHub Pages deployment from `dist/`, removal of the legacy
root page, and compatibility for the old stock-page URL remain migration steps
before the redesign is merged. Analytics is not installed yet.

Future updates should use a feature branch and a pull request into `main`.
Once deployment is configured, merging a passing PR will publish the update.
Do not merge this migration branch until that configuration has been reviewed.

## Demonstration limitations

The site performs no live model inference. YouTube recordings have direct
links and a lazy embedded player with loading/error fallbacks; full embedded
playback remains to be checked on the final hosting environment. Additional
personal content, blog posts, live landmark inference and a separate commerce
application are deferred.
