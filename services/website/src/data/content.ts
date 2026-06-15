export const CAREER_START_YEAR = 2016;
export const TOKYO_START_YEAR = 2018;

const currentYear = new Date().getFullYear();
const yearsShipping = currentYear - CAREER_START_YEAR;
const yearsTokyo = currentYear - TOKYO_START_YEAR;

export const PERSONAL = {
  name: 'Mark Omarov',
  handle: 'mark-omarov',
  role: 'Principal Product Engineer',
  company: 'Cogent Labs',
  location: 'Tokyo',
  timezone: 'Asia/Tokyo',
  email: 'mark@omarov.dev',
  github: 'https://github.com/mark-omarov',
  linkedin: 'https://linkedin.com/in/mark-omarov',
  yearsShipping,
  yearsTokyo,
  status: 'Open to Senior, Staff, and Principal IC and Tech Lead roles',
  availability: 'Tokyo onsite/hybrid or global remote',
  languages: ['English', 'Ukrainian', 'Russian', 'Japanese (learning)'],
} as const;

export const STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Kafka',
  'AWS',
  'Kubernetes',
  'IaC',
  'Python',
  'Go',
] as const;

export const THESIS = {
  l1: 'Principal Product Engineer.',
  l2: 'End to end.',
  caption: `${yearsShipping} years shipping web products end to end. Currently leading Cogent Labs' AI product line in Tokyo, working directly with the CTO, ML, and product teams. Strong track record of org-level fixes, greenfield delivery, and zero-downtime migrations.`,
  approach: 'I treat LLMs as engineering components, not magic.',
} as const;

export type Signal = { k: string; v: string };

export const SIGNALS: Signal[] = [
  { k: 'Tokyo', v: `${yearsTokyo} yrs` },
  { k: 'Shipping', v: `${yearsShipping} yrs` },
  { k: 'Current', v: 'Cogent Labs' },
  { k: 'Open to', v: 'Senior / Staff / Principal' },
];

export type Win = { tag: string; label: string; detail: string };

export type Job = {
  title: string;
  company: string;
  dates: string;
  location: string;
  isCurrent?: boolean;
  summary: string;
  wins: Win[];
  compact?: boolean;
};

