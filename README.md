# Portfolio (0SL3C)

Static SvelteKit site deployed to GitHub Pages at https://0SL3C.github.io/Portfolio

- repos.json is generated on a schedule by GitHub Actions and committed to static/data/repos.json
- Cards use GitHub repo OpenGraph image and fallback to owner avatar

## Local dev

- npm i
- npm run dev

## Manual data refresh

- GITHUB_USERNAME=0SL3C npm run fetch:repos

## Deploy

- Pushing to main builds and deploys to Pages with adapter-static
