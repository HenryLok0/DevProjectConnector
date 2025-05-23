const axios = require('axios');

// Common stopwords to ignore in keyword extraction
const STOPWORDS = new Set([
    'github', 'project', 'code', 'open', 'source', 'repo', 'readme', 'main', 'test', 'example', 'sample', 'awesome', 'list', 'tool', 'tools', 'app', 'application', 'api', 'framework', 'library', 'system', 'file', 'files', 'data', 'user', 'users', 'use', 'using', 'for', 'with', 'and', 'the', 'from', 'your', 'this', 'that', 'about', 'more', 'other', 'based', 'support', 'simple', 'awesome', 'awesome-list'
]);

// Extract top keywords from user's repos, starred repos, and README
function extractKeywords(userProfile) {
    const words = [];
    userProfile.repos.forEach(repo => {
        if (repo.language) words.push(repo.language);
        if (repo.topics) words.push(...repo.topics);
        if (repo.description) words.push(...repo.description.split(/\W+/));
    });
    if (userProfile.starred) {
        userProfile.starred.forEach(repo => {
            if (repo.language) words.push(repo.language);
            if (repo.topics) words.push(...repo.topics);
            if (repo.description) words.push(...repo.description.split(/\W+/));
        });
    }
    if (userProfile.readme) {
        words.push(...userProfile.readme.split(/\W+/));
    }
    const freq = {};
    words.forEach(w => {
        const word = w && w.toLowerCase();
        if (word && word.length > 2 && !STOPWORDS.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);
}

// Get user's organizations (login lowercase)
async function getUserOrganizations(userProfile, axiosConfig = {}) {
    try {
        const orgsRes = await axios.get(`https://api.github.com/users/${userProfile.login}/orgs?per_page=100`, axiosConfig);
        return orgsRes.data.map(org => org.login.toLowerCase());
    } catch (e) {
        return [];
    }
}

// Filter out repos from user's organizations
function filterOutOrgRepos(repos, userOrgs) {
    return repos.filter(repo => !userOrgs.includes((repo.owner && repo.owner.login || '').toLowerCase()));
}

// Sort repositories by community activity (stars, forks, open issues, recent push)
function sortByCommunityActivity(repos) {
    return repos.sort((a, b) => {
        const aScore = (a.stargazers_count || 0) + (a.forks_count || 0) + (a.open_issues_count || 0) + (new Date(a.pushed_at).getTime() / 1e12);
        const bScore = (b.stargazers_count || 0) + (b.forks_count || 0) + (b.open_issues_count || 0) + (new Date(b.pushed_at).getTime() / 1e12);
        return bScore - aScore;
    });
}

// Recommend new repositories based on keywords, excluding already interacted, org, and super popular repos
async function recommendNewRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    const axiosConfig = require('./github').axiosConfig || {};
    const userOrgs = await getUserOrganizations(userProfile, axiosConfig);
    let found = [];
    // Single keyword search
    for (const kw of keywords) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(kw)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=5`;
        const res = await axios.get(url, axiosConfig);
        found = found.concat(res.data.items.filter(repo =>
            !seen.has(repo.full_name) &&
            repo.owner.login !== userProfile.login &&
            repo.stargazers_count < 100000 &&
            !userOrgs.includes(repo.owner.login.toLowerCase())
        ));
        if (found.length >= 5) break;
    }
    // Multi-keyword combination search
    if (found.length < 5 && keywords.length > 1) {
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                const combo = `${keywords[i]}+${keywords[j]}`;
                const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(combo)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=3`;
                const res = await axios.get(url, axiosConfig);
                found = found.concat(res.data.items.filter(repo =>
                    !seen.has(repo.full_name) &&
                    repo.owner.login !== userProfile.login &&
                    repo.stargazers_count < 100000 &&
                    !userOrgs.includes(repo.owner.login.toLowerCase())
                ));
                if (found.length >= 5) break;
            }
            if (found.length >= 5) break;
        }
    }
    // Filter out duplicate repos from the same author
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
    return sortByCommunityActivity(unique);
}

