import { content } from '~/data/content';
import { Project } from '~/components/project';

export default function ProjectsPage() {
  const { projects } = content;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{projects.title}</h1>
        <p className="text-muted-foreground">{projects.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((project) => (
          <Project project={project} key={project.title} />
        ))}
      </div>
    </div>
  );
}
