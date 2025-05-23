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
node bin/index.js google
```

### Example Output

```
User: google (Google)
Bio: Google ❤️ Open Source
Blog: https://opensource.google/
Location: United States of America
Followers: 54614 | Following: 0
Public Repos: 2769
Joined GitHub: 2012-01-18T01:30:18Z
Most Used Language: Python
Last pushed repo: adk-python (2025-05-23T04:57:14Z)

Your Top Starred Projects:
  - A2A (15863★): https://github.com/google/A2A
  - adk-python (9092★): https://github.com/google/adk-python
  - accompanist (7651★): https://github.com/google/accompanist

Recently Active Projects:
  - adk-python (last push: 2025-05-23T04:57:14Z)
  - a2a-python (last push: 2025-05-23T04:37:24Z)
  - android-cuttlefish (last push: 2025-05-23T01:33:47Z)

Your Forked Projects:
  - google/amp-toolbox: https://github.com/google/amp-toolbox

Your Profile README Preview:
(No user README found)

Projects you have collaborated on (PR/Issue):
  - google/device-infra (https://github.com/google/device-infra)
  - google/protobuf.dart (https://github.com/google/protobuf.dart)
  - google/adk-samples (https://github.com/google/adk-samples)

Projects you are familiar with (based on your activity):
(No recommendations yet)

New Projects You May Like:
- public-apis/public-apis (346283★): https://github.com/public-apis/public-apis
- donnemartin/system-design-primer (300570★): https://github.com/donnemartin/system-design-primer
- vinta/awesome-python (244246★): https://github.com/vinta/awesome-python
- tomokuni/Myrica (200★): https://github.com/tomokuni/Myrica
- dlcowen/sansfor509 (200★): https://github.com/dlcowen/sansfor509

Projects Closest to Your Tech/Topics:
- donnemartin/system-design-primer (300570★): https://github.com/donnemartin/system-design-primer
- vinta/awesome-python (244246★): https://github.com/vinta/awesome-python
- practical-tutorials/project-based-learning (228279★): https://github.com/practical-tutorials/project-based-learning
- TheAlgorithms/Python (200742★): https://github.com/TheAlgorithms/Python
- tensorflow/tensorflow (190079★): https://github.com/tensorflow/tensorflow

Developers You May Want to Know:
- mammuth: https://github.com/mammuth
- chegejohn159: https://github.com/chegejohn159
- Arka-cell: https://github.com/Arka-cell
- nicholasaiello: https://github.com/nicholasaiello
- marco97pa: https://github.com/marco97pa

Report generated: report_google.md
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

## Acknowledgments

- Inspired by the need for sustainable web development practices.
- Thanks to the contributors and the open-source community for their support.
