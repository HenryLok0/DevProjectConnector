const axios = require('axios');

// Extract keywords (languages, topics, description, README)
function extractKeywords(userProfile) {
    const words = [];
    userProfile.repos.forEach(repo => {
        if (repo.language) words.push(repo.language);
        if (repo.topics) words.push(...repo.topics);
        if (repo.description) words.push(...repo.description.split(/\W+/));
    });
    if (userProfile.readme) {
        words.push(...userProfile.readme.split(/\W+/));
    }
    // Count frequency and take top 5 keywords
    const freq = {};
    words.forEach(w => {
        if (w && w.length > 2) freq[w.toLowerCase()] = (freq[w.toLowerCase()] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
}

// Matched projects (not own repos)
async function matchProjects(userProfile) {
    const forkedRepos = userProfile.repos.filter(repo => repo.fork && repo.owner.login !== userProfile.login);
    const starredRepos = (userProfile.starred || []).filter(repo => repo.owner.login !== userProfile.login);
    const matchedSet = new Map();
    forkedRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    starredRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    return Array.from(matchedSet.values()).slice(0, 5);
}

// Recommend new projects (popular + niche)
async function recommendNewRepos(userProfile) {
    const langCount = {};
    userProfile.repos.forEach(repo => {
        if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
    });
    const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'JavaScript';
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    // Popular
    const searchUrl = `https://api.github.com/search/repositories?q=language:${topLang}&sort=stars&order=desc&per_page=10`;
    const res = await axios.get(searchUrl);
    const hotRepos = res.data.items.filter(repo => !seen.has(repo.full_name) && repo.owner.login !== userProfile.login).slice(0, 3);
    // Niche
    const smallUrl = `https://api.github.com/search/repositories?q=language:${topLang}+stars:10..200&sort=stars&order=desc&per_page=10`;
    const smallRes = await axios.get(smallUrl);
    const smallRepos = smallRes.data.items.filter(repo => !seen.has(repo.full_name) && repo.owner.login !== userProfile.login).slice(0, 2);
    return [...hotRepos, ...smallRepos];
}

// Find closest repositories by keywords
async function findClosestRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    let found = [];
    for (const kw of keywords) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(kw)}&sort=stars&order=desc&per_page=5`;
        const res = await axios.get(url);
        found = found.concat(res.data.items.filter(repo =>
            !seen.has(repo.full_name) && repo.owner.login !== userProfile.login
        ));
        if (found.length >= 5) break;
    }
    // Remove duplicates
    const unique = [];
    const names = new Set();
    for (const repo of found) {
        if (!names.has(repo.full_name)) {
            unique.push(repo);
            names.add(repo.full_name);
        }
        if (unique.length >= 5) break;
    }
    return unique;
}

// Find closest users by keywords
async function findClosestUsers(userProfile) {
    const keywords = extractKeywords(userProfile);
    const url = `https://api.github.com/search/users?q=${encodeURIComponent(keywords.join(' '))}&per_page=10`;
    const res = await axios.get(url);
    return res.data.items.filter(u => u.login !== userProfile.login).slice(0, 5);
}

module.exports = {
    matchProjects,
    recommendNewRepos,
    findClosestRepos,
    findClosestUsers
};