export const EXPERIENCE: Job[] = [
  {
    title: 'Principal Product Engineer',
    company: 'Cogent Labs',
    dates: 'May 2026 – Present',
    location: 'Tokyo',
    isCurrent: true,
    summary:
      'AI product lead. Technical lead of a 4-engineer team building Cogent Labs’ AI product line. Authored the product RFC; partner directly with the CTO and lead designer on UX; own UI, backend, and ML integration end-to-end.',
    wins: [
      {
        tag: 'Lead',
        label: 'Cabinet, AI document platform',
        detail:
          'Built the initial product: natural-language instructions executed across enterprise documents. Now in limited preview, demoing to major enterprise prospects.',
      },
      {
        tag: 'Lead',
        label: 'Smart Automation line',
        detail:
          'Extends Cabinet with reconciliation, validation, and transformation systems integrated across the product lineup. In active development.',
      },
      {
        tag: 'Built',
        label: 'Document enhancement and serialization service',
        detail:
          'NestJS, Kafka, S3, Postgres. Powers all ML ingestion, RAG pipelines, and downstream AI search.',
      },
    ],
  },
  {
    title: 'Senior Product Engineer',
    company: 'Cogent Labs',
    dates: 'Mar 2025 – May 2026',
    location: 'Tokyo',
    summary:
      'End-to-end across product lines, platform refactors, design system, and DX. Cross-functional with ML, product, design, and CTO.',
    wins: [
      {
        tag: 'Solo',
        label: 'SmartRead backend decoupling',
        detail:
          'Separated two tightly-coupled product backends into independently deployable, testable services. Removed a recurring cross-team release bottleneck and cut QA regression time 40-50% per release.',
      },
      {
        tag: 'Built',
        label: 'Document-types automation',
        detail:
          'Eliminated a ~1-month engineering release cycle: new ML-trained document types are validated via DB config and published by the owning team, zero engineering effort per release.',
      },
      {
        tag: 'Migrated',
        label: 'DataStore to PostgreSQL',
        detail:
          'Across 1,390+ client tenants with zero data loss and zero incidents.',
      },
      {
        tag: 'Shipped',
        label: 'Omakase Box, zero to production',
        detail:
          'Greenfield: ordering flow, magic-link auth, admin panel, IAM/tenant management, JP localization, HubSpot. Mentored a junior engineer through delivery.',
      },
      {
        tag: 'Led',
        label: 'Frontend migration and monorepo',
        detail:
          'styled-components to shadcn/ui + Tailwind with design-system practices. Drove monorepo migration to Turborepo + pnpm + changesets with automated releases.',
      },
    ],
  },
  {
    title: 'Technical Lead',
    company: 'Asurion',
    dates: 'Jul 2022 – Mar 2025',
    location: 'Tokyo',
    summary:
      'Tech Lead on a remote device farm: powered an internal call center, served external clients, and provided a real-device test surface for other internal teams.',
    wins: [
      {
        tag: 'Migrated',
        label: 'RethinkDB to PostgreSQL, zero downtime',
        detail:
          'Multi-stage dual read-write strategy. Gradually rolled traffic to Postgres, sunsetted RethinkDB once parity confirmed.',
      },
      {
        tag: 'Decoupled',
        label: 'Tightly-integrated services',
        detail:
          'Independently-deployable components. Reduced blast radius on a system where downtime directly impacts call center operations.',
      },
      {
        tag: 'Cut',
        label: 'CI/CD build times, several times over',
        detail:
          'Streamed on-prem app logs to OpenSearch via Fluentd. Engineers query across services in one place instead of SSH-and-grep.',
      },
      {
        tag: 'Mentored',
        label: '2 engineers, owned technical direction',
        detail:
          'Roadmap planning, architectural reviews, hiring input. Contributed to early company-wide IaC standards across 3-5 teams.',
      },
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'Asurion',
    dates: 'Nov 2021 – Jul 2022',
    location: 'Tokyo',
    summary:
      'Joined as independent consultant. Stabilization plan with engineering management, then led a project transformation. Promoted to Tech Lead.',
    wins: [
      {
        tag: 'Cut',
        label: 'Deploy time by 70%+',
        detail:
          'Ansible-driven on-prem server config and IaC pipelines, replacing manual processes.',
      },
      {
        tag: 'Migrated',
        label: 'Codebase to monorepo',
        detail:
          'Overhauled developer experience. Faster local feedback loops, standardized tooling.',
      },
      {
        tag: 'Hardened',
        label: 'System security',
        detail:
          'Introduced secure development practices with the security team. Resolved deep-rooted issues that had blocked the team.',
      },
    ],
  },
  {
    title: 'Technical Interviewer',
    company: 'SpaceBus',
    dates: 'Sep 2021 – Jan 2023',
    location: 'Remote · Concurrent',
    summary:
      'Contract: senior-engineer hiring interviews. Structured technical evaluation and feedback to candidates and hiring teams. Concurrent with Asurion.',
    wins: [],
    compact: true,
  },
  {
    title: 'Senior Software Engineer',
    company: 'Travelport',
    dates: 'Nov 2018 – Nov 2021',
    location: 'Remote',
    summary:
      'Core engineer on TCP, a booking-automation platform for EU travel agents. Production launch 2021, all EU-based agencies enrolled.',
    wins: [
      {
        tag: 'Designed',
        label: 'Microservices on AWS Lambda',
        detail:
          'Serverless, Node.js, DynamoDB, S3, SNS, SQS. React frontend. Zero-downtime CI/CD.',
      },
      {
        tag: 'Established',
        label: 'Team testing framework',
        detail:
          'Unit, integration, contract tests across the service boundary.',
      },
      {
        tag: 'Hardened',
        label: 'Authentication and session security',
        detail:
          'Redesigned token management to protect agent sessions and reduce credential exposure risk.',
      },
    ],
  },
  {
    title: 'Full Stack Engineer',
    company: 'BEENOS',
    dates: 'May 2018 – Nov 2018',
    location: 'Tokyo',
    summary:
      'Customer-facing product-price aggregation service ranking deals from multiple marketplaces by availability and price.',
    wins: [
      {
        tag: 'Automated',
        label: 'Multi-source data collection',
        detail:
          'Marketplace APIs and scraping pipelines feeding the aggregation service. Preact (SSR), Node/Express, DynamoDB, S3.',
      },
      {
        tag: 'Delivered',
        label: 'Internal Preact CMS',
        detail:
          'Built tooling for content operations. Redesigned parts of the application architecture to increase feature delivery speed.',
      },
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Earlier roles',
    dates: 'Nov 2016 – Apr 2018',
    location: 'Malta · Remote',
    summary:
      'Betting Entertainment LTD (Malta, on-site, 1yr+): maintained and customized a white-label betting product across ~35 client sites. Cut new-theme creation time by 50% via parametrized SASS architecture; shipped 20+ themes. SkyJump Technology (3-month freelance): SEO-friendly multi-step landing page with automated address lookup for a US solar energy company.',
    wins: [],
  },
];

export type Project = {
  id: string;
  year: string;
  title: string;
  role: string;
  summary: string;
  longSummary?: string;
  stack: string[];
  status: string;
  href: string | null;
  feature?: boolean;
  tag: string;
};

export const PROJECTS: Project[] = [
  {
    id: '01',
    year: '2025',
    title: 'Personal homelab',
    role: 'Architect / Operator',
    summary:
      'Production-grade self-hosted infrastructure. Single-node Proxmox host running k3s with GPU passthrough. Three-stage provisioning, GitOps, two-tier backup, full observability stack.',
    longSummary:
      'Built as a sandbox for production patterns I want hands-on with outside the day job. Pulumi provisions the host, Ansible configures the OS layer, ArgoCD owns the cluster state. Renovate handles GitOps updates. Velero plus Kopia run scheduled cluster backups; Restic ships off-site to S3. Prometheus, Loki, and Grafana cover metrics, logs, and dashboards. Authentik handles SSO. Cloudflare Tunnel exposes selected services without opening ports.',
    stack: [
      'PROXMOX',
      'K3S',
      'PULUMI',
      'ANSIBLE',
      'ARGOCD',
      'TRAEFIK',
      'HELM',
      'VELERO',
      'RESTIC',
      'PROMETHEUS',
      'LOKI',
      'GRAFANA',
      'AUTHENTIK',
    ],
    status: 'Operating',
    href: null,
    feature: true,
    tag: 'Infrastructure',
  },
  {
    id: '02',
    year: '2024',
    title: 'Marshant',
    role: 'Creator',
    summary:
      'Open-source feature flag platform. Self-hosted: flags, gradual rollouts, experiments. TypeScript and Next.js, designed for multi-tenancy and an open-core model. Originated as a tie-winning entry at an internal Cogent Labs hackathon.',
    stack: ['TS', 'NEXT', 'POSTGRES', 'DOCKER'],
    status: 'Active',
    href: 'https://github.com/trunklabs/marshant',
    tag: 'OSS · Platform',
  },
  {
    id: '03',
    year: '2023',
    title: 'gh-contribution-mate',
    role: 'Author',
    summary:
      'GitHub CLI extension that syncs commits from local or non-GitHub repos to a GitHub profile, without exposing source or commit messages. TypeScript and Deno.',
    stack: ['TS', 'DENO', 'CLI'],
    status: 'Released',
    href: 'https://github.com/trunklabs/gh-contribution-mate',
    tag: 'OSS · Tooling',
  },
  {
    id: '04',
    year: '2019',
    title: 'uapi-json',
    role: 'Maintainer',
    summary:
      'Open-source Node.js client for Travelport Universal API. Wraps booking, exchange, refund, and ticket retrieval across major GDS systems. 77 stars on GitHub.',
    stack: ['NODE', 'JS'],
    status: 'Maintained',
    href: 'https://github.com/Travelport-Ukraine/uapi-json',
    tag: 'OSS · Library',
  },
];

export const COMPANIES = [
  'Cogent Labs',
  'Asurion',
  'SpaceBus',
  'Travelport',
  'BEENOS',
  'SkyJump Technology',
  'Betting Entertainment',
] as const;

export const HOMELAB_LAYERS: { label: string; items: string[] }[] = [
  { label: 'Hypervisor / Host', items: ['PROXMOX'] },
  { label: 'Cluster', items: ['K3S', 'TRAEFIK', 'HELM'] },
  { label: 'Provisioning', items: ['PULUMI', 'ANSIBLE', 'ARGOCD'] },
  { label: 'Observability', items: ['PROMETHEUS', 'LOKI', 'GRAFANA'] },
  { label: 'Backup', items: ['VELERO', 'RESTIC'] },
  { label: 'Identity / Edge', items: ['AUTHENTIK', 'CLOUDFLARE'] },
];
