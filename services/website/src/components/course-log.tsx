'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CERT_H,
  CERT_W,
  type CertTopic,
  drawCertificate,
} from '~/art/certificate';
import { Frame } from '~/art/frame';

export type CourseEntry = {
  id: string;
  title: string;
  issuer: string;
  type: string;
  date: string;
  topic: CertTopic;
  note?: string;
  href: string;
  cert: string | null;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const when = (date: string) => {
  const [y = date, m] = date.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};

/** The printed certificate, animated while the dialog is open. */
function Certificate({ course, seed }: { course: CourseEntry; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const f = new Frame(CERT_W, CERT_H);
    const image = new ImageData(f.rgba(), CERT_W, CERT_H);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (!still) raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 1000 / 30) return;
      last = now;
      f.clear();
      drawCertificate(f, still ? 2_000 : now - start, {
        topic: course.topic,
        seed,
        kind:
          course.type === 'Course'
            ? 'CERTIFICATE OF COMPLETION'
            : course.type.toUpperCase(),
        title: course.title,
        issuer: course.issuer,
        date: when(course.date),
      });
      ctx.putImageData(image, 0, 0);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [course, seed]);
  return (
    <canvas
      ref={ref}
      width={CERT_W}
      height={CERT_H}
      className="mx-auto block w-[288px] max-w-full [image-rendering:pixelated] sm:w-[432px]"
      style={{ aspectRatio: `${CERT_W} / ${CERT_H}` }}
      aria-hidden
    />
  );
}

/**
 * The course log: titles open a dialog with a little printed certificate,
 * the details and the links, instead of sending you off to a PDF. The open
 * course goes in the URL hash so it can be linked to.
 */
export function CourseLog({ years }: { years: [string, CourseEntry[]][] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<CourseEntry | null>(null);
  const all = years.flatMap(([, cs]) => cs);

  const show = (c: CourseEntry) => {
    setOpen(c);
    if (!dialog.current?.open) dialog.current?.showModal();
    history.replaceState(null, '', `#${c.id}`);
  };
  const close = () => dialog.current?.close();

  // open the course in the hash, on load and when the hash changes
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const c = all.find((x) => x.id === id);
      if (c) show(c);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="mt-12 space-y-10">
        {years.map(([year, courses]) => (
          <section key={year} aria-labelledby={`y${year}`}>
            <h2 id={`y${year}`} className="heading">
              {year}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {courses.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-baseline gap-x-3"
                >
                  <button
                    type="button"
                    onClick={() => show(c)}
                    aria-haspopup="dialog"
                    className="link cursor-pointer text-left"
                  >
                    {c.title}
                  </button>
                  <span className="text-muted text-xs">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="course-dialog pixel-frame pixel-frame-studs"
        aria-labelledby="course-title"
        onClose={() => {
          setOpen(null);
          history.replaceState(null, '', location.pathname + location.search);
        }}
        onClick={(e) => {
          // a click on the backdrop (the dialog element itself) closes it
          if (e.target === e.currentTarget) close();
        }}
      >
        {open && (
          <div className="space-y-4">
            <Certificate
              key={open.id}
              course={open}
              seed={all.indexOf(open) + 1}
            />
            {/* all of this is printed on the certificate already */}
            <div className="sr-only">
              <h2 id="course-title">{open.title}</h2>
              <p>
                {open.issuer} · {open.type} · {when(open.date)}
              </p>
            </div>
            {open.note && <p className="text-soft text-sm">{open.note}</p>}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href={open.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {open.cert ? 'course page' : 'certificate'} ↗
              </a>
              {open.cert && (
                <a
                  href={open.cert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  certificate (pdf) ↗
                </a>
              )}
              <button
                type="button"
                onClick={close}
                className="text-muted hover:text-fg ml-auto cursor-pointer text-xs"
              >
                close [esc]
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
