---
title: "Trove 1.1.0 — the deep dive"
date: "2026-05-31"
author: "Arnav Goel"
tag: "Release"
excerpt: "33 panes, 11 Shortcuts intents, a Recorder pane that ate Screen Studio's lunch, and a ChordRegistry that finally makes ⌘? feel like a real cheatsheet. Every change in 1.1.0, explained."
---

1.1.0 is the first release where Trove stops being a clipboard manager that grew sideways and starts being a *system utility surface* — clipboard, capture, system, files, storage, all under one roof, all native, all local.

### What actually shipped

- **33 panes**, up from 24 in 1.0.0. The new arrivals are GPU, Network, Scan, Clean, Sweep, Disk Speed, Library, Account, and a rebuilt Calculator with optional live currency.
- **11 macOS Shortcuts intents** with rich entity pickers — your snippets and clipboard history now show up as real `IntentEntity` instances inside the Shortcuts editor, complete with subtitles and thumbnails.
- **A ChordRegistry-backed ⌘? overlay** that scrapes every key combo from the running app at boot. No hand-rolled cheatsheets going stale — if a pane registers a chord, it shows up in the overlay.

### The Recorder pane, in detail

The Recorder pane was rebuilt from scratch with 17 pro-grade features in one pass:

- Click ripple, in the Screen Studio style — emits a radial pulse anywhere a mouse-down lands.
- Keystroke overlay — bottom-center pill showing the last 3 keys pressed, auto-fading.
- Voice-activity auto-pause — drops the writeable frames to disk only while the mic is hot, saving disk and editor time.
- Separate audio tracks in the .mov — system audio and mic land on independent tracks so you can rebalance in post without re-recording.
- Webcam picture-in-picture with corner snap.
- Region snap to active window, active screen, or freeform draw.
- Frame interpolation up to 60 FPS with adaptive bitrate.

### What's next

1.1.1 ships the signed + notarized channel — the Cask formula auto-flips when it lands, no action from you. After that, the focus shifts to the Awake pane (auto-disable on lid close), Library reorganization (smart playlists by extension), and a global Settings → Themes panel that ties the visual customization across every pane.

If you've been holding off on upgrading, this is the build to install. `brew install --cask trove` once the tap publishes; until then, grab the dmg from [GitHub Releases](https://github.com/ArnavGoel03/trove/releases).
