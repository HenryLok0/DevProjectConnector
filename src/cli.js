const { program } = require('commander');
const { getUserProfile } = require('./github');
const { matchProjects, recommendNewRepos, findClosestRepos, findClosestUsers } = require('./matcher');
const fs = require('fs');

program
  .version('1.0.0')
  .description('DevProjectConnector CLI - Discover open-source projects and developers tailored to your GitHub journey.')
  .argument('<githubProfile>', 'GitHub username')
  .action(async (githubProfile) => {
    try {
      const userProfile = await getUserProfile(githubProfile);

      // Calculate most used language
      const langCount = {};
      userProfile.repos.forEach(repo => {
        if (repo.language) {
          langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
      });
      const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Find last pushed repo
      const lastPushRepo = userProfile.repos
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];

      // ====== Summary ======
      console.log('\nWelcome! Here is your personalized GitHub Open Source Exploration Report!\n');
      console.log(`User: ${userProfile.login} (${userProfile.name || 'N/A'})`);
      if (userProfile.bio) console.log(`Bio: ${userProfile.bio}`);
      if (userProfile.blog) console.log(`Blog: ${userProfile.blog}`);
      if (userProfile.location) console.log(`Location: ${userProfile.location}`);
      console.log(`Followers: ${userProfile.followers} | Following: ${userProfile.following}`);
      console.log(`Public Repos: ${userProfile.public_repos}`);
      console.log(`Joined GitHub: ${userProfile.created_at}`);
      console.log(`Most Used Language: ${topLang}`);
      if (lastPushRepo) {
        console.log(`Last pushed repo: ${lastPushRepo.name} (${lastPushRepo.pushed_at})`);
      }

      // ====== Highlight Projects ======
      const topStarRepos = [...userProfile.repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);
      if (topStarRepos.length) {
        console.log('\nYour Top Starred Projects:');
        topStarRepos.forEach(repo => {
          console.log(`  - ${repo.name} (${repo.stargazers_count}★): ${repo.html_url}`);
        });
      }

      const recentRepos = [...userProfile.repos]
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 3);
      if (recentRepos.length) {
        console.log('\nRecently Active Projects:');
        recentRepos.forEach(repo => {
          console.log(`  - ${repo.name} (last push: ${repo.pushed_at})`);
        });
      }

      const starredRepos = userProfile.starred || [];
      if (starredRepos.length) {
        console.log('\nYour Starred Projects:');
        starredRepos.slice(0, 3).forEach(repo => {
          console.log(`  - ${repo.full_name} (${repo.stargazers_count}★): ${repo.html_url}`);
        });
      }

      const forkedRepos = userProfile.repos.filter(repo => repo.fork);
      if (forkedRepos.length) {
        console.log('\nYour Forked Projects:');
        forkedRepos.slice(0, 3).forEach(repo => {
          console.log(`  - ${repo.full_name}: ${repo.html_url}`);
        });
      }

      if (userProfile.readme) {
        console.log('\nYour Profile README Preview:');
        console.log(userProfile.readme.substring(0, 300) + (userProfile.readme.length > 300 ? ' ...' : ''));
      }

      // ====== Interaction & Recommendations ======
      const matchedProjects = await matchProjects(userProfile);

      const collaboratedRepos = userProfile.collaborated || [];
      if (collaboratedRepos.length) {
        console.log('\nProjects you have collaborated on (PR/Issue):');
        collaboratedRepos.slice(0, 3).forEach(repoName => {
          console.log(`  - ${repoName} (https://github.com/${repoName})`);
        });
      }

      console.log('\nProjects you are familiar with (based on your activity):');
      if (matchedProjects.length) {
        matchedProjects.forEach(repo => {
          console.log(`- ${repo.full_name} (${repo.stargazers_count}★): ${repo.html_url}`);
        });
      } else {
        console.log('(No recommendations yet)');
      }

      // ====== Fresh Discoveries ======
      const newRepos = await recommendNewRepos(userProfile);
      if (newRepos.length) {
        console.log('\nNew Projects You May Like:');
        newRepos.forEach(repo => {
          console.log(`- ${repo.full_name} (${repo.stargazers_count}★): ${repo.html_url}`);
        });
      }

      // ====== Closest Match Recommendations ======
      const closestRepos = await findClosestRepos(userProfile);
      if (closestRepos.length) {
        console.log('\nProjects Closest to Your Tech/Topics:');
        closestRepos.forEach(repo => {
          console.log(`- ${repo.full_name} (${repo.stargazers_count}★): ${repo.html_url}`);
        });
      }

      const closestUsers = await findClosestUsers(userProfile);
      if (closestUsers.length) {
        console.log('\nDevelopers You May Want to Know:');
        closestUsers.forEach(user => {
          console.log(`- ${user.login}: https://github.com/${user.login}`);
        });
      } else {
        console.log('\nDevelopers You May Want to Know:\n(No recommendations yet, try starring or contributing to more projects!)');
      }

      // ====== Export Report ======
      const reportLines = [];
      reportLines.push(`# GitHub User Report: ${userProfile.login}`);
      reportLines.push(`- Name: ${userProfile.name || 'N/A'}`);
      reportLines.push(`- Followers: ${userProfile.followers}`);
      reportLines.push(`- Most Used Language: ${topLang}`);
      reportLines.push(`- User README Preview:`);
      reportLines.push('```markdown');
      reportLines.push(userProfile.readme ? userProfile.readme.substring(0, 300) + (userProfile.readme.length > 300 ? ' ...' : '') : '');
      reportLines.push('```');
      reportLines.push(`\nYour Top Starred Projects:`);
      topStarRepos.forEach(repo => {
        reportLines.push(`  - [${repo.name}](${repo.html_url}) (${repo.stargazers_count}★)`);
      });
      reportLines.push(`\nRecently Active Projects:`);
      recentRepos.forEach(repo => {
        reportLines.push(`  - [${repo.name}](${repo.html_url}) (last push: ${repo.pushed_at})`);
      });
      reportLines.push(`\nYour Starred Projects:`);
      starredRepos.slice(0, 3).forEach(repo => {
        reportLines.push(`  - [${repo.full_name}](${repo.html_url}) (${repo.stargazers_count}★)`);
      });
      reportLines.push(`\nYour Forked Projects:`);
      forkedRepos.slice(0, 3).forEach(repo => {
        reportLines.push(`  - [${repo.full_name}](${repo.html_url})`);
      });
      reportLines.push(`\nProjects you have collaborated on (PR/Issue):`);
      collaboratedRepos.slice(0, 3).forEach(repoName => {
        reportLines.push(`  - [${repoName}](https://github.com/${repoName})`);
      });
      reportLines.push(`\nProjects you are familiar with (based on your activity):`);
      matchedProjects.forEach(repo => {
        reportLines.push(`  - [${repo.full_name}](${repo.html_url}) (${repo.stargazers_count}★)`);
      });
      reportLines.push(`\nNew Projects You May Like:`);
      newRepos.forEach(repo => {
        reportLines.push(`  - [${repo.full_name}](${repo.html_url}) (${repo.stargazers_count}★)`);
      });
      reportLines.push(`\nProjects Closest to Your Tech/Topics:`);
      closestRepos.forEach(repo => {
        reportLines.push(`  - [${repo.full_name}](${repo.html_url}) (${repo.stargazers_count}★)`);
      });
      reportLines.push(`\nDevelopers You May Want to Know:`);
      closestUsers.forEach(user => {
        reportLines.push(`  - [${user.login}](https://github.com/${user.login})`);
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  });

program.parse(process.argv);
