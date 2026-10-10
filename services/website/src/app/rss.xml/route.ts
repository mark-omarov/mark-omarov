import { SITE } from '~/data/site';
import { getAllPosts, getPost } from '~/lib/posts';

export const dynamic = 'force-static';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const cdata = (s: string) =>
  `<![CDATA[${s.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export async function GET() {
  const posts = await getAllPosts();
  const items = await Promise.all(
    posts.map(async (meta) => {
      const post = await getPost(meta.slug);
      const url = `${SITE.url}/blog/${meta.slug}`;
      return `    <item>
      <title>${escape(meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${meta.date.toUTCString()}</pubDate>${
        meta.description
          ? `\n      <description>${escape(meta.description)}</description>`
          : ''
      }${meta.tags.map((t) => `\n      <category>${escape(t)}</category>`).join('')}
      <content:encoded>${cdata(post?.html ?? '')}</content:encoded>
    </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}/blog</link>
    <description>${escape(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />${
      posts[0]
        ? `\n    <lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>`
        : ''
    }
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
