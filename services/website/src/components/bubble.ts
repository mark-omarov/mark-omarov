/**
 * Which way a tooltip bubble hangs: centred over the point, or off to one
 * side when there isn't room for half a bubble before the edge.
 */
export function bubbleSide(x: number, w: number, scale: number) {
  const room = 140; // css px, a bit over half the widest bubble
  if (x * scale < room) return 'bubble-start';
  if ((w - x) * scale < room) return 'bubble-end';
  return '';
}
