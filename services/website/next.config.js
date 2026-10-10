/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@workspace/ui'],
  async redirects() {
    return [
      { source: '/certificates', destination: '/learned', permanent: true },
      { source: '/projects', destination: '/', permanent: true },
      { source: '/places', destination: '/', permanent: false },
      { source: '/feed', destination: '/rss.xml', permanent: true },
      { source: '/feed.xml', destination: '/rss.xml', permanent: true },
      { source: '/blog/rss.xml', destination: '/rss.xml', permanent: true },
    ];
  },
};

export default config;
