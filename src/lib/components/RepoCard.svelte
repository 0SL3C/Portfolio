<script>
  export let repo;

  const og = (owner, name) => `https://opengraph.githubassets.com/1/${owner}/${name}`;
  let img = og(repo.owner.login, repo.name);
  function onError() { img = repo.owner.avatar_url; }
</script>

<a class="card" href={repo.html_url} target="_blank" rel="noreferrer">
  <img src={img} alt={`${repo.full_name} preview`} on:error={onError} />
  <div class="body">
    <h3>{repo.name}</h3>
    {#if repo.description}
      <p>{repo.description}</p>
    {/if}
    <div class="links">
      {#if repo.homepage}
        <a href={repo.homepage} target="_blank" rel="noreferrer">Site</a>
      {/if}
      <a href={repo.html_url} target="_blank" rel="noreferrer">GitHub</a>
    </div>
    {#if repo.topics && repo.topics.length}
      <div class="topics">
        {#each repo.topics as t}
          <span class="chip">{t}</span>
        {/each}
      </div>
    {/if}
  </div>
</a>

<style>
.card { display: grid; gap: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; background: white; text-decoration: none; color: inherit; }
.card img { width: 100%; height: 160px; object-fit: cover; background: #f3f4f6; }
.body { padding: 0.75rem; }
.links { display: flex; gap: 0.75rem; margin: 0.5rem 0; }
.topics { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.chip { font-size: 0.75rem; padding: 0.125rem 0.5rem; border: 1px solid #e5e7eb; border-radius: 9999px; }
</style>


