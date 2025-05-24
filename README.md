# DevProjectConnector

[中文說明 (Traditional Chinese)](./TC.READMEmd)

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?logo=node.js)](https://nodejs.org/)
[![MIT License](https://img.shields.io/github/license/HenryLok0/DevProjectConnector?color=blue)](https://github.com/HenryLok0/DevProjectConnector/blob/main/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/HenryLok0/DevProjectConnector?style=flat-square&logo=github)](https://github.com/HenryLok0/DevProjectConnector)

---

## Discover Your Next Open Source Adventure

**DevProjectConnector** is a powerful and user-friendly command-line tool that helps developers find open-source projects and connect with like-minded contributors on GitHub. By analyzing your GitHub profile, repositories, and activity, it delivers tailored recommendations to accelerate your growth and expand your network in the open-source community.

---

## Key Features

- **Personalized Project Discovery**  
  Get recommendations for open-source projects that match your skills, interests, and recent contributions.

- **Developer Networking**  
  Find and connect with developers who share your technical interests and expertise.

- **Smart Filtering**  
  Excludes your own repositories and organization projects for more relevant suggestions.

- **Insightful Analytics**  
  Summarizes your GitHub activity, top languages, and recent highlights for a quick overview.

- **Easy to Use**  
  Simple CLI interface—just provide your GitHub username and get instant results.

---

## Quick Start

### 1. Prerequisites

- **Node.js** version 14 or above
- A GitHub personal access token with at least `public_repo` scope  
  [Create a token here](https://github.com/settings/tokens/new)

Set your token as an environment variable before running the CLI:

**Windows PowerShell**
```powershell
$env:GITHUB_TOKEN = "your_github_token_here"
```

**Linux/macOS**
```bash
export GITHUB_TOKEN=your_github_token_here
```

---

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/HenryLok0/DevProjectConnector
cd DevProjectConnector
npm install
```

---

### 3. Usage

Run the CLI with your GitHub username:

```bash
node bin/index.js <github_username>
```

Example:
```bash
node bin/index.js henrylok0
```

---

## What You Get

- **Profile Summary:**  
  See your most used languages, recent activity, and top repositories.

- **Recommended Projects:**  
  Discover new open-source projects tailored to your interests and skills.

- **Developer Connections:**  
  Get suggestions for developers you may want to follow or collaborate with.

- **Clean, Readable Output:**  
  All results are presented in a clear, structured format for easy exploration.

---

## Example Output

```
HenryLok0's icon: https://avatars.githubusercontent.com/u/143982077?v=4
Profile: https://github.com/HenryLok0
User: HenryLok0 (Henry Lok)
Bio: Web & open-source developer.
Building tools for sustainable web, and better dev experience.
Location: Hong Kong
Followers: 1 | Following: 3
Public Repos: 3
Joined GitHub: 2023-09-04T03:12:02.000Z (Local: 2023/9/4 AM:11:12:02)
Most Used Language: JavaScript
Last pushed repo: DevProjectConnector (2025-05-24T03:53:26Z, Local: 2025/5/24 AM:11:53:26)

Your Top Starred Projects:
  - DevProjectConnector (2★): https://github.com/HenryLok0/DevProjectConnector
  - WebEcoAnalyzer (2★): https://github.com/HenryLok0/WebEcoAnalyzer
  - HenryLok0 (0★): https://github.com/HenryLok0/HenryLok0

Recently Active Projects:
  - DevProjectConnector (last push: 2025-05-24T03:53:26Z)
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



New Projects You May Like:
- Pierian-Data/Complete-Python-3-Bootcamp (28390★): https://github.com/Pierian-Data/Complete-Python-3-Bootcamp
- python/cpython (67167★): https://github.com/python/cpython
- eugenp/tutorials (37152★): https://github.com/eugenp/tutorials
- abhisheknaiidu/awesome-github-profile-readme (26626★): https://github.com/abhisheknaiidu/awesome-github-profile-readme
- rahuldkjain/github-profile-readme-generator (22832★): https://github.com/rahuldkjain/github-profile-readme-generator

Projects Closest to Your Tech/Topics:
- NARKOZ/hacker-scripts (48452★): https://github.com/NARKOZ/hacker-scripts
- qilingframework/qiling (5437★): https://github.com/qilingframework/qiling

Developers You May Want to Know:
- trekhleb: https://github.com/trekhleb
- kamranahmedse: https://github.com/kamranahmedse
- bruce: https://github.com/bruce
- tkersey: https://github.com/tkersey
- hchoroomi: https://github.com/hchoroomi
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by the open-source community and the drive for better developer collaboration.
- Thanks to all contributors and users for their support.
