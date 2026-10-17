---
title: i made omanow, a live globe of omarchy machines
date: 2026-10-17
description: a pixel globe that shows where omarchy machines are online right now, by city.
draft: false
---

i've had this idea pretty much since i started using [omarchy](https://omarchy.org) and saw all the hype around it. i thought it would be cool to actually see where all of us are.

so i built [omanow](https://omanow.mark-omarov.workers.dev). it's a pixel globe of the omarchy machines that are online right now, by city. a globe just felt like the most fitting way to show it.

<video src="/blog/omanow/hero.mp4" poster="/blog/omanow/hero.jpg" autoplay muted loop playsinline aria-label="A pixel-art globe turning slowly, with glowing cities streaming particles into the OMANOW wordmark"></video>

ofc the clips are running a simulated crowd. the real map is pretty empty right now, because it launched today. every dot from here on is a real machine, so it's up to us :)

## how it works

it's two things: a plugin for the omarchy bar and a website.

the plugin puts a small globe in your bar, hidden like the indicators until you hover. click it, pick your city, flip the switch, and your machine counts toward that city while it's online. switch it off and you're gone.

![the omanow popup in the omarchy bar, with a sharing switch, a city picker and an open-the-map button](/blog/omanow/plugin.png)

the website draws the globe. busier cities glow brighter, and every new machine shoots a little burst of particles into the logo. drag to spin it, scroll to zoom until city names show up.

you can also click any city and wave at it 👋 ❤️ ☕ 🔥 🌙. everyone watching sees it pop up from that city, and people there see how many waves they got right in their bar. there's also a history of how many of us were on the map each day.

<video src="/blog/omanow/waves.mp4" poster="/blog/omanow/waves.jpg" autoplay muted loop playsinline aria-label="Clicking Warsaw on the globe and sending a wave, a heart and a fire, each rising from the city"></video>

only machines running the plugin count. just opening the website doesn't put you on the map.

## meetups are on it too

green pins are every omarchy meetup from [omarchy.org/meetups](https://omarchy.org/meetups), past and upcoming. click one for the date, the place and a link to sign up.

<video src="/blog/omanow/meetups.mp4" poster="/blog/omanow/meetups.jpg" autoplay muted loop playsinline aria-label="The globe gliding to Japan, where green meetup pins pulse over Tokyo"></video>

## in your theme

all the stock omarchy themes are there. open the map from the plugin and it uses yours, and if you switch themes while it's open, the map switches with it.

<video src="/blog/omanow/themes.mp4" poster="/blog/omanow/themes.jpg" autoplay muted loop playsinline aria-label="The globe blending from one omarchy theme to the next"></video>

## what it knows about you

privacy matters, nobody should be identifiable on this map:

- while sharing is on, the plugin sends your city and a random install id once an hour. no names, accounts, ip addresses, coordinates, cookies or analytics.
- cities with fewer than three machines get a dim dot with no count, and only change on the hour, so nobody can tell when you're online.
- switch it off and you're gone right away. otherwise everything about your machine is deleted a day after its last check-in.

the locate button guesses your city from your weather setting or timezone, on your machine. coordinates never leave it.

## how i built it

i vibed this one. the code is pretty much all generated, the decisions are mine, and honestly i think it turned out pretty good.

omarchy installs plugins by cloning a git repo, so the plugin lives in its own repo, [omanow-plugin](https://github.com/mark-omarov/omanow-plugin), and everything in there is generated. the real work happens in [the monorepo](https://github.com/mark-omarov/omanow). when a release merges there, ci builds the plugin and pushes it to the plugin repo with a tag, so `omarchy plugin update` just picks it up.

ok, for the nerds like me :) it's all on cloudflare workers. the whole map is literally one durable object with sqlite, that's it. your plugin pings it once an hour, and once a minute it batches whatever changed and pushes it to everyone watching over websockets (hibernating ones, so idle tabs cost pretty much nothing). the globe itself is a tiny pixel renderer in plain js, no libraries, no dom, it just draws into a pixel buffer and scales it up. the plugin is a qml widget that shares the city list and theme code with the website, which is why the map looks exactly like your omarchy theme.

it's all [open source, mit](https://github.com/mark-omarov/omanow). the code that sends stuff is short, so feel free to check it yourself.

## try it

```sh
omarchy plugin add https://github.com/mark-omarov/omanow-plugin --enable
omarchy bar move io.github.mark-omarov.omanow --after omarchy.indicators
```

it's also on the [omarchy plugin marketplace](https://plugins.omarchy.org/plugin.html?id=io.github.mark-omarov.omanow). if your city isn't on the map, nobody there has switched it on yet.

<video src="/blog/omanow/promo.mp4" poster="/blog/omanow/promo.jpg" controls muted playsinline preload="none" aria-label="A 22-second tour of omanow"></video>

## what's next

i really hope the community picks it up, and if people actually run it, there's more coming. i have a few bigger ideas too, but for now they're just ideas.

if you try it, tell me what you think, issues are open on [github](https://github.com/mark-omarov/omanow/issues). and if you like it, a star on [github](https://github.com/mark-omarov/omanow) or a heart on the [plugin page](https://plugins.omarchy.org/plugin.html?id=io.github.mark-omarov.omanow) helps other omarchy people find it.
