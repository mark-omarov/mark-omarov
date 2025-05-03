// TODO: All dates to JS Date objects
export type Icon = 'Github' | 'Linkedin' | 'Mail' | 'ExternalLink';

export type Link = {
  text: string;
  href: string;
  icon?: Icon;
  variant?: string;
};

export type Project = {
  title: string;
  description: string;
  links: Link[];
  featured?: boolean;
};

export type Job = {
  title: string;
  company: string;
  dates: string;
  location: string;
  isCurrent?: boolean;
  details: string[];
};

export type Content = {
  personalInfo: {
    name: string;
    jobTitle: string;
    avatarUrl: string;
    taglines: string[];
    bio: string;
    navButtons: { text: string; href: string }[];
  };
  skills: {
    title: string;
    badges: string[];
  };
  experience: {
    title: string;
    viewMoreLinkText: string;
    viewMoreLinkUrl: string;
    jobs: Job[];
  };
  featured: {
    title: string;
    viewAllLinkText: string;
    viewAllLinkUrl: string;
    projects: Project[];
  };
  projects: {
    title: string;
    description: string;
    items: Project[];
  };
  contact: {
    title: string;
    intro: string;
    links: Link[];
  };
};

const projects: Project[] = [
  {
    title: 'Open Source Contributions',
    description:
      'Various contributions to open source projects and communities.',
    links: [
      {
        text: 'GitHub',
        href: 'https://github.com/mark-omarov',
        icon: 'Github',
      },
    ],
    featured: true,
  },
  {
    title: 'Personal Website',
    description:
      "My personal website built with Next.js and TailwindCSS. You're looking at it right now!",
    links: [
      {
        text: 'Source',
        href: 'https://github.com/mark-omarov/mark-omarov',
        icon: 'Github',
      },
      {
        text: 'Demo',
        href: 'https://omarov.dev',
        icon: 'ExternalLink',
      },
    ],
    featured: true,
  },
  {
    title: 'GH Contribution Mate',
    description:
      'An open source GitHub CLI extension that allows developers to synchronize their non-github repository commits to GitHub.',
    links: [
      {
        text: 'GitHub',
        href: 'https://github.com/trunklabs/gh-contribution-mate',
        icon: 'Github',
      },
    ],
    featured: true,
  },
  {
    title: 'Travel Booking System',
    description:
      'A system for EU travel agencies to simplify complex booking management tasks.',
    links: [
      {
        text: 'Demo',
        href: 'https://cee-systems.com/',
        icon: 'ExternalLink',
      },
    ],
    featured: true,
  },
  {
    title: 'Product Price Aggregator',
    description:
      'Solution for customer access to product prices from popular marketplaces.',
    links: [
      {
        text: 'Demo',
        href: 'https://www.tensojapan.com/en',
        icon: 'ExternalLink',
      },
    ],
  },
  {
    title: 'Solar Energy Landing Page',
    description:
      'SEO-friendly, multi-form landing page for a US-based solar energy company.',
    links: [
      {
        text: 'Demo',
        href: 'https://quickmedigap.com/',
        icon: 'ExternalLink',
      },
    ],
  },
  {
    title: 'Build a Bookbot in Python',
    description:
      'Guided boot.dev project that teaches you how to build a simple CLI bookbot using Python.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/mark-omarov/bookbot',
        icon: 'Github',
      },
    ],
  },
  {
    title: 'Build Asteroids using Pythong and Pygame',
    description:
      'Guided boot.dev project that teaches you how to build the classic game Asteroids using Python and Pygame.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/mark-omarov/asteroids',
        icon: 'Github',
      },
    ],
  },
  {
    title: 'Build a Static Site Generator in Python',
    description:
      'Guided boot.dev project that teaches you how to build a static site generator similar to Jekyll, Hugo, or Gatsby in Python.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/mark-omarov/static-site-generator',
        icon: 'Github',
      },
    ],
  },
];

