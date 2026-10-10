// Everything on the site that's words-about-me lives here. Edit freely.

export const SITE = {
  url: 'https://omarov.dev',
  name: 'Mark Omarov',
  title: 'Mark Omarov',
  description:
    'Mark Omarov. Software engineer from Ukraine, living in Tokyo. Writes about software, homelabs and whatever else.',
  email: 'mark@omarov.dev',
  github: 'https://github.com/mark-omarov',
  linkedin: 'https://www.linkedin.com/in/mark-omarov/',
} as const;

export const INTRO = {
  greeting: "hey, i'm mark.",
  paragraphs: [
    "I'm a software engineer from Ukraine, living in Tokyo since 2018. I've been building things for the web since 2016, and these days I work on AI products at Cogent Labs.",
    'Outside of work I ride my motorcycle, mess with my homelab, do some open source here and there, and get out of the city with my family whenever we can. My Japanese is still a work in progress.',
    "I'm also open to new things, consulting or otherwise. If you're working on something interesting, say hi.",
  ],
} as const;

export type Thing = {
  name: string;
  blurb: string;
  href: string | null;
};

// Open source only: most of my work lives inside the companies I've worked for.
export const THINGS: Thing[] = [
  {
    name: 'pnpm',
    blurb:
      'Added pnpm env remove, for uninstalling a Node.js version pnpm put there.',
    href: 'https://github.com/pnpm/pnpm/pull/5263',
  },
  {
    name: 'HyperDX',
    blurb:
      'A few early PRs: the cursor in the session player, negative durations in search, the duration column, and sign-up form validation.',
    href: 'https://github.com/hyperdxio/hyperdx/pulls?q=is%3Apr+is%3Amerged+author%3Amark-omarov',
  },
  {
    name: 'why-kept',
    blurb:
      'CLI that explains why a package survived tree-shaking in a Vite 8 build, and measures what dropping it would save by actually rebuilding without it.',
    href: 'https://github.com/mark-omarov/why-kept',
  },
  {
    name: 'marshant',
    blurb:
      'Self-hosted feature flags. Started at a company hackathon, where it tied for first.',
    href: 'https://github.com/trunklabs/marshant',
  },
  {
    name: 'gh-contribution-mate',
    blurb:
      'GitHub CLI extension that syncs commits from repos outside GitHub to your contribution graph, without exposing any code.',
    href: 'https://github.com/trunklabs/gh-contribution-mate',
  },
  {
    name: 'uapi-json',
    blurb:
      'Node.js client for the Travelport Universal API, from my Travelport days.',
    href: 'https://github.com/Travelport-Ukraine/uapi-json',
  },
  {
    name: 'dotfiles',
    blurb:
      'My Omarchy setup, managed with chezmoi. Only what differs from the defaults, so upstream improvements keep arriving.',
    href: 'https://github.com/mark-omarov/dotfiles',
  },
];

export const LINKS = [
  { label: 'email', href: `mailto:${SITE.email}` },
  { label: 'github', href: SITE.github },
  { label: 'linkedin', href: SITE.linkedin },
  { label: 'rss', href: '/rss.xml' },
] as const;
