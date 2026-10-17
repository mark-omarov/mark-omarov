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
    "i'm a software engineer from ukraine, living in tokyo since 2018. i've been building things for the web since 2016, and these days i work on ai products at cogent labs.",
    'outside of work i ride my motorcycle, mess with my homelab, do some open source here and there, and get out of the city with my family whenever we can. my japanese is still a work in progress.',
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
    name: 'omanow',
    blurb:
      'a live pixel globe of the omarchy machines online right now, by city. an omarchy bar plugin and a website that only ever know your city.',
    href: 'https://github.com/mark-omarov/omanow',
  },
  {
    name: 'pnpm',
    blurb:
      'added pnpm env remove, for uninstalling a node.js version pnpm put there.',
    href: 'https://github.com/pnpm/pnpm/pull/5263',
  },
  {
    name: 'hyperdx',
    blurb:
      'a few early prs: the cursor in the session player, negative durations in search, the duration column, and sign-up form validation.',
    href: 'https://github.com/hyperdxio/hyperdx/pulls?q=is%3Apr+is%3Amerged+author%3Amark-omarov',
  },
  {
    name: 'why-kept',
    blurb:
      'cli that explains why a package survived tree-shaking in a vite 8 build, and measures what dropping it would save by actually rebuilding without it.',
    href: 'https://github.com/mark-omarov/why-kept',
  },
  {
    name: 'marshant',
    blurb:
      'self-hosted feature flags. started at a company hackathon, where it tied for first.',
    href: 'https://github.com/trunklabs/marshant',
  },
  {
    name: 'gh-contribution-mate',
    blurb:
      'github cli extension that syncs commits from repos outside github to your contribution graph, without exposing any code.',
    href: 'https://github.com/trunklabs/gh-contribution-mate',
  },
  {
    name: 'uapi-json',
    blurb:
      'node.js client for the travelport universal api, from my travelport days.',
    href: 'https://github.com/Travelport-Ukraine/uapi-json',
  },
  {
    name: 'dotfiles',
    blurb:
      'my omarchy setup, managed with chezmoi. only what differs from the defaults, so upstream improvements keep arriving.',
    href: 'https://github.com/mark-omarov/dotfiles',
  },
];

export const LINKS = [
  { label: 'email', href: `mailto:${SITE.email}` },
  { label: 'github', href: SITE.github },
  { label: 'linkedin', href: SITE.linkedin },
  { label: 'rss', href: '/rss.xml' },
] as const;
