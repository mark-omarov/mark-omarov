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
    tagline: string;
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
    avatarUrl: '/avatar.webp',
    tagline: 'Hands-on engineer building a better web, line by line.',
    bio: "Off-screen it's family time, homelabbing, sending PRs and a few bucks to open source, or learning new shiny things. I like playing games and occasionally prototyping something fun in Godot/UE5.",
    navButtons: [
      { text: 'Projects', href: '/projects' },
      { text: 'Certificates', href: '/certificates' },
      { text: 'Contact', href: '#contact' },
    ],
  },
  skills: {
    title: 'Skills',
    badges: [
      'JavaScript',
      'TypeScript',
      'Node.js',
      'Next.js',
      'React',
      'Go',
      'AWS',
      'PostgreSQL',
      'MongoDB',
      'DynamoDB',
      'DevOps',
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
        dates: 'Mar 2025 — Present', // TODO: Would be better to store as Date object
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
    projects: projects.slice(0, 4),
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
