# omarov.dev

Next.js on Vercel. Every push to `main` deploys to production.

## Copy

- **Every visible string is lowercase**: headings, post titles, UI copy, dates, captions. Exceptions: SEO metadata (`<title>`, descriptions, OG alt text), aria-labels, code, official third-party names (course titles on /learned, vim's own messages in the vim overlay).
- **Spaced hyphen, comma, or a new sentence** wherever an em dash would go. The repo has zero em dashes.
- **Short and plain.** Say the thing and stop. Explain how something works only when the reader needs it. Phrases like "full honesty", "here's exactly what happens", "the part i cared about most", "it's worth noting" read as AI and never belong here.

## Posts

Posts live in `content/blog/` and are written in Mark's voice: casual, lowercase, his own jokes and phrasing ("pretty much", "idk", "lol", ":)").

- Edit only what blocks reading. Keep his wording.
- Every fact, anecdote and feeling comes from Mark. Flag any sentence you wrote yourself.
- When in doubt, share less about other people (family, employers).
- Posts are finished stories and launches. The garden on /blog sizes each plant from the post's word count; there is no per-post growth field.
- `draft: true` posts render in `pnpm dev` only.

## Code

- Doc comments on public API and module boundaries only. Internal code carries no comments.

## Checking UI

- Check every UI change at 1440 px and 390 px wide.
- React Scan and the Next badge are dev-only overlays. Ignore them, or screenshot a production build (`pnpm preview`).

## Commits

- Nothing is committed or pushed until Mark has seen the change.
- Conventional commits: short title, no body, no co-author line.
- Commits are signed through 1Password, so each one waits for Mark to approve it. Signing always stays on.
