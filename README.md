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

### API Parameters
You can customize your garden by adding query parameters to the URL:

| Parameter | Description | Options | Default |
| :--- | :--- | :--- | :--- |
| `username` | **(Required)** Your GitHub username | `string` | - |
| `theme` | Visual theme for the garden | `light`, `dark` | `light` |

Example with custom theme:
```markdown
![Sakura Garden](https://sakura-garden.vercel.app/api/svg?username=your-username&theme=dark)
```

### 🛠️ Self-Hosting
Want to run your own instance? It's easy!

1. **Fork this repository** to your GitHub account.
2. **Deploy to Vercel**: Connect your forked repo to a new Vercel project.
3. **Configure Environment Variables**:
   - Add `GITHUB_TOKEN`: A Personal Access Token (classic) with `read:user` permissions.

### 💻 Local Development
To run Sakura Garden locally for testing or development:

1. Install the Vercel CLI: `npm i -g vercel`
2. Clone your fork and navigate into it.
3. Run `vercel dev` to start the local server.

## Features
- 🌸 Transforms your GitHub contributions into a beautiful garden
- :octocat: Updates automatically based on your GitHub activity
- 🌗 Supports both light and dark themes
- ⚡ Easy to integrate into any README or portfolio
- 💻 Dedicated website to generate and view your garden

## Support
If you like this project, please consider giving it a star ⭐
