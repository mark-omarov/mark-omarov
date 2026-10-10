// Courses I've finished over the years. Not exams, mostly: just stuff I worked
// through and figured I'd keep a log of. Newest first on the page.

export type CourseTopic =
  | 'frontend'
  | 'backend'
  | 'languages'
  | 'tools'
  | 'security'
  | 'specialized'
  | 'design';

export type Course = {
  date: string; // 'YYYY-MM' or 'YYYY-MM-DD'
  title: string;
  issuer: string;
  category: CourseTopic;
  type: string;
  url: string;
  note?: string;
};

export const COURSES: Course[] = [
  {
    date: '2025-03',
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    category: 'security',
    type: 'Professional Certificate',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/FHVV5TDD0F9H',
    note: 'Eight-course program covering security operations, incident response, and Linux/SQL fundamentals.',
  },
  {
    date: '2023-09',
    title: 'Full Stack Observability Practitioner',
    issuer: 'New Relic',
    category: 'backend',
    type: 'Practitioner Exam',
    url: 'https://credentials.newrelic.com/71b1afdb-d6fd-41de-a6ce-f6290dc9f3da',
    note: 'Practitioner-grade exam on telemetry, distributed tracing, and SLO instrumentation.',
  },
  {
    date: '2025-07',
    title: 'Data Structures and Algorithms in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/67dae7c5-404d-43de-a48e-b51b36d353ff',
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
  },
  {
    date: '2023-05',
    title: 'Intermediate React, v5',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/TTIuIDprQc/intermediate-react-v5.pdf',
  },
  {
    date: '2023-05',
    title: 'Introduction to Next.js, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EeCxZxmGeY/next-js-v2.pdf',
  },
  {
    date: '2023-04',
    title: 'Qwik for Instant-Loading Websites & Apps',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/pbYnMMFrSR/qwik.pdf',
  },
  {
    date: '2023-01',
    title: 'Getting Started with CSS',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/jQdKurJCyS/getting-started-css.pdf',
  },
  {
    date: '2022-08',
    title: 'Website Accessibility, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/UgdquArXzt/accessibility-v2.pdf',
  },
  {
    date: '2024-05',
    title: 'HTMX & Go',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/TuDybwMUWj/htmx.pdf',
  },
  {
    date: '2022-08',
    title: 'Complete Intro to React, v7',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EtNBEoWAeZ/complete-react-v7.pdf',
  },
  {
    date: '2022-09',
    title: 'Complete Intro to Web Development, v3',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/yBlPKcpCER/web-development-v3.pdf',
  },
  {
    date: '2022-03',
    title: 'Complete Intro to Web Development, v2',
    issuer: 'FrontendMasters',
    category: 'frontend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/nPKnbMgPYe/web-development-v2.pdf',
  },

  // Backend & Infrastructure
  {
    date: '2025-01',
    title: 'Complete Intro to Databases',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/dolmpfSWPL/databases.pdf',
  },
  {
    date: '2024-09',
    title: 'Enterprise DevOps & Cloud Infrastructure',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/WgcaROBMTb/enterprise-devops.pdf',
  },
  {
    date: '2024-02',
    title: 'Introducing DevOps for Developers',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/ptnOvEnjxJ/devops.pdf',
  },
  {
    date: '2023-11',
    title: 'Complete Intro to Containers (Docker)',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/CxVNOnuNpe/complete-intro-containers.pdf',
  },
  {
    date: '2023-07',
    title: 'Full Stack for Front-End Engineers, v3',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/pApqiQbIWA/fullstack-v3.pdf',
  },
  {
    date: '2022-04',
    title: 'The Hard Parts of Servers & Node.js',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/GuXNAjfipL/servers-node-js.pdf',
  },
  {
    date: '2022-09',
    title: 'Course Completed: Digging Into Node.js',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/gpsDPxzjzh/digging-into-node.pdf',
  },
  {
    date: '2022-10',
    title: 'Full Stack for Front-End Engineers, v2',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/fIJhIqUIUG/fullstack-v2.pdf',
  },
  {
    date: '2022-03',
    title: 'Introduction to Node.js, v2',
    issuer: 'FrontendMasters',
    category: 'backend',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/rhuQtnYZzv/node-js-v2.pdf',
  },

  // Languages
  {
    date: '2025-07',
    title: 'Learn Memory Management in C',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/64814616-97eb-4a27-afdb-00c38e32d055',
  },
  {
    date: '2025-07',
    title: 'Learn HTTP Clients in Go',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/6c1d6831-9ed0-490d-a4c4-b26f2c372cb6',
  },
  {
    date: '2026-02',
    title: 'Learn SQL',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/74c09d10-d847-4859-95ff-98fd8c4b2404',
  },
  {
    date: '2026-02',
    title: 'Build a Pokedex in Go',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/277fc906-2f23-487d-94f4-e073862e6b35',
  },
  {
    date: '2024-11',
    title: 'Object Oriented Programming in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/7a8fa1a6-2e05-42f6-b25d-9d9bb75de88e',
  },
  {
    date: '2024-11',
    title: 'Functional Programming in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/ec09d111-113f-4930-8272-6cc41d6e874e',
  },
  {
    date: '2024-11',
    title: 'Learn to code in Python',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/c2e68e53-7020-49dc-8e85-64fb5a604f61',
  },
  {
    date: '2024-11',
    title: 'Learn Go for Developers',
    issuer: 'Boot.dev',
    category: 'languages',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/4d463440-e327-4b13-a49a-f54be25b06fe',
  },
  {
    date: '2024-02',
    title: 'Basics of Go',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/EBGnaPNfBj/go-basics.pdf',
  },
  {
    date: '2023-03',
    title: 'Intermediate TypeScript',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/JTuWgaLmeq/intermediate-typescript.pdf',
  },
  {
    date: '2022-10',
    title: 'TypeScript Fundamentals, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/sjcvFAjmBl/typescript-v3.pdf',
  },
  {
    date: '2022-04',
    title: 'The Rust Programming Language',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xiVmqjEsSa/rust.pdf',
  },
  {
    date: '2022-03',
    title: 'JavaScript: The Hard Parts, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/fjjCYVxYTO/javascript-hard-parts-v2.pdf',
  },
  {
    date: '2022-03',
    title: 'JavaScript: From Fundamentals to Functional, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/auBFpnJXxg/js-fundamentals-functional-v2.pdf',
  },
  {
    date: '2022-03',
    title: 'Getting Started with JavaScript, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/PCLLiLkdZh/getting-started-javascript-v2.pdf',
  },
  {
    date: '2022-06',
    title: 'Deep JavaScript Foundations, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/OnFYbrRoyf/deep-javascript-v3.pdf',
  },
  {
    date: '2022-06',
    title: 'JavaScript: The Recent Parts',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/IgKwlZvgwG/js-recent-parts.pdf',
  },
  {
    date: '2022-11',
    title: 'Functional JavaScript First Steps',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/jIKTAxiZEg/functional-first-steps.pdf',
  },
  {
    date: '2022-11',
    title: 'The Hard Parts of Asynchronous JavaScript',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/mKwIKFRvDi/javascript-new-hard-parts.pdf',
  },
  {
    date: '2022-11',
    title: 'JavaScript: From First Steps to Professional',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/FFUQWovrnh/javascript-first-steps.pdf',
  },
  {
    date: '2023-02',
    title: 'Functional-Light JavaScript, v3',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/rQmLjQuRvc/functional-javascript-v3.pdf',
  },
  {
    date: '2025-05',
    title: 'Functional JavaScript First Steps, v2',
    issuer: 'FrontendMasters',
    category: 'languages',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/ILBMAduteI/functional-first-steps-v2.pdf',
  },

  // Tools
  {
    date: '2024-11',
    title: 'Learn Shells and Terminals',
    issuer: 'Boot.dev',
    category: 'tools',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/e448e7b2-a441-45e2-a287-f4725a26c3d6',
  },
  {
    date: '2024-11',
    title: 'Learn Git',
    issuer: 'Boot.dev',
    category: 'tools',
    type: 'Course',
    url: 'https://www.boot.dev/certificates/06dadbb5-2612-44e2-af7c-e9beba3f65ae',
  },
  {
    date: '2023-05',
    title: 'Git In-depth',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/SanGSxIIIS/git-in-depth.pdf',
  },
  {
    date: '2023-02',
    title: 'Developer Productivity',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/vVSLJGZqHa/developer-productivity.pdf',
  },
  {
    date: '2022-11',
    title: 'JavaScript Performance',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/KWRyjGiZOe/web-performance.pdf',
  },
  {
    date: '2022-09',
    title: 'Web Performance Fundamentals',
    issuer: 'FrontendMasters',
    category: 'tools',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/DDyjtRnlHY/web-perf.pdf',
  },

  // Security
  {
    date: '2022-09',
    title: 'Ethical Hacking for Beginners',
    issuer: 'Udemy',
    category: 'security',
    type: 'Course',
    url: 'https://www.udemy.com/certificate/UC-7c203084-919a-4b66-bf67-bd2871f3ac07/',
  },

  // Specialized
  {
    date: '2022-07',
    title: 'Electron Fundamentals, v2',
    issuer: 'FrontendMasters',
    category: 'specialized',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xfCxvtvniT/electron-v2.pdf',
  },
  {
    date: '2020-01',
    title: 'React Native (feat. Redux)',
    issuer: 'FrontendMasters',
    category: 'specialized',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/JohLjwlSQq/react-native.pdf',
  },
  {
    date: '2019-02',
    title: "Unreal Engine 5: The Complete Beginner's Course",
    issuer: 'Udemy',
    category: 'specialized',
    type: 'Course',
    url: 'https://www.udemy.com/certificate/UC-UEN0N5BK/',
  },

  // Design
  {
    date: '2024-01',
    title: 'Complete Intro to Product Management',
    issuer: 'FrontendMasters',
    category: 'design',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/SbhNZYxhgR/product-management.pdf',
  },
  {
    date: '2023-02',
    title: 'Figma for Developers',
    issuer: 'FrontendMasters',
    category: 'design',
    type: 'Course',
    url: 'https://static.frontendmasters.com/ud/c/e9197fff18/xUcATGVOkH/figma.pdf',
  },
];

export function coursesByYear(): [string, Course[]][] {
  const groups = new Map<string, Course[]>();
  for (const course of [...COURSES].sort((a, b) =>
    b.date.localeCompare(a.date)
  )) {
    const year = course.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), course]);
  }
  return [...groups.entries()];
}

/**
 * Where a course title links. Frontend Masters certificates are bare PDFs,
 * so those link to the course page instead and keep the PDF as a separate,
 * clearly labelled link. Everything else is already a proper web page.
 */
export function courseLinks(course: Course): {
  href: string;
  cert: string | null;
} {
  const fm = /static\.frontendmasters\.com\/.*\/([a-z0-9-]+)\.pdf$/.exec(
    course.url
  );
  if (fm)
    return {
      href: `https://frontendmasters.com/courses/${fm[1]}/`,
      cert: course.url,
    };
  return { href: course.url, cert: null };
}
