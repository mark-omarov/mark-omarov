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
    bio: string[];
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
    title: 'Marshant: open-source feature flag platform',
    description:
      'Self-hosted feature flag platform: flags, gradual rollouts, experiments. Built with TypeScript and Next.js, designed for multi-tenancy and an open-core model.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/trunklabs/marshant',
        icon: 'Github',
      },
    ],
  },
  {
    title: 'gh-contribution-mate',
    description:
      'GitHub CLI extension that syncs commits from local or non-GitHub repos to a GitHub profile without exposing source or commit messages. Built with TypeScript and Deno.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/trunklabs/gh-contribution-mate',
        icon: 'Github',
      },
    ],
  },
  {
    title: 'uapi-json: Travelport Universal API client',
    description:
      'Open-source Node.js client for Travelport Universal API. Wraps booking, exchange, refund, and ticket retrieval across major GDS systems. 77 stars on GitHub.',
    links: [
      {
        text: 'Source',
        href: 'https://github.com/Travelport-Ukraine/uapi-json',
        icon: 'Github',
      },
    ],
  },
  {
    title: 'Personal homelab: production-grade self-hosted infrastructure',
    description:
      'Single-node Proxmox host running k3s with GPU passthrough. Three-stage provisioning (Pulumi, Ansible, ArgoCD), GitOps via Renovate, two-tier backup (Velero/Kopia plus Restic to S3), full Prometheus/Loki/Grafana observability, Authentik SSO, Cloudflare Tunnel for external access. Built as a sandbox for production patterns I want hands-on with outside the day job. Stack: Proxmox, k3s, Pulumi, Ansible, ArgoCD, Traefik, Helm, Velero, Restic, Prometheus, Loki, Grafana, Authentik.',
    links: [],
  },
];

export const content: Content = {
  personalInfo: {
    name: 'Mark Omarov',
    jobTitle: 'Senior Product Engineer at Cogent Labs',
    avatarUrl: '/avatar.webp',
    tagline:
      "Ship product end-to-end, including the parts most engineers won't touch.",
    bio: [
      '10 years shipping web products end-to-end. Tokyo for the last 8.',
      'Day-to-day is TypeScript, React, Next.js, Node, NestJS, Postgres. Comfortable in the parts of the stack many product engineers avoid: CI/CD, Infrastructure as Code, observability, AWS, container orchestration.',
      'At Cogent Labs I lead technical implementation of a new AI product line: natural language instructions executed across user documents. I treat LLMs as engineering components, not magic.',
      'Outside day jobs I maintain open-source developer tools and run a homelab. That work feeds back into the day job: faster prototyping, sharper opinions on DX, less hesitation around touching infra.',
    ],
    navButtons: [
      { text: 'Projects', href: '/projects' },
      { text: 'Certificates', href: '/certificates' },
      { text: 'Contact', href: '#contact' },
    ],
  },
  skills: {
    title: 'Skills',
    badges: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'AWS',
      'Kubernetes',
      'Infrastructure as Code',
      'Python',
      'Go',
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
        dates: 'Mar 2025 - Present',
        location: 'Tokyo',
        isCurrent: true,
        details: [
          "Technical lead for a new AI product line: natural language instructions executed across user documents. Authored the RFC, partnered with the CTO and designer on UX, integrated with the ML team's models, own UI, backend, and demo end-to-end.",
          'Designed and built a document enhancement and serialization service (NestJS, Kafka, S3, Postgres) that prepares documents for ML consumption and powers RAG and search.',
          'Shipped Omakase Box, a greenfield product line, zero to production: ordering flow, magic-link auth, sudo panel, IAM, JP localization, HubSpot integration. Mentored a junior engineer through delivery.',
          'Led the frontend migration to shadcn/ui and Tailwind, deprecating styled-components. Driving migration of the main repo to a Turborepo + pnpm + changesets monorepo with automated build and release.',
        ],
      },
      {
        title: 'Technical Lead',
        company: 'Asurion',
        dates: 'Jul 2022 - Mar 2025',
        location: 'Tokyo',
        details: [
          "Led RethinkDB to PostgreSQL migration with zero downtime and zero user-visible impact. Multi-stage dual read-write strategy. Smoothest database migration I've shipped.",
          'Decoupled tightly-integrated services into independently-deployable components, reducing deployment blast radius on a system where downtime directly impacts call center operations.',
          'Reorganized CI/CD pipelines and cut build times several times over. Streamed on-prem application logs to OpenSearch via Fluentd, replacing SSH-and-grep workflows.',
          'Contributed to early company-wide Infrastructure as Code standards across 3-5 teams. Mentored 2 engineers; owned technical direction alongside engineering management and product.',
        ],
      },
      {
        title: 'Senior Software Engineer',
        company: 'Asurion',
        dates: 'Nov 2021 - Jul 2022',
        location: 'Tokyo',
        details: [
          'Joined as independent consultant. Aligned with engineering management on a stabilization plan, then led a project transformation: modernized stack, reduced maintenance load, increased ship velocity.',
          'Cut deployment time by 70%+ by replacing manual processes with Ansible-driven on-prem server config and Infrastructure as Code pipelines.',
          'Migrated the codebase to a monorepo and overhauled developer experience. Hardened system security with the security team. Promoted to Tech Lead at the end of this period.',
        ],
      },
      {
        title: 'Senior Software Engineer',
        company: 'Travelport',
        dates: 'Nov 2018 - Nov 2021',
        location: 'Remote',
        details: [
          'Core engineer on the team that shipped TCP, a booking-automation platform for EU travel agents. Production launch in 2021, all EU-based agencies enrolled.',
          'Designed microservices on AWS Lambda (Serverless framework, Node.js) backed by DynamoDB, S3, SNS, SQS, integrated with a React frontend. Achieved zero-downtime deploys via CI/CD pipelines.',
          'Established the team testing framework (unit, integration, contract). Hardened authentication with redesigned token management. Drove highest client satisfaction within the team.',
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
      'Open-source developer tools, infrastructure work, and shipped product. The list is intentionally short: recent, public, and worth talking about.',
    items: projects,
  },
  contact: {
    title: 'Contact',
    intro:
      'Open to senior IC and tech lead roles. Tokyo onsite/hybrid or global remote. Reach me below.',
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
        text: 'mark@omarov.dev',
        href: 'mailto:mark@omarov.dev',
        icon: 'Mail',
      },
    ],
  },
};
