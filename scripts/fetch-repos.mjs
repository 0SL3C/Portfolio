import fs from 'node:fs/promises';
import fetch from 'node-fetch';

const username = process.env.GITHUB_USERNAME ?? '0SL3C';
const token = process.env.GITHUB_TOKEN;
const outPath = 'static/data/repos.json';

async function fetchAllRepos() {
  const repos = [];
  let page = 1;
  // paginate
  while (true) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    page += 1;
  }

  // fetch topics for each repo
  const withTopics = await Promise.all(
    repos.map(async (r) => {
      try {
        const tRes = await fetch(`${r.url}/topics`, {
          headers: {
            Accept: 'application/vnd.github+json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const t = await tRes.json();
        return toSummary(r, Array.isArray(t.names) ? t.names : []);
      } catch {
        return toSummary(r, []);
      }
    })
  );

  // sort latest first
  withTopics.sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : -1));
  return withTopics;
}

function toSummary(r, topics) {
  return {
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    html_url: r.html_url,
    homepage: r.homepage,
    topics,
    stargazers_count: r.stargazers_count,
    pushed_at: r.pushed_at,
    owner: { login: r.owner?.login, avatar_url: r.owner?.avatar_url }
  };
}

try {
  const repos = await fetchAllRepos();
  const payload = { generated_at: new Date().toISOString(), repos };
  await fs.mkdir('static/data', { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${repos.length} repos to ${outPath}`);
} catch (e) {
  console.error(e);
  process.exit(1);
}


