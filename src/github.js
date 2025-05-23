const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

const axiosConfig = GITHUB_TOKEN
  ? { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
  : {};

async function getUserProfile(username) {
    const url = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const starredUrl = `https://api.github.com/users/${username}/starred?per_page=100`;
    const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=100`;

    const userRes = await axios.get(url, axiosConfig);
    const reposRes = await axios.get(reposUrl, axiosConfig);
    const starredRes = await axios.get(starredUrl, axiosConfig);


    let collaboratedRepos = [];
    try {
        const eventsRes = await axios.get(eventsUrl);
        const prRepos = eventsRes.data
            .filter(e => e.type === 'PullRequestEvent' || e.type === 'IssuesEvent')
            .map(e => e.repo.name);
        collaboratedRepos = Array.from(new Set(prRepos));
    } catch (e) {
        collaboratedRepos = [];
    }

    let readme = '';
    try {
        const readmeUrl = `https://raw.githubusercontent.com/${username}/${username}/main/README.md`;
        const readmeRes = await axios.get(readmeUrl);
        readme = readmeRes.data;
    } catch (e) {
        readme = '(No user README found)';
    }

    return {
        ...userRes.data,
        repos: reposRes.data,
        starred: starredRes.data,
        collaborated: collaboratedRepos,
        readme
    };
}

module.exports = { getUserProfile };