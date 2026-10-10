import Image from 'next/image';
import Link from 'next/link';
import { Frame } from '~/art/frame';
import { pngDataURL } from '~/art/png';
import { SCENE_H } from '~/art/scene';
import { nizhnevartovsk } from '~/art/scenes/nizhnevartovsk';

const W = 240;

// a still of the coldest, emptiest place on the list
function still() {
  const f = new Frame(W, SCENE_H);
  nizhnevartovsk.create(W, SCENE_H).render(f, 9_000);
  return pngDataURL(f, 2);
}

export default function NotFound() {
  return (
    <div className="page mt-16 text-center">
      <Image
        src={still()}
        alt="Pixel art: a snowy cabin under the northern lights"
        width={W * 2}
        height={SCENE_H * 2}
        unoptimized
        className="mx-auto block w-full max-w-[480px] [image-rendering:pixelated]"
      />
      <h1 className="font-pixel mt-10 text-5xl leading-none">404</h1>
      <p className="text-soft mt-4">
        Nothing out here but snow. This page doesn&apos;t exist.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-cyan link">
          back home
        </Link>
      </p>
    </div>
  );
}
