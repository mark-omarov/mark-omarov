import type { Metadata } from 'next';
import { pageMeta } from '~/lib/meta';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StageIcon, STAGE_LABEL } from '~/components/stage-icon';
import { SITE } from '~/data/site';
import { LocalGraph } from '~/components/local-graph';
import { formatDate, getAllPosts, getLocalGraph, getPost } from '~/lib/posts';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  // Next needs at least one param for a fully static dynamic route.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: post.date.toISOString(),
      modifiedTime: post.updated?.toISOString(),
      authors: [SITE.name],
      tags: post.tags,
    },
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const posts = await getAllPosts();
  const local = await getLocalGraph(slug);
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <article className="page mt-10">
      <Link href="/blog" className="text-muted hover:text-fg text-sm">
        ← all posts
      </Link>
      <header className="mt-6">
        <h1 className="text-fg text-2xl font-bold leading-snug sm:text-3xl">
          {post.title}
        </h1>
        <p className="text-muted mt-3 text-sm">
          <span className="text-green">
            <StageIcon stage={post.stage} size={14} /> {STAGE_LABEL[post.stage]}
          </span>{' '}
          ·{' '}
          <time dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          {post.updated && <> · updated {formatDate(post.updated)}</>} ·{' '}
          {post.readingMinutes} min read
          {post.tags.length > 0 && (
            <> · {post.tags.map((t) => `#${t}`).join(' ')}</>
          )}
          {post.draft && <span className="text-orange"> · draft</span>}
        </p>
      </header>

      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {local.nodes.length > 1 && (
        <section aria-labelledby="nearby" className="mt-16">
          <h2 id="nearby" className="heading text-base">
            nearby
          </h2>
          <div className="mt-4">
            <LocalGraph nodes={local.nodes} edges={local.edges} />
          </div>
        </section>
      )}

      {post.backlinks.length > 0 && (
        <aside aria-labelledby="backlinks" className="mt-16">
          <h2 id="backlinks" className="heading text-base">
            linked from
          </h2>
          <ul className="mt-3 space-y-2">
            {post.backlinks.map((b) => (
              <li key={b.slug}>
                <Link href={`/blog/${b.slug}`} className="hover:text-green">
                  <StageIcon stage={b.stage} size={14} /> {b.title}
                </Link>
                {b.description && (
                  <p className="text-muted text-sm">{b.description}</p>
                )}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <footer className="border-line mt-16 border-t border-dashed pt-6 text-sm">
        <p className="text-soft">
          Thoughts? Corrections?{' '}
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Re: ${post.title}`)}`}
            className="text-cyan link"
          >
            Reply by email
          </a>
          .
        </p>
        <nav
          aria-label="more posts"
          className="mt-6 flex justify-between gap-6"
        >
          {older ? (
            <Link href={`/blog/${older.slug}`} className="hover:text-blue">
              ← {older.title}
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="hover:text-blue text-right"
            >
              {newer.title} →
            </Link>
          )}
        </nav>
      </footer>
    </article>
  );
}
