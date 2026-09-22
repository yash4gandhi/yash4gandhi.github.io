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

## Publishing

In the repository's Settings → Pages, select GitHub Actions as the source.
The `Portfolio checks and deployment` workflow builds and tests pull requests
targeting `main`. Pull requests do not deploy or receive hosted previews.

After a merge into `main`, the workflow builds and tests again, packages only
`dist/`, and publishes it through the `github-pages` environment. A failed
build or test prevents deployment. The workflow also supports a manual rerun
on `main`; running it on any other branch only builds and tests.

The homepage is generated as `dist/index.html`; there is no handwritten root
homepage. The legacy stock page is removed; the current stock project lives
at `/work/stock-research/`. Private materials and repository source are never
included in the Pages artifact.

For future updates, create a feature branch, edit and test, commit and push,
then open a pull request into `main`. Review its `Build and test` check before
merging. Merging publishes the update automatically. Repository branch rules
can require this check before merging; those rules are configured separately
in GitHub settings. See docs/ANALYTICS.md for the optional analytics setup.

## Demonstration limitations

The site performs no live model inference. YouTube recordings have direct
links and a lazy embedded player with loading/error fallbacks; full embedded
playback remains to be checked on the final hosting environment. Additional
personal content, blog posts, live landmark inference and a separate commerce
application are deferred.
