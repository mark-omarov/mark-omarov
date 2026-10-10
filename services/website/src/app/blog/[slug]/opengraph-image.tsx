import { OG_SIZE, postImage } from '~/lib/og';
import { getAllPosts, getGarden, getPost } from '~/lib/posts';

export const alt =
  'Blog post on omarov.dev, with its plant in the pixel garden';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }];
}

export default async function PostImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const { notes, links } = await getGarden();
  const index = new Map(notes.map((n, i) => [n.slug, i]));
  return postImage({
    title: post?.title ?? 'omarov.dev',
    stage: post?.stage ?? 'seedling',
    notes,
    links: links.map((l) => [index.get(l.from)!, index.get(l.to)!]),
    index: index.get(slug) ?? -1,
  });
}
