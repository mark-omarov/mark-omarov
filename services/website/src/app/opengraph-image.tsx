import { OG_SIZE, siteImage } from '~/lib/og';

export const alt =
  'omarov.dev: pixel art of Tokyo at night, Tokyo Tower behind the train tracks';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return siteImage();
}
