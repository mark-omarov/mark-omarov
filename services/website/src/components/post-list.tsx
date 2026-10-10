import Link from 'next/link';
import { StageIcon } from '~/components/stage-icon';
import { formatDate, type PostMeta } from '~/lib/posts';

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-soft">
        Nothing here yet. It&apos;s coming, I promise. Grab the{' '}
        <a href="/rss.xml" className="text-cyan link">
          rss feed
        </a>{' '}
        and you&apos;ll know the moment it isn&apos;t empty.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.slug} className="flex flex-col gap-x-6 sm:flex-row">
          <time
            dateTime={post.date.toISOString()}
            className="text-muted shrink-0 text-sm sm:w-28 sm:pt-px"
          >
            {formatDate(post.date)}
          </time>
          <div>
            <Link href={`/blog/${post.slug}`} className="hover:text-blue">
              <StageIcon stage={post.stage} size={14} /> {post.title}
              {post.draft && (
                <span className="text-orange ml-2 text-xs">[draft]</span>
              )}
            </Link>
            {post.description && (
              <p className="text-muted text-sm">{post.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
