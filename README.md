# DevProjectConnector

[繁體中文說明](./TC.READMEmd)

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?logo=node.js)](https://nodejs.org/)
[![MIT License](https://img.shields.io/github/license/HenryLok0/DevProjectConnector?color=blue)](https://github.com/HenryLok0/DevProjectConnector/blob/main/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/HenryLok0/DevProjectConnector?style=flat-square&logo=github)](https://github.com/HenryLok0/DevProjectConnector)

## Overview
DevProjectConnector is a user-friendly command-line tool designed to help developers discover open-source projects and connect with like-minded developers on GitHub. By analyzing your GitHub profile—including your repositories, starred projects, and activity—it provides personalized recommendations for projects and people that match your skills, interests, and development journey.

## Features
- Analyzes your GitHub profile to identify your top languages, technologies, and activity patterns.
- Recommends open-source projects that align with your experience, interests, and recent contributions.
- Suggests developers with similar interests or expertise for you to follow or collaborate with.
- Excludes your own and organization repositories from recommendations for more relevant results.
- Provides human-centric, personalized suggestions to help you grow your network and explore new opportunities in the open-source community.

## Prerequisites

You need a GitHub personal access token with at least `public_repo` scope.  
Create one here: https://github.com/settings/tokens/new

**Set your token as an environment variable before running the CLI:**

- **Windows PowerShell:**
  ```powershell
  $env:GITHUB_TOKEN = "your_github_token_here"
  ```

- **Linux/macOS:**
  ```bash
  export GITHUB_TOKEN=your_github_token_here
  ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HenryLok0/DevProjectConnector
   ```

2. Navigate to the project directory:
   ```bash
   cd DevProjectConnector
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To use the DevProjectConnector CLI, run:
```bash
node bin/index.js <github_username>
```
Replace `<github_username>` with the GitHub username you want to analyze.  
For example:
```bash
node bin/index.js henrylok0
```

### Example Output

```
HenryLok0's icon: https://avatars.githubusercontent.com/u/143982077?v=4
Profile: https://github.com/HenryLok0
User: HenryLok0 (Henry Lok)
Location: Hong Kong
Followers: 1 | Following: 3
Public Repos: 3
Joined GitHub: 2023-09-04T03:12:02.000Z (Local: 2023/9/4 上午11:12:02)
Most Used Language: JavaScript
Last pushed repo: DevProjectConnector (2025-05-23T11:36:49Z, Local: 2025/5/23 下午7:36:49)

Your Top Starred Projects:
  - DevProjectConnector (2★): https://github.com/HenryLok0/DevProjectConnector
  - WebEcoAnalyzer (2★): https://github.com/HenryLok0/WebEcoAnalyzer
  - HenryLok0 (0★): https://github.com/HenryLok0/HenryLok0

Recently Active Projects:
  - DevProjectConnector (last push: 2025-05-23T11:36:49Z)
  - WebEcoAnalyzer (last push: 2025-05-22T16:52:04Z)
  - HenryLok0 (last push: 2025-05-21T03:08:49Z)

Your Starred Projects:
  - fhasse95/budget-flow-ios-translations (3★): https://github.com/fhasse95/budget-flow-ios-translations
  - HenryLok0/DevProjectConnector (2★): https://github.com/HenryLok0/DevProjectConnector
  - HenryLok0/WebEcoAnalyzer (2★): https://github.com/HenryLok0/WebEcoAnalyzer

Your Profile README Preview:
### GitHub Analytics

| <img align="center" src="https://github-readme-stats.vercel.app/api?username=henrylok0&theme=github_dark&show_icons=true&hide_border=true&count_private=true&include_all_commits=true" alt="Henry Lok's GitHub stats" /> | <img align="center" src="https://github-readme-stats.verc ...

Projects you have collaborated on (PR/Issue):
  - easeparkhk/easeparkhk (https://github.com/easeparkhk/easeparkhk)

Projects you are familiar with (based on your activity):
- fhasse95/budget-flow-ios-translations (3★): https://github.com/fhasse95/budget-flow-ios-translations
- anuraghazra/github-readme-stats (73400★): https://github.com/anuraghazra/github-readme-stats
- inttter/md-badges (842★): https://github.com/inttter/md-badges
- StepfenShawn/Cantonese (1179★): https://github.com/StepfenShawn/Cantonese

New Projects You May Like:
- Pierian-Data/Complete-Python-3-Bootcamp (28387★): https://github.com/Pierian-Data/Complete-Python-3-Bootcamp
- python/cpython (67163★): https://github.com/python/cpython
- FFmpeg/FFmpeg (50067★): https://github.com/FFmpeg/FFmpeg
- nodejs/node-v0.x-archive (34394★): https://github.com/nodejs/node-v0.x-archive
- googlehosts/hosts (20791★): https://github.com/googlehosts/hosts

Projects Closest to Your Tech/Topics:
- eugenp/tutorials (37151★): https://github.com/eugenp/tutorials
- abhisheknaiidu/awesome-github-profile-readme (26615★): https://github.com/abhisheknaiidu/awesome-github-profile-readme

Developers You May Want to Know:
- fhasse95: https://github.com/fhasse95
- anuraghazra: https://github.com/anuraghazra
- inttter: https://github.com/inttter
- StepfenShawn: https://github.com/StepfenShawn
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

## Acknowledgments

- Inspired by the need for sustainable web development practices.
- Thanks to the contributors and the open-source community for their support.
