import { writable, derived } from 'svelte/store';

export const repos = writable([]);
export const search = writable('');
export const selectedTopics = writable([]);

export const filtered = derived([repos, search, selectedTopics], ([$repos, $search, $topics]) => {
  const q = ($search || '').trim().toLowerCase();
  return $repos.filter((r) => {
    const inName = !q || (r.name || '').toLowerCase().includes(q);
    const inTopics = !q || (Array.isArray(r.topics) && r.topics.some((t) => (t || '').toLowerCase().includes(q)));
    const topicFilter = !$topics.length || $topics.every((t) => Array.isArray(r.topics) && r.topics.includes(t));
    return (inName || inTopics) && topicFilter;
  });
});


