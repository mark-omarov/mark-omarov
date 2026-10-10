import Link from 'next/link';
import { SceneViewer } from '~/components/scene-viewer';
import { PostList } from '~/components/post-list';
import { INTRO, LINKS, THINGS } from '~/data/site';
import { getAllPosts } from '~/lib/posts';

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 5);

  return (
    <>
      <SceneViewer />

      <div className="page mt-10 space-y-16">
        <section>
          <h1 className="font-pixel text-fg text-4xl leading-none sm:text-5xl">
            {INTRO.greeting}
          </h1>
          <div className="text-soft mt-5 space-y-4">
            {INTRO.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="writing">
          <div className="flex items-baseline justify-between">
            <h2 id="writing" className="heading">
              writing
            </h2>
            {posts.length > 0 && (
              <Link href="/blog" className="text-muted hover:text-fg text-sm">
                all posts →
              </Link>
            )}
          </div>
          <div className="mt-4">
            <PostList posts={posts} />
          </div>
        </section>

        <section aria-labelledby="made">
          <h2 id="made" className="heading">
            open source
          </h2>
          <p className="text-muted mt-4 text-sm">
            Most of my work lives inside the companies I&apos;ve worked for, so
            you won&apos;t find it here. Some of it might end up in the blog.
          </p>
          <ul className="mt-5 space-y-5">
            {THINGS.map((t) => (
              <li key={t.name}>
                {t.href ? (
                  <a href={t.href} className="text-yellow link">
                    {t.name}
                  </a>
                ) : (
                  <span className="text-yellow">{t.name}</span>
                )}
                <p className="text-soft">{t.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="hello">
          <h2 id="hello" className="heading">
            say hi
          </h2>
          <p className="text-soft mt-4">
            Email is the easiest way to reach me.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-cyan link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
