<script>
  import { onMount } from 'svelte';
  import RepoCard from '$lib/components/RepoCard.svelte';
  import { repos, search, selectedTopics, filtered } from '$lib/stores/repos';

  const isProd = typeof window !== 'undefined' && window.location.pathname.startsWith('/Portfolio');
  const jsonUrl = isProd ? '/Portfolio/data/repos.json' : '/data/repos.json';

  let allTopics = [];

  onMount(async () => {
    try {
      const res = await fetch(jsonUrl + `?v=${Date.now()}`);
      const payload = await res.json();
      const list = Array.isArray(payload.repos) ? payload.repos : payload;
      repos.set(list);
      const topicSet = new Set();
      list.forEach((r) => Array.isArray(r.topics) && r.topics.forEach((t) => topicSet.add(t)));
      allTopics = Array.from(topicSet).sort();
    } catch (e) {
      console.error('Failed to load repos.json', e);
    }
  });

  function toggleTopic(t) {
    selectedTopics.update((arr) => (arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]));
  }
</script>

<section class="controls">
  <input placeholder="Search by name or topic…" on:input={(e) => search.set(e.currentTarget.value)} />
  {#if allTopics.length}
    <div class="chips">
      {#each allTopics as t}
        <button class:active={$selectedTopics?.includes(t)} on:click={() => toggleTopic(t)}>{t}</button>
      {/each}
    </div>
  {/if}
  {#if $filtered?.length === 0}
    <p>No repositories match your search.</p>
  {/if}
  <p class="hint">Data updates on a schedule; instant filtering is client-side.</p>
  <style>
    .hint { color: #6b7280; font-size: 0.875rem; }
  </style>
</section>

<section class="grid">
  {#each $filtered as r}
    <RepoCard repo={r} />
  {/each}
  {#if !$filtered || $filtered.length === 0}
    <div style="height: 1px"></div>
  {/if}
  <style>
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
  </style>
</section>

<style>
.controls { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
.controls input { padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chips button { padding: 0.25rem 0.5rem; border: 1px solid #e5e7eb; border-radius: 9999px; background: white; }
.chips button.active { background: #111827; color: white; border-color: #111827; }
</style>


