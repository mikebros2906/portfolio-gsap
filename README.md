# Somik Chowdhury — GSAP Scroll Portfolio v3

Cinematic scroll-driven portfolio with **smooth, resize-safe GSAP** animations. No content overflow, no jarring bursts, no layout shifts on window resize.

## What was fixed from v2

| Problem | Fix |
|---|---|
| About text overflowed viewport | Reduced font to `clamp(15px, 1.35vw, 18px)`, right panel has `max-height + overflow-y: auto`, dynamic scroll height based on word count |
| Resize broke pinned sections | `invalidateOnRefresh: true` on all ScrollTriggers, debounced `ScrollTrigger.refresh()` on resize, functional height values |
| Animations felt "burst-y" | All transforms reduced: `translateY(16px)` not `120%`, no `rotate(8deg)`, scale range `0.85–1.05` not `0.7–1.2`, `overwrite: true` on magnetic/tilt to prevent stacking |
| No active nav state | Added scroll spy — current section highlights its nav link |
| Word reveal broke on resize | Switched from per-word ScrollTrigger instances to single `onUpdate` callback with progress-based batching |

## Animation Systems

| # | System | Technique |
|---|---|---|
| 1 | Custom cursor | Dot + elastic-lag ring, hover expand on interactive elements |
| 2 | Magnetic hover | Nav links, buttons, social icons pull toward mouse |
| 3 | Floating particles | Canvas ambient particle field |
| 4 | Animated loader | Per-char stagger-in, counting %, bar fill, stagger-out |
| 5 | Scroll progress | 2px gradient bar tracking total page scroll |
| 6 | Scroll spy | Active nav link highlights based on viewport position |
| 7 | Hero char-split | Each letter slides up smoothly (16px, not 120%) |
| 8 | Coder scene entrance | SVG illustration fades/slides in alongside the name |
| 9 | Code typing animation | 14 code lines scale from 0 width with staggered timing |
| 10 | Floating code symbols | 8 symbols (`</>`, `{ }`, `=>`, etc.) drift with sine-wave loops |
| 11 | Cursor line-hop | Typing cursor jumps between code lines on a looping timeline |
| 12 | Head bob | Subtle 2px vertical float on the coder's head |
| 13 | Scene scroll parallax | Scene moves at different rate than text; symbols move fastest |
| 14 | Hero parallax exit | Gentle y:-80 + fade on scroll away |
| 15 | About word reveal | Words light up progressively via single scrub callback |
| 16 | Marquee ticker | Infinite skill scroll, speed modulates gently with scroll |
| 17 | Divider draw | Lines scale from center on scroll entry |
| 18 | Experience horizontal | Cards scroll left with progress bar, subtle x:40 entrance |
| 19 | Project 3D tilt | Gentle ±6° rotation tracking mouse, radial shine follow |
| 20 | Skills category morph | Pinned scroll cycles through categories, chips fade in/out |
| 21 | Education slide-in | Cards slide from left with opacity |
| 22 | Cert stagger | 3-column grid with row-aware stagger delay |
| 23 | Contact char reveal | Per-letter rise, then sub + links stagger |
| 24 | Glow parallax | 3 ambient orbs shift at different scrub speeds |

## Quick start

```bash
cd portfolio-gsap
python3 -m http.server 8000   # open localhost:8000
```

## Deploy

Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
