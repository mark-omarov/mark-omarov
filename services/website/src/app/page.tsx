import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/ui/button';
import { Badge } from '@workspace/ui/components/ui/badge';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

// TODO: Clean up the code, split components
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative mb-16 mt-8 rounded-xl border border-green-500/20">
        <div className="via-background absolute inset-0 -z-20 bg-gradient-to-br from-green-900/20 to-purple-900/20 backdrop-blur-sm">
          {/* Grid lines effect */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(0deg, transparent 24%, rgba(74, 222, 128, 0.2) 25%, rgba(74, 222, 128, 0.2) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.2) 75%, rgba(74, 222, 128, 0.2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(74, 222, 128, 0.2) 25%, rgba(74, 222, 128, 0.2) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.2) 75%, rgba(74, 222, 128, 0.2) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px',
              }}
            ></div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-green-400"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `
                    fadeIn 2s ease-out forwards,
                    float ${Math.random() * 10 + 10}s linear infinite ${Math.random() * 2}s
                  `,
                  opacity: 0,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col-reverse gap-8 p-8 md:grid md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-1">
              <Terminal className="h-8 w-8 text-green-500" />
              <h1 className="text-4xl font-bold tracking-tight">Mark Omarov</h1>
            </div>
            <h2 className="text-muted-foreground text-xl font-medium">
              SWE, Senior Product Engineer at Cogent Labs
            </h2>
            <p className="text-muted-foreground">
              <span className="inline-block">
                Hands‑on engineer who ships, no drama.
              </span>
              <span className="inline-block">
                A decade of building has taught me a thing or two.
              </span>
            </p>
            <p className="text-muted-foreground">
              Off hours I&#39;m hanging with my wife and daughter, messing
              around with the homelab, tossing PRs (and a few bucks) at open
              source, or learning new shiny things. I&#39;ve done some DevOps,
              started poking at cybersecurity (first cert under the belt), and
              kicked off a Godot side project - but the web is still home turf.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/projects">
                  <span>Projects</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/certificates">
                  <span>Certificates</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="#contact">
                  <span>Contact</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-56 w-56 md:h-64 md:w-64">
              <div className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-green-500/20 blur-2xl"></div>
              <div
                className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite_reverse] rounded-full bg-purple-500/10 blur-3xl"
                style={{ animationDelay: '2s' }}
              ></div>

              {/* Avatar */}
              <div className="bg-background/80 relative h-full w-full overflow-hidden rounded-full border-2 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] backdrop-blur-sm">
                <Image
                  src="/avatar.jpeg"
                  alt="Mark Omarov"
                  height="610"
                  width="610"
                  className="h-full w-full"
                />
              </div>

              {/* Floating tech icons around avatar */}
              {/*<div className="pointer-events-none absolute -inset-16 -z-10">*/}
              {/*  <FloatingTech />*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            JS/TS
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Go
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Python
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Node
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Deno
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            React
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Next
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            AWS
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Postgres/MongoDB/DynamoDB
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Containerization
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            CI/CD
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Terraform
          </Badge>
          <Badge className="cursor-default bg-green-500/10 text-green-500">
            Ansible
          </Badge>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Experience</h2>
        <div className="space-y-8">
          <div className="border-l-2 border-green-500 pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Senior Product Engineer
                </h3>
                <span className="text-muted-foreground text-sm">
                  Mar 2025 — Present
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Cogent Labs</p>
                <span className="text-muted-foreground text-sm">Tokyo</span>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
                <li>Shaping the future with Artificial Intelligence</li>
              </ul>
            </div>
          </div>

          <div className="border-muted border-l-2 pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Technical Lead</h3>
                <span className="text-muted-foreground text-sm">
                  Jul 2022 — Mar 2025
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Asurion</p>
                <span className="text-muted-foreground text-sm">Tokyo</span>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
                <li>
                  Led architectural improvements by decoupling tightly
                  integrated components
                </li>
                <li>Drove improvements toward a more scalable product</li>
                <li>
                  Fostered cross-team communication for transparent and
                  effective collaboration
                </li>
                <li>Led CI/CD reorganization initiative</li>
                <li>
                  Establishing Infrastructure as Code (IaC) practices and
                  guidelines
                </li>
              </ul>
            </div>
          </div>

          <div className="border-muted border-l-2 pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Senior Software Engineer
                </h3>
                <span className="text-muted-foreground text-sm">
                  Nov 2021 — Jul 2022
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Asurion</p>
                <span className="text-muted-foreground text-sm">Tokyo</span>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
                <li>
                  Improved security and stability by introducing secure
                  development practices
                </li>
                <li>
                  Reduced maintenance overhead and decreased deployment times by
                  more than 70%
                </li>
                <li>
                  Implemented Infrastructure as Code (IaC) practices using
                  Ansible
                </li>
                <li>
                  Organized deliverables to maintain transformation efforts
                  while shipping new features
                </li>
              </ul>
            </div>
          </div>

          <div className="border-muted border-l-2 pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Senior Software Engineer
                </h3>
                <span className="text-muted-foreground text-sm">
                  Nov 2018 — Nov 2021
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Travelport</p>
                <span className="text-muted-foreground text-sm">Remote</span>
              </div>
              <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
                <li>
                  Core team member leading the delivery of EU travel agencies
                  workflow service
                </li>
                <li>
                  Engaged with clients directly to ensure highest satisfaction
                </li>
                <li>
                  Led development and participated in design and architectural
                  decisions
                </li>
                <li>Achieved zero-downtime deployments with CI/CD pipelines</li>
                <li>
                  Built with React, AWS Lambda, Serverless framework, NodeJS,
                  and various AWS services
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="https://linkedin.com/in/mark-omarov"
            target="_blank"
            className="text-sm text-green-500 hover:underline"
          >
            View full experience →
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Personal Website</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              My personal website built with Next.js and TailwindCSS. You&#39;re
              looking at it right now!
            </p>
            <div className="mt-4 flex">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://github.com/mark-omarov/mark-omarov"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Source
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">
              Open Source Contributions
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Various contributions to open source projects and communities.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/mark-omarov" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/projects"
            className="text-sm text-green-500 hover:underline"
          >
            View all projects →
          </Link>
        </div>
      </section>

      <section id="contact" className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Contact</h2>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Feel free to reach out if you want to collaborate on a project or
            just say hi!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link href="https://github.com/mark-omarov" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="https://www.linkedin.com/in/mark-omarov/"
                target="_blank"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="mailto:contact@omarov.dev">
                <Mail className="mr-2 h-4 w-4" />
                contact@omarov.dev
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
