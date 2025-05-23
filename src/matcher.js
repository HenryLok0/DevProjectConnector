const axios = require('axios');

// 過濾常見無意義字
const STOPWORDS = new Set([
    'github', 'project', 'code', 'open', 'source', 'repo', 'readme', 'main', 'test', 'example', 'sample', 'awesome', 'list', 'tool', 'tools', 'app', 'application', 'api', 'framework', 'library', 'system', 'file', 'files', 'data', 'user', 'users', 'use', 'using', 'for', 'with', 'and', 'the', 'from', 'your', 'this', 'that', 'about', 'more', 'other', 'based', 'support', 'simple', 'awesome', 'awesome-list'
]);

// 更完整的關鍵字萃取：包含 repo、starred、README，並排除 stopwords
function extractKeywords(userProfile) {
    const words = [];
    // 自己的 repo
    userProfile.repos.forEach(repo => {
        if (repo.language) words.push(repo.language);
        if (repo.topics) words.push(...repo.topics);
        if (repo.description) words.push(...repo.description.split(/\W+/));
    });
    // Starred repo
    if (userProfile.starred) {
        userProfile.starred.forEach(repo => {
            if (repo.language) words.push(repo.language);
            if (repo.topics) words.push(...repo.topics);
            if (repo.description) words.push(...repo.description.split(/\W+/));
        });
    }
    // README
    if (userProfile.readme) {
        words.push(...userProfile.readme.split(/\W+/));
    }
    // 過濾短字、stopwords，統計頻率，取前 8
    const freq = {};
    words.forEach(w => {
        const word = w && w.toLowerCase();
        if (word && word.length > 2 && !STOPWORDS.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);
}

// 根據多組關鍵字組合推薦新專案，並排除已互動過的專案與超熱門專案
async function recommendNewRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    let found = [];
    // 單關鍵字搜尋，改用 best-match 並過濾超熱門
    for (const kw of keywords) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(kw)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=5`;
        const res = await axios.get(url);
        found = found.concat(res.data.items.filter(repo =>
            !seen.has(repo.full_name) &&
            repo.owner.login !== userProfile.login &&
            repo.stargazers_count < 100000 // 過濾超熱門專案
        ));
        if (found.length >= 5) break;
    }
    // 多關鍵字組合搜尋
    if (found.length < 5 && keywords.length > 1) {
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                const combo = `${keywords[i]}+${keywords[j]}`;
                const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(combo)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=3`;
                const res = await axios.get(url);
                found = found.concat(res.data.items.filter(repo =>
                    !seen.has(repo.full_name) &&
                    repo.owner.login !== userProfile.login &&
                    repo.stargazers_count < 100000
                ));
                if (found.length >= 5) break;
            }
            if (found.length >= 5) break;
        }
    }
    // 過濾同作者重複專案
    const unique = [];
    const names = new Set();
    const authors = new Set();
    for (const repo of found) {
        if (!names.has(repo.full_name) && !authors.has(repo.owner.login)) {
            unique.push(repo);
            names.add(repo.full_name);
            authors.add(repo.owner.login);
        }
        if (unique.length >= 5) break;
    }
    return unique;
}

// 根據關鍵字推薦最接近的專案（可與 recommendNewRepos 合併優化）
async function findClosestRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    let found = [];
    for (const kw of keywords) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(kw)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=3`;
        const res = await axios.get(url);
        found = found.concat(res.data.items.filter(repo =>
            !seen.has(repo.full_name) &&
            repo.owner.login !== userProfile.login &&
            repo.stargazers_count < 100000
        ));
        if (found.length >= 5) break;
    }
    // 多關鍵字組合搜尋
    if (found.length < 5 && keywords.length > 1) {
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                const combo = `${keywords[i]}+${keywords[j]}`;
                const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(combo)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=2`;
                const res = await axios.get(url);
                found = found.concat(res.data.items.filter(repo =>
                    !seen.has(repo.full_name) &&
                    repo.owner.login !== userProfile.login &&
                    repo.stargazers_count < 100000
                ));
                if (found.length >= 5) break;
            }
            if (found.length >= 5) break;
        }
    }
    // 過濾同作者重複專案
    const unique = [];
    const names = new Set();
    const authors = new Set();
    for (const repo of found) {
        if (!names.has(repo.full_name) && !authors.has(repo.owner.login)) {
            unique.push(repo);
            names.add(repo.full_name);
            authors.add(repo.owner.login);
        }
        if (unique.length >= 5) break;
    }
    return unique;
}

