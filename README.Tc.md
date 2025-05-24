# DevProjectConnector

[English README](./README.md)

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?logo=node.js)](https://nodejs.org/)
[![MIT License](https://img.shields.io/github/license/HenryLok0/DevProjectConnector?color=blue)](https://github.com/HenryLok0/DevProjectConnector/blob/main/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/HenryLok0/DevProjectConnector?style=flat-square&logo=github)](https://github.com/HenryLok0/DevProjectConnector)

---

## 探索你的下一個開源冒險

**DevProjectConnector** 是一款強大且易於使用的命令列工具，協助開發者在 GitHub 上尋找開源專案，並與志同道合的貢獻者建立聯繫。它會分析你的 GitHub 個人資料、倉庫與活動，提供量身打造的推薦，加速你的成長並擴展你在開源社群中的人脈。

---

## 主要功能

- **個人化專案探索**  
  根據你的技能、興趣與近期貢獻，推薦適合的開源專案。

- **開發者人脈網絡**  
  找到並聯繫擁有相同技術興趣與專長的開發者。

- **智慧過濾**  
  排除你自己的倉庫與組織專案，讓推薦更精準。

- **深入分析**  
  彙整你的 GitHub 活動、主要語言與近期亮點，快速掌握個人概況。

- **簡單易用**  
  只需輸入 GitHub 使用者名稱，即可透過 CLI 介面獲得即時結果。

---

## 快速開始

### 1. 先決條件

- **Node.js** 版本 14 或以上
- 一組擁有至少 `public_repo` 權限的 GitHub 個人存取權杖  
  [在這裡建立權杖](https://github.com/settings/tokens/new)

執行 CLI 前，請將權杖設為環境變數：

**Windows PowerShell**
```powershell
$env:GITHUB_TOKEN = "your_github_token_here"
```

**Linux/macOS**
```bash
export GITHUB_TOKEN=your_github_token_here
```

---

### 2. 安裝

複製本專案並安裝相依套件：

```bash
git clone https://github.com/HenryLok0/DevProjectConnector
cd DevProjectConnector
npm install
```

---

### 3. 使用方式

以你的 GitHub 使用者名稱執行 CLI：

```bash
node bin/index.js <github_username>
```

範例：
```bash
node bin/index.js henrylok0
```

---

## 你會獲得什麼

- **個人檔案摘要：**  
  查看你最常用的語言、近期活動與熱門倉庫。

- **推薦專案：**  
  發現根據你的興趣與技能量身打造的新開源專案。

- **開發者連結：**  
  獲得你可能想追蹤或合作的開發者建議。

- **清晰易讀的輸出：**  
  所有結果皆以結構化、易於瀏覽的格式呈現。

---

## 範例輸出

```
HenryLok0's icon: https://avatars.githubusercontent.com/u/143982077?v=4
Profile: https://github.com/HenryLok0
User: HenryLok0 (Henry Lok)
Bio: Web & open-source developer.
Building tools for sustainable web, and better dev experience.
Location: Hong Kong
Followers: 1 | Following: 3
Public Repos: 3
Joined GitHub: 2023-09-04T03:12:02.000Z (Local: 2023/9/4 上午11:12:02)
Most Used Language: JavaScript
Last pushed repo: DevProjectConnector (2025-05-24T03:53:26Z, Local: 2025/5/24 上午11:53:26)

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

## 貢獻指南

歡迎貢獻！請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 以了解詳細規範。

---

## 授權

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

---

## 致謝

- 感謝開源社群的啟發，以及對更好開發者協作的追求。
- 感謝所有貢獻者與使用者的支持。
