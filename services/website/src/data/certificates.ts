export type CertCategoryKey =
  | 'frontend'
  | 'backend'
  | 'languages'
  | 'tools'
  | 'security'
  | 'specialized'
  | 'design';

export type Certificate = {
  date: string; // 'YYYY-MM' or 'YYYY-MM-DD'
  title: string;
  issuer: string;
  category: CertCategoryKey;
  type: string;
  url: string;
  image: string;
  note?: string;
};

export const CERT_CATEGORY_LABELS: Record<CertCategoryKey, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend & Infrastructure',
  languages: 'Programming Languages',
  tools: 'Developer Tools & Practices',
  security: 'Security',
  specialized: 'Specialized Development',
  design: 'Design & Product',
};

export const ALL_CERTS: Certificate[] = [
  // Headline-eligible
  {
    date: '2025-03',
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    category: 'security',
    type: 'Professional Certificate',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/FHVV5TDD0F9H',
    image: '/certs/google/google-cybersecurity.webp',
    note: 'Eight-course program covering security operations, incident response, and Linux/SQL fundamentals.',
  },
  {
    date: '2023-09',
    title: 'Full Stack Observability Practitioner',
    issuer: 'New Relic',
    category: 'backend',
    type: 'Practitioner Exam',
    url: 'https://credentials.newrelic.com/71b1afdb-d6fd-41de-a6ce-f6290dc9f3da',
    image: '/certs/newrelic/newrelic-full-stack-observability.webp',
    note: 'Practitioner-grade exam on telemetry, distributed tracing, and SLO instrumentation.',
  },
  {
    date: '2025-07',
    title: 'Data Structures and Algorithms in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/67dae7c5-404d-43de-a48e-b51b36d353ff',
    image: '/certs/boot-dev/bootdev_certificate-dsa.webp',
    note: 'Hands-on DSA fundamentals, refreshed alongside C memory management work.',
  },

  // Frontend
  {
    date: '2023-05',
    title: 'Complete Intro to React, v8',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/BoYXCMJijv/complete-react-v8.pdf',
    image: '/certs/fem/complete-react-v8-dark.webp',
  },
  {
    date: '2023-05',
    title: 'Intermediate React, v5',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/TTIuIDprQc/intermediate-react-v5.pdf',
    image: '/certs/fem/intermediate-react-v5-dark.webp',
  },
  {
    date: '2023-05',
    title: 'Introduction to Next.js, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EeCxZxmGeY/next-js-v2.pdf',
    image: '/certs/fem/next-js-v2-dark.webp',
  },
  {
    date: '2023-04',
    title: 'Qwik for Instant-Loading Websites & Apps',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/pbYnMMFrSR/qwik.pdf',
    image: '/certs/fem/qwik-dark.webp',
  },
  {
    date: '2023-01',
    title: 'Getting Started with CSS',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/jQdKurJCyS/getting-started-css.pdf',
    image: '/certs/fem/getting-started-css-dark.webp',
  },
  {
    date: '2022-08',
    title: 'Website Accessibility, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/UgdquArXzt/accessibility-v2.pdf',
    image: '/certs/fem/accessibility-v2-dark.webp',
  },
  {
    date: '2024-05',
    title: 'HTMX & Go',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/TuDybwMUWj/htmx.pdf',
    image: '/certs/fem/htmx-dark.webp',
  },
  {
    date: '2022-08',
    title: 'Complete Intro to React, v7',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EtNBEoWAeZ/complete-react-v7.pdf',
    image: '/certs/fem/complete-react-v7-dark.webp',
  },
  {
    date: '2022-09',
    title: 'Complete Intro to Web Development, v3',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/yBlPKcpCER/web-development-v3.pdf',
    image: '/certs/fem/web-development-v3-dark.webp',
  },
  {
    date: '2022-03',
    title: 'Complete Intro to Web Development, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/nPKnbMgPYe/web-development-v2.pdf',
    image: '/certs/fem/web-development-v2-dark.webp',
  },

  // Backend & Infrastructure
  {
    date: '2025-01',
    title: 'Complete Intro to Databases',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/dolmpfSWPL/databases.pdf',
    image: '/certs/fem/databases-dark.webp',
  },
  {
    date: '2024-09',
    title: 'Enterprise DevOps & Cloud Infrastructure',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/WgcaROBMTb/enterprise-devops.pdf',
    image: '/certs/fem/enterprise-devops-dark.webp',
  },
  {
    date: '2024-02',
    title: 'Introducing DevOps for Developers',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/ptnOvEnjxJ/devops.pdf',
    image: '/certs/fem/devops-dark.webp',
  },
  {
    date: '2023-11',
    title: 'Complete Intro to Containers (Docker)',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/CxVNOnuNpe/complete-intro-containers.pdf',
    image: '/certs/fem/complete-intro-containers-dark.webp',
  },
  {
    date: '2023-07',
    title: 'Full Stack for Front-End Engineers, v3',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/pApqiQbIWA/fullstack-v3.pdf',
    image: '/certs/fem/fullstack-v3-dark.webp',
  },
  {
    date: '2022-04',
    title: 'The Hard Parts of Servers & Node.js',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/GuXNAjfipL/servers-node-js.pdf',
    image: '/certs/fem/servers-node-js-dark.webp',
  },
  {
    date: '2022-09',
    title: 'Course Completed: Digging Into Node.js',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/gpsDPxzjzh/digging-into-node.pdf',
    image: '/certs/fem/digging-into-node-dark.webp',
  },
  {
    date: '2022-10',
    title: 'Full Stack for Front-End Engineers, v2',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/fIJhIqUIUG/fullstack-v2.pdf',
    image: '/certs/fem/fullstack-v2-dark.webp',
  },
  {
    date: '2022-03',
    title: 'Introduction to Node.js, v2',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/rhuQtnYZzv/node-js-v2.pdf',
    image: '/certs/fem/node-js-v2-dark.webp',
  },

  // Languages
  {
    date: '2025-07',
    title: 'Learn Memory Management in C',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/64814616-97eb-4a27-afdb-00c38e32d055',
    image: '/certs/boot-dev/bootdev_certificate-c-memory-management.webp',
  },
  {
    date: '2025-07',
    title: 'Learn HTTP Clients in Go',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/6c1d6831-9ed0-490d-a4c4-b26f2c372cb6',
    image: '/certs/boot-dev/bootdev_certificate-go-http-clients.webp',
  },
  {
    date: '2026-02',
    title: 'Learn SQL',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/74c09d10-d847-4859-95ff-98fd8c4b2404',
    image: '/certs/boot-dev/bootdev_certificate-learn-sql.webp',
  },
  {
    date: '2026-02',
    title: 'Build a Pokedex in Go',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/277fc906-2f23-487d-94f4-e073862e6b35',
    image: '/certs/boot-dev/bootdev_certificate-pokedex.webp',
  },
  {
    date: '2024-11',
    title: 'Object Oriented Programming in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/7a8fa1a6-2e05-42f6-b25d-9d9bb75de88e',
    image: '/certs/boot-dev/bootdev_certificate-python-oop.webp',
  },
  {
    date: '2024-11',
    title: 'Functional Programming in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/ec09d111-113f-4930-8272-6cc41d6e874e',
    image: '/certs/boot-dev/bootdev_certificate-python-fp.webp',
  },
  {
    date: '2024-11',
    title: 'Learn to code in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/c2e68e53-7020-49dc-8e85-64fb5a604f61',
    image: '/certs/boot-dev/bootdev_certificate-python.webp',
  },
  {
    date: '2024-11',
    title: 'Learn Go for Developers',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/4d463440-e327-4b13-a49a-f54be25b06fe',
    image: '/certs/boot-dev/bootdev_certificate-go.webp',
  },
  {
    date: '2024-02',
    title: 'Basics of Go',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EBGnaPNfBj/go-basics.pdf',
    image: '/certs/fem/go-basics-dark.webp',
  },
  {
    date: '2023-03',
    title: 'Intermediate TypeScript',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/JTuWgaLmeq/intermediate-typescript.pdf',
    image: '/certs/fem/intermediate-typescript-dark.webp',
  },
  {
    date: '2022-10',
    title: 'TypeScript Fundamentals, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/sjcvFAjmBl/typescript-v3.pdf',
    image: '/certs/fem/typescript-v3-dark.webp',
  },
  {
    date: '2022-04',
    title: 'The Rust Programming Language',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xiVmqjEsSa/rust.pdf',
    image: '/certs/fem/rust-dark.webp',
  },
  {
    date: '2022-03',
    title: 'JavaScript: The Hard Parts, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/fjjCYVxYTO/javascript-hard-parts-v2.pdf',
    image: '/certs/fem/javascript-hard-parts-v2-dark.webp',
  },
  {
    date: '2022-03',
    title: 'JavaScript: From Fundamentals to Functional, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/auBFpnJXxg/js-fundamentals-functional-v2.pdf',
    image: '/certs/fem/js-fundamentals-functional-v2-dark.webp',
  },
  {
    date: '2022-03',
    title: 'Getting Started with JavaScript, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/PCLLiLkdZh/getting-started-javascript-v2.pdf',
    image: '/certs/fem/getting-started-javascript-v2-dark.webp',
  },
  {
    date: '2022-06',
    title: 'Deep JavaScript Foundations, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/OnFYbrRoyf/deep-javascript-v3.pdf',
    image: '/certs/fem/deep-javascript-v3-dark.webp',
  },
  {
    date: '2022-06',
    title: 'JavaScript: The Recent Parts',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/IgKwlZvgwG/js-recent-parts.pdf',
    image: '/certs/fem/js-recent-parts-dark.webp',
  },
  {
    date: '2022-11',
    title: 'Functional JavaScript First Steps',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/jIKTAxiZEg/functional-first-steps.pdf',
    image: '/certs/fem/functional-first-steps-dark.webp',
  },
  {
    date: '2022-11',
    title: 'The Hard Parts of Asynchronous JavaScript',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/mKwIKFRvDi/javascript-new-hard-parts.pdf',
    image: '/certs/fem/javascript-new-hard-parts-dark.webp',
  },
  {
    date: '2022-11',
    title: 'JavaScript: From First Steps to Professional',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/FFUQWovrnh/javascript-first-steps.pdf',
    image: '/certs/fem/javascript-first-steps-dark.webp',
  },
  {
    date: '2023-02',
    title: 'Functional-Light JavaScript, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/rQmLjQuRvc/functional-javascript-v3.pdf',
    image: '/certs/fem/functional-javascript-v3-dark.webp',
  },
  {
    date: '2025-05',
    title: 'Functional JavaScript First Steps, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/ILBMAduteI/functional-first-steps-v2.pdf',
    image: '/certs/fem/functional-first-steps-v2-dark.webp',
  },

  // Tools
  {
    date: '2024-11',
    title: 'Learn Shells and Terminals',
    issuer: 'Boot.dev',
    category: 'tools',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/e448e7b2-a441-45e2-a287-f4725a26c3d6',
    image: '/certs/boot-dev/bootdev_certificate-linux.webp',
  },
  {
    date: '2024-11',
    title: 'Learn Git',
    issuer: 'Boot.dev',
    category: 'tools',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/06dadbb5-2612-44e2-af7c-e9beba3f65ae',
    image: '/certs/boot-dev/bootdev_certificate-git.webp',
  },
  {
    date: '2023-05',
    title: 'Git In-depth',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/SanGSxIIIS/git-in-depth.pdf',
    image: '/certs/fem/git-in-depth-dark.webp',
  },
  {
    date: '2023-02',
    title: 'Developer Productivity',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/vVSLJGZqHa/developer-productivity.pdf',
    image: '/certs/fem/developer-productivity-dark.webp',
  },
  {
    date: '2022-11',
    title: 'JavaScript Performance',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/KWRyjGiZOe/web-performance.pdf',
    image: '/certs/fem/web-performance-dark.webp',
  },
  {
    date: '2022-09',
    title: 'Web Performance Fundamentals',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/DDyjtRnlHY/web-perf.pdf',
    image: '/certs/fem/web-perf-dark.webp',
  },

  // Security
  {
    date: '2022-09',
    title: 'Ethical Hacking for Beginners',
    issuer: 'Udemy',
    category: 'security',
    type: 'Course',
    url: 'https://www.udemy.com/certificate/UC-7c203084-919a-4b66-bf67-bd2871f3ac07/',
    image: '/certs/udemy/ethical-hacking-for-beginners.webp',
  },

  // Specialized
  {
    date: '2022-07',
    title: 'Electron Fundamentals, v2',
    issuer: 'FrontendMasters',
    category: 'specialized',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xfCxvtvniT/electron-v2.pdf',
    image: '/certs/fem/electron-v2-dark.webp',
  },
  {
    date: '2020-01',
    title: 'React Native (feat. Redux)',
    issuer: 'FrontendMasters',
    category: 'specialized',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/JohLjwlSQq/react-native.pdf',
    image: '/certs/fem/react-native-dark.webp',
  },
  {
    date: '2019-02',
    title: "Unreal Engine 5: The Complete Beginner's Course",
    issuer: 'Udemy',
    category: 'specialized',
    type: 'Course',
    url: 'https://www.udemy.com/certificate/UC-UEN0N5BK/',
    image: '/certs/udemy/unreal-engine-5-the-complete-beginners-course.webp',
  },

  // Design
  {
    date: '2024-01',
    title: 'Complete Intro to Product Management',
    issuer: 'FrontendMasters',
    category: 'design',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/SbhNZYxhgR/product-management.pdf',
    image: '/certs/fem/product-management-dark.webp',
  },
  {
    date: '2023-02',
    title: 'Figma for Developers',
    issuer: 'FrontendMasters',
    category: 'design',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xUcATGVOkH/figma.pdf',
    image: '/certs/fem/figma-dark.webp',
  },
];

