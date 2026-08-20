# 🌸 sakura garden
## A GitHub contributions garden for your README

Turn your GitHub activity into a garden where commits bloom into flowers 🌸 and empty days stay green 🌿

See your garden here: https://sakura-garden.vercel.app

<a href="https://sakura-garden.vercel.app" target="_blank" rel="noopener">
<picture>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=dark" media="(prefers-color-scheme: dark)" width="1000" height="194"/>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" media="(prefers-color-scheme: light)" width="1000" height="194"/>
  <img src="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" alt="sakura contributions" width="1000" height="194"/>
</picture>
</a>

## ⚡ Quick Setup

1. Go to https://sakura-garden.vercel.app  
2. Enter your GitHub username  
3. Copy the garden
4. Paste into your README

## 🔧 Manual Setup
1. Copy the code below  
```markdown
<a href="https://sakura-garden.vercel.app" target="_blank" rel="noopener">
  <picture>
    <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=dark" media="(prefers-color-scheme: dark)"/>
    <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" media="(prefers-color-scheme: light)"/>
    <img src="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" alt="sakura contributions" width="1000" height="194"/>
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
    <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden-dark.svg" media="(prefers-color-scheme: dark)" width="1000" height="194"/>
    <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" media="(prefers-color-scheme: light)" width="1000" height="194"/>
    <img src="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" alt="sakura garden" width="1000" height="194"/>
  </picture>
</a>
```
5. Replace `your-github-username` with your GitHub username
6. Paste into your README

⚠️ The garden may take a minute to appear after the workflow runs for the first time, but after that it will always be there and update automatically every day based on your GitHub activity

## Features
- 🌸 Transforms your GitHub contributions into a beautiful garden
- :octocat: Updates automatically based on your GitHub activity
- 🌗 Supports both light and dark themes
- ⚡ Easy to integrate into any README or portfolio
- 💻 Dedicated [website](https://sakura-garden.vercel.app) to generate and view your garden
- 🎬 Flowers bloom in one by one when the image loads

## API
You can also hit the API directly to generate the image, without going through the site:

`https://sakura-garden.vercel.app/api/svg?username=YOUR_USERNAME&theme=dark|light&animate=true|false`

- `username` — your GitHub username
- `theme` — `dark` or `light`
- `animate` — set to `false` to disable the flower bloom-in animation (default `true`)

## Support
If you like this project, please consider giving it a star ⭐

## Also check out
Want your GitHub contributions graph in any color/theme? Check out [gitcolors](https://gitcolors.vercel.app/)

## Stars
[![GitHub stars](https://img.shields.io/github/stars/a104437ana/sakura-garden?style=social&label=Stars)](https://github.com/a104437ana/sakura-garden/stargazers/)
