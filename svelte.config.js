import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: { base: dev ? '' : '/Portfolio' },
    prerender: { entries: ['*'] }
  }
};

export default config;


