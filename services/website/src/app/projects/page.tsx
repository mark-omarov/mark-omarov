import Link from 'next/link';
import { Button } from '@workspace/ui/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

// TODO: Split components, extract data
export default function ProjectsPage() {
  const projects = [
    {
      title: 'Personal Website',
      description:
        "My personal website built with Next.js and TailwindCSS. You're looking at it right now!",
      source: 'https://github.com/mark-omarov/mark-omarov',
      demo: 'https://omarov.dev',
    },
    {
      title: 'Open Source Contributions',
      description:
        'Various contributions to open source projects and communities.',
      github: 'https://github.com/mark-omarov',
    },
    {
      title: 'GH Contribution Mate',
      description:
        'An open source GitHub CLI extension that allows developers to synchronize their non-github repository commits to GitHub.',
      source: 'https://github.com/trunklabs/gh-contribution-mate',
    },
    {
      title: 'Travel Booking System',
      description:
        'A system for EU travel agencies to simplify complex booking management tasks.',
      demo: 'https://cee-systems.com/',
    },
    {
      title: 'Product Price Aggregator',
      description:
        'Solution for customer access to product prices from popular marketplaces.',
      demo: 'https://www.tensojapan.com/en',
    },
    {
      title: 'Solar Energy Landing Page',
      description:
        'SEO-friendly, multi-form landing page for a US-based solar energy company.',
      demo: 'https://quickmedigap.com/',
    },
    {
      title: 'Build a Bookbot in Python',
      description:
        'Guided boot.dev project that teaches you how to build a simple CLI bookbot using Python.',
      source: 'https://github.com/mark-omarov/bookbot',
    },
    {
      title: 'Build Asteroids using Pythong and Pygame',
      description:
        'Guided boot.dev project that teaches you how to build the classic game Asteroids using Python and Pygame.',
      source: 'https://github.com/mark-omarov/asteroids',
    },
    {
      title: 'Build a Static Site Generator in Python',
      description:
        'Guided boot.dev project that teaches you how to build a static site generator similar to Jekyll, Hugo, or Gatsby in Python.',
      source: 'https://github.com/mark-omarov/static-site-generator',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          A collection of projects I&#39;ve worked on throughout my career and
          in my free time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-card flex flex-col justify-between rounded-lg border p-6 shadow-sm"
          >
            <h2 className="mb-2 text-xl font-semibold">{project.title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {project.description}
            </p>
            <div className="flex gap-2">
              {project.source && (
                <Link href={project.source} target="_blank">
                  <Button variant="outline">
                    <Github />
                    Source
                  </Button>
                </Link>
              )}
              {project.github && (
                <Link href={project.github} target="_blank">
                  <Button variant="outline">
                    <Github />
                    GitHub
                  </Button>
                </Link>
              )}
              {project.demo && (
                <Link href={project.demo} target="_blank">
                  <Button>
                    <ExternalLink />
                    Demo
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
