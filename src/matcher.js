const axios = require('axios');

// Common stopwords to ignore in keyword extraction
const STOPWORDS = new Set([
    'github', 'project', 'code', 'open', 'source', 'repo', 'readme', 'main', 'test', 'example', 'sample', 'awesome', 'list', 'tool', 'tools', 'app', 'application', 'api', 'framework', 'library', 'system', 'file', 'files', 'data', 'user', 'users', 'use', 'using', 'for', 'with', 'and', 'the', 'from', 'your', 'this', 'that', 'about', 'more', 'other', 'based', 'support', 'simple', 'awesome', 'awesome-list', 'http', 'https'
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

// Recommend new repositories based on keywords, excluding already interacted, org, super popular, and starred repos
async function recommendNewRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    const starredNames = new Set((userProfile.starred || []).map(r => r.full_name));
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
    // Finally filter starred again
    return sortByCommunityActivity(unique.filter(repo => !starredNames.has(repo.full_name)));
}

// Recommend closest repositories based on keywords, excluding org repos and starred repos
async function findClosestRepos(userProfile) {
    const keywords = extractKeywords(userProfile);
    const seen = new Set([
        ...userProfile.repos.map(r => r.full_name),
        ...(userProfile.starred || []).map(r => r.full_name),
        ...(userProfile.collaborated || [])
    ]);
    const starredNames = new Set((userProfile.starred || []).map(r => r.full_name));
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
    // Finally filter starred again
    return sortByCommunityActivity(unique.filter(repo => !starredNames.has(repo.full_name)));
}

// Recommend developers with similar interests/tech/topics, excluding org members and mutuals
async function findClosestUsers(userProfile) {
    const keywords = extractKeywords(userProfile);
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

    // 2. Keyword + developer/engineer/opensource
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

    // 3. Search for popular developers by language
    if (users.length < 5 && userProfile.repos && userProfile.repos.length > 0) {
        // Statistical Language
        const langCount = {};
        userProfile.repos.forEach(repo => {
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        });
        const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
        for (const lang of topLangs) {
            const url = `https://api.github.com/search/users?q=language:${encodeURIComponent(lang)}&type=Users&per_page=2`;
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
    }

    // 4. The main contributors to the projects you star/fork (need to compare keyword overlap)
    if (users.length < 5 && userProfile.starred && userProfile.starred.length > 0) {
        for (const repo of userProfile.starred.slice(0, 3)) {
            try {
                const contributorsUrl = `https://api.github.com/repos/${repo.full_name}/contributors?per_page=3`;
                const res = await axios.get(contributorsUrl, axiosConfig);
                for (const user of res.data) {
                    if (
                        !seen.has(user.login) &&
                        user.type &&
                        user.type.toLowerCase() === 'user' &&
                        !mutuals.has(user.login) &&
                        !myOrgs.includes(user.login.toLowerCase())
                    ) {
                        // Further comparison of keyword overlap
                        let overlap = 0;
                        const kwSet = new Set(keywords.map(k => k.toLowerCase()));
                        if (user.login) {
                            const words = user.login.toLowerCase().split(/\W+/);
                            overlap += words.filter(w => kwSet.has(w)).length;
                        }
                        if (overlap > 0) {
                            users.push(user);
                            seen.add(user.login);
                        }
                    }
                    if (users.length >= 5) break;
                }
            } catch (e) { }
            if (users.length >= 5) break;
        }
    }

    // 5. Other participants in the PR/Issue
    if (users.length < 5 && userProfile.collaborated && userProfile.collaborated.length > 0) {
        for (const repoName of userProfile.collaborated.slice(0, 3)) {
            try {
                const eventsUrl = `https://api.github.com/repos/${repoName}/events?per_page=10`;
                const res = await axios.get(eventsUrl, axiosConfig);
                for (const event of res.data) {
                    if (event.actor && event.actor.login && !seen.has(event.actor.login) &&
                        event.actor.login !== userProfile.login &&
                        !mutuals.has(event.actor.login) &&
                        !myOrgs.includes(event.actor.login.toLowerCase())) {
                        // Further comparison of keyword overlap
                        let overlap = 0;
                        const kwSet = new Set(keywords.map(k => k.toLowerCase()));
                        const words = event.actor.login.toLowerCase().split(/\W+/);
                        overlap += words.filter(w => kwSet.has(w)).length;
                        if (overlap > 0) {
                            users.push({
                                login: event.actor.login,
                                avatar_url: event.actor.avatar_url,
                                type: 'User',
                                bio: '', // Not directly available
                                followers: 0 // Not directly available
                            });
                            seen.add(event.actor.login);
                        }
                    }
                    if (users.length >= 5) break;
                }
            } catch (e) { }
            if (users.length >= 5) break;
        }
    }

    // 6. Bonus: Top GitHub developers who recommend language topics (by trending or followers)
    if (users.length < 5 && keywords.length > 0) {
        for (const kw of keywords) {
            const url = `https://api.github.com/search/users?q=${encodeURIComponent(kw)}+in:bio+in:login+in:name&sort=followers&order=desc&type=Users&per_page=2`;
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
    }

    // 7. Owners who have interacted with the project
    if (users.length < 5 && userProfile.collaborated && userProfile.collaborated.length > 0) {
        for (const repoName of userProfile.collaborated.slice(0, 5)) {
            try {
                const repoUrl = `https://api.github.com/repos/${repoName}`;
                const res = await axios.get(repoUrl, axiosConfig);
                const owner = res.data.owner;
                if (
                    owner &&
                    !seen.has(owner.login) &&
                    owner.type &&
                    owner.type.toLowerCase() === 'user' &&
                    owner.login !== userProfile.login &&
                    !mutuals.has(owner.login) &&
                    !myOrgs.includes(owner.login.toLowerCase())
                ) {
                    users.push({
                        login: owner.login,
                        avatar_url: owner.avatar_url,
                        type: owner.type,
                        bio: '',
                        followers: 0
                    });
                    seen.add(owner.login);
                }
                if (users.length >= 5) break;
            } catch (e) { }
            if (users.length >= 5) break;
        }
    }

    // 8. Bonus: Trending project authors based on your favorite language
    if (users.length < 5 && userProfile.repos && userProfile.repos.length > 0) {
        const langCount = {};
        userProfile.repos.forEach(repo => {
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        });
        const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
        for (const lang of topLangs) {
            try {
                // Here we use stars to sort to find popular projects and recommend their authors
                const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(lang)}+pushed:>2023-01-01&sort=stars&order=desc&per_page=3`;
                const res = await axios.get(url, axiosConfig);
                for (const repo of res.data.items) {
                    const owner = repo.owner;
                    if (
                        owner &&
                        !seen.has(owner.login) &&
                        owner.type &&
                        owner.type.toLowerCase() === 'user' &&
                        owner.login !== userProfile.login &&
                        !mutuals.has(owner.login) &&
                        !myOrgs.includes(owner.login.toLowerCase())
                    ) {
                        users.push({
                            login: owner.login,
                            avatar_url: owner.avatar_url,
                            type: owner.type,
                            bio: '',
                            followers: 0
                        });
                        seen.add(owner.login);
                    }
                    if (users.length >= 5) break;
                }
            } catch (e) { }
            if (users.length >= 5) break;
        }
    }

    // 9. Additional: Based on the contributors of the projects you have interacted with
    if (users.length < 5 && userProfile.collaborated && userProfile.collaborated.length > 0) {
        for (const repoName of userProfile.collaborated.slice(0, 3)) {
            try {
                const contributorsUrl = `https://api.github.com/repos/${repoName}/contributors?per_page=5`;
                const res = await axios.get(contributorsUrl, axiosConfig);
                for (const user of res.data) {
                    if (
                        !seen.has(user.login) &&
                        user.type &&
                        user.type.toLowerCase() === 'user' &&
                        user.login !== userProfile.login &&
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
    }

    // 10. Extra: Recommend followers/following of followers/following
    if (users.length < 5 && following.length > 0) {
        for (const followee of following.slice(0, 3)) {
            try {
                const url = `https://api.github.com/users/${followee}/followers?per_page=5`;
                const res = await axios.get(url, axiosConfig);
                for (const user of res.data) {
                    if (
                        !seen.has(user.login) &&
                        user.type &&
                        user.type.toLowerCase() === 'user' &&
                        user.login !== userProfile.login &&
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
    }

    // Stricter sorting: based on the number of overlaps between bio/login/name keywords
    function userScore(u) {
        let score = 0;
        if (u.avatar_url) score += 2;
        if (u.bio && u.bio.length > 10) score += 2;
        if (u.followers) score += Math.min(u.followers, 100) / 20;
        // Keyword overlap count
        let overlap = 0;
        const kwSet = new Set(keywords.map(k => k.toLowerCase()));
        for (const field of ['bio', 'name', 'login']) {
            if (u[field]) {
                const words = u[field].toLowerCase().split(/\W+/);
                overlap += words.filter(w => kwSet.has(w)).length;
            }
        }
        score += overlap * 2;
        // Penalize bots/empty accounts
        if (u.login && u.login.toLowerCase().includes('bot')) score -= 5;
        if (!u.bio || u.bio.length < 5) score -= 1;
        if ((u.followers || 0) < 2) score -= 1;
        return score;
    }

    const filteredUsers = users
        .filter(u => u.type && u.type.toLowerCase() === 'user')
        .sort((a, b) => userScore(b) - userScore(a))
        .slice(0, 5);

    return filteredUsers;
}

async function matchProjects(userProfile) {
    return [];
}

// ...existing code...
module.exports = {
    matchProjects,
    recommendNewRepos,
    findClosestRepos,
    findClosestUsers
};