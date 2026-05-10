# 🌸 sakura garden
## A GitHub contributions garden for your README

Turn your GitHub activity into a garden where commits bloom into flowers 🌸 and empty days stay green 🌿

See your garden here: https://sakura-garden.vercel.app

<picture>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=dark" media="(prefers-color-scheme: dark)" width="1000"/>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" media="(prefers-color-scheme: light)" width="1000"/>
  <img src="https://sakura-garden.vercel.app/api/svg?username=a104437ana&theme=light" alt="sakura contributions" width="1000"/>
</picture>

## ⚡ Quick Setup

1. Go to https://sakura-garden.vercel.app  
2. Enter your GitHub username  
3. Copy the generated code  
4. Paste into your README

## 🔧 Manual Setup
1. Copy the code below  
```markdown
<picture>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=dark" media="(prefers-color-scheme: dark)"/>
  <source srcset="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" media="(prefers-color-scheme: light)"/>
  <img src="https://sakura-garden.vercel.app/api/svg?username=your-github-username&theme=light" alt="sakura contributions" width="1000"/>
</picture>
```
2. Replace `your-github-username` with your GitHub username
3. Paste into your README

## 🚀 Advanced Setup
⚠️ This feature is still being tested ⚠️

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

      - name: Create output branch if it doesn't exist
        run: |
          git fetch origin output 2>/dev/null \
            && git checkout output \
            || (git checkout --orphan output && git rm -rf . --ignore-unmatch)

      - name: Generate sakura garden
        uses: a104437ana/sakura-garden@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add sakura-garden.svg sakura-garden-dark.svg
          git diff --cached --quiet || git commit -m "Update sakura garden"
          git push origin output
```
3. Paste into the file you just created
4. Copy the code below
```markdown
<picture>
  <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden-dark.svg" media="(prefers-color-scheme: dark)" width="1000"/>
  <source srcset="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" media="(prefers-color-scheme: light)" width="1000"/>
  <img src="https://raw.githubusercontent.com/your-github-username/your-github-username/output/sakura-garden.svg" alt="sakura garden" width="1000"/>
</picture>
```
5. Replace `your-github-username` with your GitHub username
6. Paste into your README

⚠️ The garden may take a minute to appear after the workflow runs for the first time, but after that it will always be there and update automatically every day based on your GitHub activity

You can see an example of this setup in action [here](https://github.com/a104437ana/a104437ana)

## Features
- 🌸 Transforms your GitHub contributions into a beautiful garden
- :octocat: Updates automatically based on your GitHub activity
- 🌗 Supports both light and dark themes
- ⚡ Easy to integrate into any README or portfolio
- 💻 Dedicated [website](https://sakura-garden.vercel.app) to generate and view your garden

## Support
If you like this project, please consider giving it a star ⭐

## Stars
[![GitHub stars](https://img.shields.io/github/stars/a104437ana/sakura-garden?style=social&label=Star&maxAge=2592000)](https://github.com/a104437ana/sakura-garden/stargazers/)

<a href="https://www.star-history.com/?repos=a104437ana%2Fsakura-garden&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=a104437ana/sakura-garden&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=a104437ana/sakura-garden&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=a104437ana/sakura-garden&type=date&legend=top-left" />
 </picture>
</a>
