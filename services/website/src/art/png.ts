import 'server-only';

import { deflateSync } from 'node:zlib';
import type { Frame } from './frame';

// Minimal PNG encoder for frames (RGBA, no filtering). Used at build time
// for link previews, the garden map and the 404 page, so the server can
// render pixel art without pulling in an image library.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** Encodes a frame as PNG, upscaled by an integer factor with hard pixels. */
export function encodePNG(f: Frame, scale = 1): Buffer {
  const w = f.w * scale;
  const h = f.h * scale;
  const rgba = f.rgba();
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1);
    raw[row] = 0; // filter: none
    const sy = Math.floor(y / scale);
    for (let x = 0; x < w; x++) {
      const si = (sy * f.w + Math.floor(x / scale)) * 4;
      const di = row + 1 + x * 4;
      raw[di] = rgba[si]!;
      raw[di + 1] = rgba[si + 1]!;
      raw[di + 2] = rgba[si + 2]!;
      raw[di + 3] = rgba[si + 3]!;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', new Uint8Array(0)),
  ]);
}

export function pngDataURL(f: Frame, scale = 1) {
  return `data:image/png;base64,${encodePNG(f, scale).toString('base64')}`;
}
