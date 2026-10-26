# 🌸 sakura garden
## A GitHub contributions garden for your README

Turn your GitHub activity into a garden where commits bloom into flowers 🌸 and empty days stay green 🌿

<a href="https://sakura-garden.vercel.app" target="_blank" rel="noopener">
<picture>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=dark" media="(prefers-color-scheme: dark)" width="846" height="132" style="height:auto"/>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" media="(prefers-color-scheme: light)" width="846" height="132" style="height:auto"/>
  <img src="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" width="846" height="132" style="height:auto" loading="eager"/>
</picture>
</a>

See your garden here: https://sakura-garden.vercel.app

## Features
- 🌸 Transforms your GitHub contributions into a beautiful garden
- :octocat: Updates automatically based on your GitHub activity
- 🌗 Automatically matches light or dark mode — no need to pick one
- 📱 Looks good on desktop and mobile
- ⚡ Easy to integrate into any README or portfolio
- 💻 Dedicated [website](https://sakura-garden.vercel.app) to generate and view your garden
- 🎬 Flowers bloom in one by one when the image loads

## ⚡ Quick Setup

1. Go to https://sakura-garden.vercel.app  
2. Enter your GitHub username  
3. Copy the garden
4. Paste into your README
5. Commit and push

## 🔧 Manual Setup
1. Copy the code below  
```markdown
<a href="https://sakura-garden.vercel.app" target="_blank" rel="noopener">
  <picture>
    <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=dark" media="(prefers-color-scheme: dark)" width="846" height="132" style="height:auto"/>
    <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" media="(prefers-color-scheme: light)" width="846" height="132" style="height:auto"/>
    <img src="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" width="846" height="132" style="height:auto"/>
  </picture>
</a>
```
2. Replace `your-github-username` with your GitHub username
3. Paste into your README

## 🚀 Advanced Setup

1. Create `.github/workflows/sakura-garden.yml`
2. Copy the code below
```yaml
name: Sakura Garden

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - '.github/workflows/sakura-garden.yml'

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Generate sakura garden
        uses: a104437ana/sakura-garden@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout --orphan output
          git add sakura-garden.svg sakura-garden-dark.svg
          git commit -m "Update sakura garden" || exit 0
          git push -f origin output
```
3. Paste into the file you just created
4. Copy the code below
```markdown
<a href="https://sakura-garden.vercel.app" target="_blank" rel="noopener">
  <picture>
    <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden-dark.svg" media="(prefers-color-scheme: dark)" width="846" height="132" style="height:auto"/>
    <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" media="(prefers-color-scheme: light)" width="846" height="132" style="height:auto"/>
    <img src="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" width="846" height="132" style="height:auto"/>
  </picture>
</a>
```
5. Replace `your-github-username` with your GitHub username
6. Paste into your README

⚠️ The garden may take a minute to appear after the workflow runs for the first time, but after that it will always be there and update automatically every day based on your GitHub activity

## API
You can also hit the API directly to generate the image, without going through the site:

`https://sakura-garden.vercel.app/api/svg?username=YOUR_USERNAME&theme=dark|light|auto|auto-green|kawaii|kawaii-dark&animate=true|false&levels=true|false&labels=true|false`

- `username` — your GitHub username
- `theme` — `dark`, `light`, `auto`, `auto-green`, `kawaii`, or `kawaii-dark`
  - `auto`/`auto-green` are single images that read fine on both light and dark backgrounds, no `<picture>`/`<source>` needed (`auto` uses a translucent pink outline for empty days, `auto-green` uses solid green)
  - `kawaii`/`kawaii-dark` are a second garden type with a cuter, more saturated palette — candy-mint empty days and a tighter, more vivid pink-to-rose flower ramp in light mode; `kawaii-dark` is identical to `dark` (it exists so the `<picture>` light/dark pairing still works)
- `animate` — set to `false` to disable the flower bloom-in animation (default `true`)
- `levels` — set to `false` to make every flower the same, instead of shading by how active each day was (default `true`)
- `labels` — set to `false` to hide the month and weekday labels and crop the image tight to the grid (default `true`)

## Also check out
Want your GitHub contributions graph in any color/theme? Check out [gitcolors](https://gitcolors.vercel.app/)

## Support
If you like this project, please consider giving it a star ⭐

## Stars
[![a104437ana/sakura-garden stars](https://repo-stars.vercel.app/api/stars-badge?repo=a104437ana%2Fsakura-garden)](https://repo-stars.vercel.app)
[![a104437ana/sakura-garden stars](https://repo-stars.vercel.app/api/svg?repo=a104437ana%2Fsakura-garden)](https://repo-stars.vercel.app)

---

<a href="https://star-history.com/#a104437ana/sakura-garden&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=a104437ana/sakura-garden&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=a104437ana/sakura-garden&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=a104437ana/sakura-garden&type=Date" />
  </picture>
</a>
