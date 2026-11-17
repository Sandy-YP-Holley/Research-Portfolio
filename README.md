# Sandy Holley — Research & Insights

A personal portfolio for Sandy Yoga Prakasa Holley, focused on market, product, and data research. Built with React and Vite, with locally hosted fonts and custom SVG illustrations.

![Sandy Holley's research portfolio design preview](docs/portfolio-preview.png)

Website: https://sandy-yp-holley.github.io/Research-Portfolio/

## Develop

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

The development server binds to `0.0.0.0`, on port 5173 by default. Use the existing checkout in a cloud task; no additional Git worktree is needed.

## Build and validate

```sh
npm run build
npm run preview
npm test
```

`npm run build` generates `dist/` and refreshes the compiled `index.html`, `assets/`, `favicon.svg`, and `.nojekyll` at the repository root. Commit these generated files with source changes so Pages always serves a current build. Edit `src/index.html` for the HTML template; the root `index.html` is generated.

Browser tests serve the actual compiled repository files under `/Research-Portfolio/`, without Vite or a route fallback. This catches the blank-page failure caused by deploying raw JSX or broken asset URLs. Tests use `/usr/bin/chromium` when available. Else install Playwright's Chromium with `npx playwright install chromium`, or set `CHROMIUM_PATH` to an installed Chromium executable. Tests cover the research explorer, filters, modals, keyboard focus, approach sections, mobile navigation, clipboard, responsive layout, assets, and automated accessibility checks.

## Personalize

- `src/content.js` contains the name, optional email, LinkedIn URL, résumé URL, research interests, and approach text.
- Add contact details to `profile.email` and `profile.linkedIn` to activate the contact links. Until then, the page explicitly says contact details are coming soon.
- Put a résumé in `public/` and set `profile.resume` to its path to display the download link.
- The research cards describe interests and illustrative approaches, not completed projects. Replace them with verified case studies when project information is available. The hero plot uses illustrative data.
- Main page layout is in `src/main.jsx`; visual styles and responsive breakpoints are in `src/styles.css`. After editing, run `npm run build` and commit the refreshed root output too.

## Deploy

Deploy the generated `dist/` directory to any static host. No API keys, backend, external font requests, or database are required. Contact links use email and LinkedIn directly; no messages are collected by the site.

### GitHub Pages

Pages uses **Deploy from a branch → main → / (root)**. The repository root contains the compiled site, so GitHub can publish it directly without running Node.js or trying to interpret JSX. `.nojekyll` preserves the static output.

Push source changes and their rebuilt output to `main`. GitHub's **pages build and deployment** workflow publishes the site automatically. The separate **Validate portfolio for GitHub Pages** workflow checks the build and tests the static output; it does not compete with the branch deployment.

Relative asset URLs support both the `/Research-Portfolio/` repository path and root-level hosting.

To check the exact committed site locally:

```sh
npm run build
node tests/serve-pages.mjs
```

Open `http://127.0.0.1:4174/Research-Portfolio/`. `npm run preview` also serves the production build from `dist/` at the root path.
