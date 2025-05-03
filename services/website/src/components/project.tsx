import { Button } from '@workspace/ui/components/ui/button';
import Link from 'next/link';
import { type Project } from '~/data/content';
import type { HTMLProps } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { getIcon } from '~/components/get-icon';

export function Project({
  project,
  className,
  ...rest
}: HTMLProps<HTMLDivElement> & { project: Project }) {
  return (
    <div
      {...rest}
      className={cn(
        'bg-card flex flex-col justify-between rounded-lg border p-4 shadow-sm',
        className
      )}
    >
      <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.links.map((link, i) => (
          <Button key={i} variant="outline" size="sm" asChild>
            <Link href={link.href} target="_blank">
              {getIcon(link.icon)}
              {link.text}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