// Recommend closest repositories based on keywords, excluding org repos
async function findClosestRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    const axiosConfig = require('./github').axiosConfig || {};
    const userOrgs = await getUserOrganizations(userProfile, axiosConfig);
    let found = [];
    for (const kw of keywords) {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(kw)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=3`;
        const res = await axios.get(url, axiosConfig);
        found = found.concat(res.data.items.filter(repo =>
            !seen.has(repo.full_name) &&
            repo.owner.login !== userProfile.login &&
            repo.stargazers_count < 100000 &&
            !userOrgs.includes(repo.owner.login.toLowerCase())
        ));
        if (found.length >= 5) break;
    }
    // Multi-keyword combination search
    if (found.length < 5 && keywords.length > 1) {
        for (let i = 0; i < keywords.length; i++) {
            for (let j = i + 1; j < keywords.length; j++) {
                const combo = `${keywords[i]}+${keywords[j]}`;
                const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(combo)}+pushed:>2023-01-01+in:description,readme&sort=best-match&order=desc&per_page=2`;
                const res = await axios.get(url, axiosConfig);
                found = found.concat(res.data.items.filter(repo =>
                    !seen.has(repo.full_name) &&
                    repo.owner.login !== userProfile.login &&
                    repo.stargazers_count < 100000 &&
                    !userOrgs.includes(repo.owner.login.toLowerCase())
                ));
                if (found.length >= 5) break;
            }
            if (found.length >= 5) break;
        }
    }
    // Filter out duplicate repos from the same author
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
    return sortByCommunityActivity(unique);
}

// Recommend developers with similar interests/tech/topics, excluding org members and mutuals
async function findClosestUsers(userProfile) {
    const keywords = extractKeywords(userProfile);
    if (!keywords.length) return [];
    const seen = new Set([userProfile.login]);
    const users = [];
    const axiosConfig = require('./github').axiosConfig || {};

    // Get following and followers list (to avoid recommending already mutuals)
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

    // Get all organizations the user belongs to
    let myOrgs = [];
    try {
        const orgsRes = await axios.get(`https://api.github.com/users/${userProfile.login}/orgs?per_page=100`, axiosConfig);
        myOrgs = orgsRes.data.map(org => org.login.toLowerCase());
    } catch (e) { }

    // 1. Keyword combination search
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

    // 2. Keyword + developer/engineer/opensource search
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

    // 3. Single keyword multi-field search (fill up if not enough)
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

    // 4. Supplement: recommend authors of starred/forked repos (fallback)
    if (users.length < 5 && userProfile.starred) {
        for (const repo of userProfile.starred) {
            if (
                repo.owner &&
                repo.owner.login &&
                repo.owner.type === 'User' && // Only recommend personal accounts
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

    // More humanized sorting: has avatar, has bio, has followers, keyword occurrence, exclude bots
    function userScore(u) {
        let score = 0;
        if (u.avatar_url) score += 2;
        if (u.bio && u.bio.length > 10) score += 2;
        if (u.followers) score += Math.min(u.followers, 100) / 20;
        // Keyword occurrence in bio/name/login
        const kw = keywords.join('|');
        const re = new RegExp(kw, 'gi');
        if (u.bio) score += ((u.bio.match(re) || []).length);
        if (u.name) score += ((u.name.match(re) || []).length);
        if (u.login) score += ((u.login.match(re) || []).length);
        // Penalize bots/empty accounts
        if (u.login && u.login.toLowerCase().includes('bot')) score -= 5;
        if (!u.bio || u.bio.length < 5) score -= 1;
        if ((u.followers || 0) < 2) score -= 1;
        return score;
    }

    return users
        .filter(u => u.type && u.type.toLowerCase() === 'user')
        .sort((a, b) => userScore(b) - userScore(a))
        .slice(0, 5);
}

// Projects you are familiar with (forked or starred, but not your own repo or org repo)
async function matchProjects(userProfile) {
    const axiosConfig = require('./github').axiosConfig || {};
    const userOrgs = await getUserOrganizations(userProfile, axiosConfig);
    const forkedRepos = userProfile.repos.filter(
        repo =>
            repo.fork &&
            repo.owner.login !== userProfile.login &&
            repo.owner.type === 'User' && // Only keep personal accounts
            !userOrgs.includes(repo.owner.login.toLowerCase())
    );
    const starredRepos = (userProfile.starred || []).filter(
        repo =>
            repo.owner.login !== userProfile.login &&
            repo.owner.type === 'User' && // Only keep personal accounts
            !userOrgs.includes(repo.owner.login.toLowerCase())
    );
    const matchedSet = new Map();
    forkedRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    starredRepos.forEach(repo => matchedSet.set(repo.full_name, repo));
    // Filter out organization repos
    const filtered = Array.from(matchedSet.values()).filter(
        repo => repo.owner.type === 'User' && !userOrgs.includes((repo.owner && repo.owner.login || '').toLowerCase())
    );
    return filtered.slice(0, 5);
}

module.exports = {
    matchProjects,
    recommendNewRepos,
    findClosestRepos,
    findClosestUsers
};