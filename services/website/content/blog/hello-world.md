---
title: Hello, world
date: 2026-10-08
description: A placeholder post that shows off what the markdown renderer can do. Rewrite me or delete me.
tags: [meta]
draft: true
---

This is a draft, so it only shows up when running `pnpm dev`. Use it to check how
posts look, then turn it into a real first post (or delete it).

## Headings get anchors

Hover a heading and a `#` shows up so people can link straight to a section.

### Code

Highlighting uses the Tokyo Night theme, same as the rest of the site:

```ts
type Plant = { kind: 'sunflower' | 'tulip'; plantedAt: number };

function age(plant: Plant, now = Date.now()) {
  return (now - plant.plantedAt) / 86_400_000;
}
```

```bash
kubectl get pods -A | grep -v Running  # the homelab morning ritual
```

### Lists and things

- regular lists
- with **bold**, _italics_ and `inline code`
- [links](https://omarov.dev)

1. numbered
2. lists
3. too

- [x] task lists
- [ ] that render as checkboxes

> Blockquotes for when somebody else said it better.

| thing     | status        |
| --------- | ------------- |
| tables    | work          |
| footnotes | also work[^1] |

---

That's it. Bye for now.

[^1]: Like this one.