const HEADLINE_TITLES = [
  'Google Cybersecurity Professional Certificate',
  'Full Stack Observability Practitioner',
  'Data Structures and Algorithms in Python',
];

export const HEADLINE_CERTS: Certificate[] = HEADLINE_TITLES.map((t) =>
  ALL_CERTS.find((c) => c.title === t)
).filter((c): c is Certificate => Boolean(c));

export type CertCategory = {
  key: CertCategoryKey;
  label: string;
  count: number;
};

export const CERT_CATEGORIES: CertCategory[] = (
  Object.entries(CERT_CATEGORY_LABELS) as [CertCategoryKey, string][]
).map(([key, label]) => ({
  key,
  label,
  count: ALL_CERTS.filter((c) => c.category === key).length,
}));

export const CERT_LEDGER: Record<CertCategoryKey, Certificate[]> =
  Object.fromEntries(
    (Object.keys(CERT_CATEGORY_LABELS) as CertCategoryKey[]).map((key) => [
      key,
      ALL_CERTS.filter((c) => c.category === key).sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    ])
  ) as Record<CertCategoryKey, Certificate[]>;

export function fmtCertDate(yyyymm: string): string {
  const [y, m] = yyyymm.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[parseInt(m ?? '1', 10) - 1]} ${y}`;
}
