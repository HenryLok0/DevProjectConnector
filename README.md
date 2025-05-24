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
Location: Hong Kong
Followers: 1 | Following: 3
Public Repos: 3
Joined GitHub: 2023-09-04T03:12:02.000Z (Local: 2023/9/4 上午11:12:02)
Most Used Language: JavaScript
Last pushed repo: DevProjectConnector (2025-05-23T14:05:49Z, Local: 2025/5/23 下午10:05:49)

Your Top Starred Projects:
  - DevProjectConnector (2): https://github.com/HenryLok0/DevProjectConnector
  - WebEcoAnalyzer (2): https://github.com/HenryLok0/WebEcoAnalyzer

Recently Active Projects:
  - DevProjectConnector (last push: 2025-05-23T14:05:49Z)
  - WebEcoAnalyzer (last push: 2025-05-22T16:52:04Z)

New Projects You May Like:
- Pierian-Data/Complete-Python-3-Bootcamp (28389): https://github.com/Pierian-Data/Complete-Python-3-Bootcamp
- python/cpython (67164): https://github.com/python/cpython

Developers You May Want to Know:
- trekhleb: https://github.com/trekhleb
- kamranahmedse: https://github.com/kamranahmedse
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