export const content: Content = {
  personalInfo: {
    name: 'Mark Omarov',
    jobTitle: 'SWE, Senior Product Engineer at Cogent Labs',
    avatarUrl: '/avatar.jpeg',
    taglines: [
      'Hands‑on engineer who ships, no drama.',
      'A decade of building has taught me a thing or two.',
    ],
    bio: "Off hours I'm hanging with my wife and daughter, messing around with the homelab, tossing PRs (and a few bucks) at open source, or learning new shiny things. I've done some DevOps, started poking at cybersecurity (first cert under the belt), and kicked off a Godot side project - but the web is still home turf.",
    navButtons: [
      { text: 'Projects', href: '/projects' },
      { text: 'Certificates', href: '/certificates' },
      { text: 'Contact', href: '#contact' },
    ],
  },
  skills: {
    title: 'Skills',
    badges: [
      'JS/TS',
      'Go',
      'Python',
      'Node',
      'Deno',
      'React',
      'Next',
      'AWS',
      'Postgres/MongoDB/DynamoDB',
      'Containerization',
      'CI/CD',
      'Terraform',
      'Ansible',
    ],
  },
  experience: {
    title: 'Experience',
    viewMoreLinkText: 'View full experience →',
    viewMoreLinkUrl: 'https://linkedin.com/in/mark-omarov',
    jobs: [
      {
        title: 'Senior Product Engineer',
        company: 'Cogent Labs',
        dates: 'Mar 2025 — Present',
        location: 'Tokyo',
        isCurrent: true,
        details: ['Shaping the future with Artificial Intelligence'],
      },
      {
        title: 'Technical Lead',
        company: 'Asurion',
        dates: 'Jul 2022 — Mar 2025',
        location: 'Tokyo',
        details: [
          'Led architectural improvements by decoupling tightly integrated components',
          'Drove improvements toward a more scalable product',
          'Fostered cross-team communication for transparent and effective collaboration',
          'Led CI/CD reorganization initiative',
          'Establishing Infrastructure as Code (IaC) practices and guidelines',
        ],
      },
      {
        title: 'Senior Software Engineer',
        company: 'Asurion',
        dates: 'Nov 2021 — Jul 2022',
        location: 'Tokyo',
        details: [
          'Improved security and stability by introducing secure development practices',
          'Reduced maintenance overhead and decreased deployment times by more than 70%',
          'Implemented Infrastructure as Code (IaC) practices using Ansible',
          'Organized deliverables to maintain transformation efforts while shipping new features',
        ],
      },
      {
        title: 'Senior Software Engineer',
        company: 'Travelport',
        dates: 'Nov 2018 — Nov 2021',
        location: 'Remote',
        details: [
          'Core team member leading the delivery of EU travel agencies workflow service',
          'Engaged with clients directly to ensure highest satisfaction',
          'Led development and participated in design and architectural decisions',
          'Achieved zero-downtime deployments with CI/CD pipelines',
          'Built with React, AWS Lambda, Serverless framework, NodeJS, and various AWS services',
        ],
      },
    ],
  },
  featured: {
    title: 'Featured',
    viewAllLinkText: 'View all projects →',
    viewAllLinkUrl: '/projects',
    projects: [
      {
        title: 'Personal Website',
        description:
          "My personal website built with Next.js and TailwindCSS. You're looking at it right now!",
        links: [
          {
            text: 'Source',
            href: 'https://github.com/mark-omarov/mark-omarov',
            icon: 'Github',
          },
        ],
      },
      {
        title: 'GitHub Contribution Mate',
        description:
          'An open source GitHub CLI extension that allows developers to synchronize their non-github repository commits to GitHub.',
        links: [
          {
            text: 'GitHub',
            href: 'https://github.com/trunklabs/gh-contribution-mate',
            icon: 'Github',
          },
        ],
      },
      {
        title: 'Travel Booking System',
        description:
          'A system for EU travel agencies to simplify complex booking management tasks.',
        links: [
          {
            text: 'Demo',
            href: 'https://cee-systems.com/',
            icon: 'ExternalLink',
          },
        ],
      },
      {
        title: 'Open Source Contributions',
        description:
          'Various contributions to open source projects and communities.',
        links: [
          {
            text: 'GitHub',
            href: 'https://github.com/mark-omarov',
            icon: 'Github',
          },
        ],
      },
    ],
  },
  projects: {
    title: 'Projects',
    description:
      "A collection of projects I've worked on throughout my career and in my free time.",
    items: projects,
  },
  contact: {
    title: 'Contact',
    intro:
      'Feel free to reach out if you want to collaborate on a project or just say hi!',
    links: [
      {
        text: 'GitHub',
        href: 'https://github.com/mark-omarov',
        icon: 'Github',
      },
      {
        text: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mark-omarov/',
        icon: 'Linkedin',
      },
      {
        text: 'contact@omarov.dev',
        href: 'mailto:contact@omarov.dev',
        icon: 'Mail',
      },
    ],
  },
};
