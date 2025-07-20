import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/ui/button';
import { Badge } from '@workspace/ui/components/ui/badge';
import { Terminal } from 'lucide-react';
import { content } from '~/data/content';
import { GridLines } from '~/components/grid-lines';
import { FloatingParticles } from '~/components/floating-particles';
import { Project } from '~/components/project';
import { getIcon } from '~/components/get-icon';

export default function HomePage() {
  const { personalInfo, skills, experience, featured, contact } = content;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative mb-16 mt-8 rounded-xl border border-green-500/20">
        <div className="via-background absolute inset-0 -z-20 bg-gradient-to-br from-green-900/20 to-purple-900/20 backdrop-blur-sm">
          <GridLines />
          <FloatingParticles />
        </div>

        <div className="relative flex flex-col gap-8 p-8 md:flex-row">
          <div className="flex items-center">
            <div className="relative h-56 w-56 md:h-64 md:w-64">
              <div className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-green-500/20 blur-2xl"></div>
              <div
                className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite_reverse] rounded-full bg-purple-500/10 blur-3xl"
                style={{ animationDelay: '2s' }}
              ></div>
              <div className="bg-background/80 relative h-full w-full overflow-hidden rounded-full border-2 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] backdrop-blur-sm">
                <Image
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  height="610"
                  width="610"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-end gap-1">
              <Terminal className="h-8 w-8 text-green-500" />
              <h1 className="text-4xl font-bold tracking-tight">
                {personalInfo.name}
              </h1>
            </div>
            <h2 className="text-muted-foreground text-xl font-medium">
              {personalInfo.jobTitle}
            </h2>
            <p className="text-muted-foreground">
              <span className="inline-block">{personalInfo.tagline}</span>
            </p>
            <p className="text-muted-foreground">
              {personalInfo.bio.map((el) => (
                <span className="block" key={el}>
                  {el}
                </span>
              ))}
            </p>
            <div className="flex flex-wrap gap-4">
              {personalInfo.navButtons.map((button) => (
                <Button key={button.text} asChild variant="outline" size="sm">
                  <Link href={button.href}>
                    <span>{button.text}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">{skills.title}</h2>
        <div className="flex flex-wrap gap-2">
          {skills.badges.map((badge) => (
            <Badge
              key={badge}
              className="cursor-default bg-green-500/10 text-green-500"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">{experience.title}</h2>
        <div className="space-y-8">
          {experience.jobs.map((job, index) => (
            <div
              key={index}
              className={`pl-4 ${job.isCurrent ? 'border-l-2 border-green-500' : 'border-muted border-l-2'}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="text-muted-foreground text-sm">
                    {job.dates}
                  </span>
                </div>
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <p className="text-muted-foreground">{job.company}</p>
                  <span className="text-muted-foreground text-sm">
                    {job.location}
                  </span>
                </div>
                <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
                  {job.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <Link
            href={experience.viewMoreLinkUrl}
            target="_blank"
            className="text-sm text-green-500 hover:underline"
          >
            {experience.viewMoreLinkText}
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">{featured.title}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.projects.map((project) => (
            <Project project={project} key={project.title} />
          ))}
        </div>
        <div className="mt-4">
          <Link
            href={featured.viewAllLinkUrl}
            className="text-sm text-green-500 hover:underline"
          >
            {featured.viewAllLinkText}
          </Link>
        </div>
      </section>

      <section id="contact" className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">{contact.title}</h2>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">{contact.intro}</p>
          <div className="flex flex-wrap gap-4">
            {contact.links.map((link, index) => (
              <Button key={index} variant="outline" asChild>
                <Link
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? '_self' : '_blank'}
                >
                  {getIcon(link.icon)}
                  {link.text}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
