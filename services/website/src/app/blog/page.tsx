import type { Metadata } from 'next';
import { pageMeta } from '~/lib/meta';
import { GardenView } from '~/components/garden-view';
import { PostList } from '~/components/post-list';
import { getAllPosts, getGarden } from '~/lib/posts';

export const metadata: Metadata = pageMeta({
  title: 'blog',
  description: 'Notes on software, homelabs and whatever else.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const { notes, links } = await getGarden();
  const index = new Map(notes.map((n, i) => [n.slug, i]));
  const edges = links.map(
    (l) => [index.get(l.from)!, index.get(l.to)!] as [number, number]
  );

  return (
    <>
      <GardenView
        notes={notes.map(({ slug, title, stage }) => ({ slug, title, stage }))}
        links={edges}
      />
      <div className="page mt-10">
        <h1 className="font-pixel text-4xl leading-none">blog</h1>
        <p className="text-soft mt-4">
          Notes on software, homelabs and whatever else I&apos;m into.{' '}
          <a href="/rss.xml" className="text-cyan link">
            rss
          </a>
        </p>
        <div className="mt-10">
          <PostList posts={posts} />
        </div>
      </div>
    </>
  );
}