async function findClosestUsers(userProfile) {
    const keywords = extractKeywords(userProfile);
    if (!keywords.length) return [];
    const seen = new Set([userProfile.login]);
    const users = [];
    const axiosConfig = require('./github').axiosConfig || {};

    // 取得自己追蹤與被追蹤名單（避免推薦已互相關注者）
    let following = [];
    let followers = [];
    try {
        const followingRes = await axios.get(`https://api.github.com/users/${userProfile.login}/following?per_page=100`, axiosConfig);
        following = followingRes.data.map(u => u.login);
    } catch (e) { }
    try {
        const followersRes = await axios.get(`https://api.github.com/users/${userProfile.login}/followers?per_page=100`, axiosConfig);
        followers = followersRes.data.map(u => u.login);
    } catch (e) { }
    const mutuals = new Set([...following, ...followers]);

    // 取得自己所屬的所有組織
    let myOrgs = [];
    try {
        const orgsRes = await axios.get(`https://api.github.com/users/${userProfile.login}/orgs?per_page=100`, axiosConfig);
        myOrgs = orgsRes.data.map(org => org.login.toLowerCase());
    } catch (e) { }

    // 1. 關鍵字組合查詢
    if (keywords.length > 1) {
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                const combo = `${keywords[i]}+${keywords[j]}`;
                const url = `https://api.github.com/search/users?q=${encodeURIComponent(combo)}+in:bio+in:login+in:name&type=Users&per_page=2`;
                try {
                    const res = await axios.get(url, axiosConfig);
                    for (const user of res.data.items) {
                        if (
                            !seen.has(user.login) &&
                            user.type &&
                            user.type.toLowerCase() === 'user' &&
                            !mutuals.has(user.login) &&
                            !myOrgs.includes(user.login.toLowerCase())
                        ) {
                            users.push(user);
                            seen.add(user.login);
                        }
                        if (users.length >= 5) break;
                    }
                } catch (e) { }
                if (users.length >= 5) break;
            }
            if (users.length >= 5) break;
        }
    }

    // 2. 關鍵字+developer/engineer/opensource 查詢
    const extraTerms = ['developer', 'engineer', 'opensource'];
    if (users.length < 5) {
        for (const kw of keywords) {
            for (const term of extraTerms) {
                const combo = `${kw}+${term}`;
                const url = `https://api.github.com/search/users?q=${encodeURIComponent(combo)}+in:bio+in:login+in:name&type=Users&per_page=2`;
                try {
                    const res = await axios.get(url, axiosConfig);
                    for (const user of res.data.items) {
                        if (
                            !seen.has(user.login) &&
                            user.type &&
                            user.type.toLowerCase() === 'user' &&
                            !mutuals.has(user.login) &&
                            !myOrgs.includes(user.login.toLowerCase())
                        ) {
                            users.push(user);
                            seen.add(user.login);
                        }
                        if (users.length >= 5) break;
                    }
                } catch (e) { }
                if (users.length >= 5) break;
            }
            if (users.length >= 5) break;
        }
    }

    // 3. 單關鍵字多欄位查詢（補足不足）
    if (users.length < 5) {
        const searchFields = ['bio', 'login', 'name'];
        for (const kw of keywords) {
            for (const field of searchFields) {
                const url = `https://api.github.com/search/users?q=${encodeURIComponent(kw)}+in:${field}&type=Users&per_page=2`;
                try {
                    const res = await axios.get(url, axiosConfig);
                    for (const user of res.data.items) {
                        if (
                            !seen.has(user.login) &&
                            user.type &&
                            user.type.toLowerCase() === 'user' &&
                            !mutuals.has(user.login) &&
                            !myOrgs.includes(user.login.toLowerCase())
                        ) {
                            users.push(user);
                            seen.add(user.login);
                        }
                        if (users.length >= 5) break;
                    }
                } catch (e) { }
                if (users.length >= 5) break;
            }
            if (users.length >= 5) break;
        }
    }

    // 4. 補充：推薦 star/fork 過的 repo 作者（保底推薦）
    if (users.length < 5 && userProfile.starred) {
        for (const repo of userProfile.starred) {
            if (
                repo.owner &&
                repo.owner.login &&
                !seen.has(repo.owner.login) &&
                repo.owner.login !== userProfile.login &&
                !mutuals.has(repo.owner.login) &&
                !myOrgs.includes(repo.owner.login.toLowerCase())
            ) {
                users.push({
                    login: repo.owner.login,
                    html_url: `https://github.com/${repo.owner.login}`,
                    type: 'User'
                });
                seen.add(repo.owner.login);
            }
            if (users.length >= 5) break;
        }
    }

    return users.slice(0, 5);
}
// 你熟悉的專案（fork 或 starred，但不是自己的 repo）
async function matchProjects(userProfile) {
    const forkedRepos = userProfile.repos.filter(repo => repo.fork && repo.owner.login !== userProfile.login);
    const starredRepos = (userProfile.starred || []).filter(repo => repo.owner.login !== userProfile.login);
    const matchedSet = new Map();
    forkedRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    starredRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    return Array.from(matchedSet.values()).slice(0, 5);
}

module.exports = {
    matchProjects,
    recommendNewRepos,
    findClosestRepos,
    findClosestUsers
};