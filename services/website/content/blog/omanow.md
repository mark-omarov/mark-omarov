---
title: I made omanow, a live globe of omarchy machines
date: 2026-10-17
description: A pixel globe that shows where omarchy machines are online right now, by city, and the privacy rules that make it safe to switch on.
tags: [omarchy, open-source, privacy]
draft: false
---

I've been running [omarchy](https://omarchy.org) for a while, and at some point I wanted to know who else is out there. Not names. Just the shape of it. Is anyone else in my city? Is it mostly Europe? How many of us are online at 3am?

So I built [omanow](https://omanow.mark-omarov.workers.dev). It's a pixel globe of the omarchy machines that are online right now, by city.

![A pixel-art globe turning slowly, with glowing cities streaming particles into the OMANOW wordmark](https://raw.githubusercontent.com/mark-omarov/omanow/main/docs/media/hero.gif)

The globe in that clip is running on a simulated crowd. The real map is close to empty today, because it launched today. That's the honest state of it.

## How it works

omanow is two things: a website and a bar plugin.

The plugin puts a small globe in your omarchy bar. It stays hidden like the indicators until you hover the middle of the bar. Click it, pick your city, flip the switch, and your machine counts toward that city for as long as it's online. Switch it off and it's gone.

![The omanow popup in the omarchy bar with a sharing switch and a city picker](https://raw.githubusercontent.com/mark-omarov/omanow/main/docs/media/plugin.png)

The website draws the globe. Busier cities glow brighter, and joins stream up into the wordmark. Green pins mark every meetup on [omarchy.org/meetups](https://omarchy.org/meetups), so you can also see where people are getting together in person. If you open the map from the plugin, it uses your current omarchy theme and follows you when you switch themes.

## What it knows about you

This was the part I cared about most, because a map of where people are is easy to get wrong.

- It's off until you switch it on. Opening the website shares nothing.
- While it's on, the plugin sends two things once an hour: the city you picked and a random id the plugin made up when you installed it.
- The server keeps a hash of that id, the city and the minute it last heard from you. It deletes all of it an hour after the last check-in, or the moment you switch off.
- A city only shows up once three machines are in it, so a single person in a small town never appears as a dot.
- The map updates once a minute and batches every change in that minute together, so nobody can tell exactly when you joined.
- No names, accounts, IP addresses, coordinates, cookies or analytics.

The locate button finds your nearest city from your weather setting or your timezone, on your machine. Your coordinates never leave it.

## How it's built

The whole thing runs on Cloudflare's free plan: the website and API in a Worker, and every machine online in one Durable Object with SQLite. The globe is a small renderer with no DOM in it, which means the same code draws the website and runs inside omarchy's own shell. The plugin is a QML widget that sends one request an hour.

It's all [open source under MIT](https://github.com/mark-omarov/omanow). The code that decides what gets sent is short enough to read in a few minutes, and I'd rather you read it than take my word for it.

## Try it

```sh
omarchy plugin add https://github.com/mark-omarov/omanow-plugin --enable
omarchy bar move io.github.mark-omarov.omanow --after omarchy.indicators
```

It's also on the [omarchy plugin marketplace](https://plugins.omarchy.org/plugin.html?id=io.github.mark-omarov.omanow). If your city is missing from the map, it's because nobody there has switched it on yet.

## What's next

I have a list of ideas: little chat rooms on the globe, visiting other cities, maybe putting AIs on the map. I'm not building any of them until people are actually using it, because the first few replies will tell me which one matters.

If you try it, I'd love to hear what you think. Issues are open on [GitHub](https://github.com/mark-omarov/omanow/issues), and if you find it useful, a heart on the plugin page helps other omarchy users find it.
