import type { Metadata } from 'next';
import { pageMeta } from '~/lib/meta';
import { type CourseEntry, CourseLog } from '~/components/course-log';
import { HolopinBoard } from '~/components/holopin-board';
import { courseLinks, coursesByYear } from '~/data/courses';

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const metadata: Metadata = pageMeta({
  title: 'learned',
  description: "Courses I've worked through over the years, kept as a log.",
  path: '/learned',
});

export default function LearnedPage() {
  const years = coursesByYear();
  const log = years.map(([year, courses]): [string, CourseEntry[]] => [
    year,
    courses.map((c) => ({
      id: `${slug(c.title)}-${c.date.slice(0, 7)}`,
      title: c.title,
      issuer: c.issuer,
      type: c.type,
      date: c.date,
      topic: c.category,
      note: c.note,
      ...courseLinks(c),
    })),
  ]);

  return (
    <div className="page mt-10">
      <h1 className="font-pixel text-4xl leading-none">learned</h1>
      <p className="text-soft mt-4">
        Courses and certificates I&apos;ve picked up over the years, mostly
        self-paced online stuff. Kept here as a log.
      </p>

      <section aria-labelledby="badges" className="mt-10">
        <h2 id="badges" className="heading">
          badges
        </h2>
        <div className="mt-5">
          <HolopinBoard />
        </div>
      </section>

      <CourseLog years={log} />
    </div>
  );
}
