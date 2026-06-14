# Portfolio Code Walkthrough — Every Block Explained

This document walks through all three files (`index.html`, `styles.css`, `app.js`) and explains what every code block does, why it exists, and how it connects to the overall system.

---

## FILE 1: index.html — The Structure

The HTML file is purely structural. It contains no content text at all (except the two statement quotes). Every name, project, certification, skill, and contact link is injected by `app.js` from `portfolio-data.json` at runtime. This is what makes the site data-driven — edit the JSON, refresh, everything updates.

### Lines 1–12: Head & Font Loading

```html
<html lang="en" data-theme="dark">
```

`data-theme="dark"` on the root `<html>` element is the theme system anchor. Every CSS color variable reads from this attribute. When JS changes it to `"light"`, all 18+ CSS variables flip instantly.

The three Google Fonts loaded are:
- **Syne** (800 weight) — used for all headings, hero title, section titles. It's a bold geometric display font.
- **DM Sans** (300/400/500) — used for body text and descriptions. Light weight for that editorial feel.
- **IBM Plex Mono** (400/500) — used for all labels, tags, dates, navigation. Monospace fonts signal "technical/engineering."

### Lines 14–18: Global Overlay Elements

```html
<div class="grain"></div>
<canvas class="particles" id="particles"></canvas>
<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>
<div class="progress" id="progress"></div>
```

These are five fixed-position layers that sit on top of or behind everything:

- **grain** — An SVG noise texture overlaid on the entire page at 3% opacity. Adds a subtle film/print texture that prevents the design from looking flat digital.
- **particles** — A `<canvas>` element where JS draws 45 tiny floating amber dots. They drift slowly across the screen creating ambient depth.
- **cursor / cursor-ring** — The custom cursor system. The `cursor` div is the small dot that snaps to your mouse position instantly. The `cursor-ring` div is the larger ring that follows with elastic lag (moves at 10% of the distance per frame).
- **progress** — A 2px bar at the very top of the viewport. Its width is controlled by a CSS variable `--sp` that JS updates on every scroll frame.

### Lines 21–26: Loader

```html
<div class="loader" id="loader">
  <div class="loader__name" id="loaderName"></div>
  <div class="loader__bar"><div class="loader__fill" id="loaderFill"></div></div>
  <span class="loader__pct" id="loaderPct">0</span>
</div>
```

A full-screen overlay that shows while the page loads. JS splits your name into individual `<span class="char">` elements inside `loaderName`, animates them rising up one by one using GSAP, then fills the progress bar from 0% to 100% with a counting number. When it hits 100, the chars animate out upward and the loader fades away. Only then do all the main animations begin — this prevents the user from seeing half-rendered content.

### Lines 28–45: Navigation

```html
<header class="nav" id="nav">
  <a class="nav__brand magnetic">SC</a>
  <nav class="nav__menu">
    <a class="nav__link" data-section="about">About</a>
    ...
    <a class="nav__link--cta" data-section="contact">Contact</a>
  </nav>
  <button class="theme-toggle" id="themeToggle">
    <svg class="theme-toggle__sun">...</svg>
    <svg class="theme-toggle__moon">...</svg>
  </button>
  <button class="nav__toggle" id="navToggle">...</button>
</header>
```

Key design decisions:

- **`data-section="about"`** — Each nav link carries a `data-section` attribute. The scroll spy system (in JS) watches which section is in the viewport and adds an `.active` class to the matching nav link, creating the underline indicator.
- **`class="magnetic"`** — Any element with this class gets the magnetic hover effect: when your mouse enters, the element physically pulls toward the cursor by 20% of the offset distance using GSAP.
- **Theme toggle** — Contains two SVG icons (sun and moon) stacked on top of each other. CSS transitions swap which one is visible based on `[data-theme]`. The moon slides down/rotates when switching to light; the sun slides up/rotates when switching to dark.
- **`nav__toggle`** — The hamburger menu for mobile. Two `<span>` elements that CSS rotates into an X shape when the `.open` class is added.
- **The nav starts invisible** (`opacity:0; transform:translateY(-20px)` in CSS). It only appears after you scroll past 80% of the hero section — this is the GTA VI pattern where the hero owns the full viewport without nav clutter.

### Lines 47–168: Hero Section

This is the most complex section. It has four stacked layers:

**Layer 0 — Background (`hero__bg-layer`):**
```html
<div class="hero__grid"></div>
<div class="hero__glow hero__glow--1"></div>
<div class="hero__glow hero__glow--2"></div>
```
- `hero__grid` — CSS-only grid lines created with `linear-gradient` repeating at 80px intervals. A radial `mask-image` fades the edges so lines are only visible in the center. Creates a technical/architectural feel.
- Two `hero__glow` divs — large (600px/500px) blurred circles, one copper-tinted top-right and one blue-tinted bottom-left. These are the ambient color atmosphere. They parallax at different speeds on scroll.

**Layer 1 — Coder Scene (`hero__scene`):**

An inline SVG illustration of a developer sitting at a desk. Every element is hand-drawn with SVG primitives:
- `<rect>` elements for the desk, monitor, keyboard, monitor stand
- `<path>` elements for the body, arms, hair (bezier curves)
- `<circle>` for the head
- A `<g class="coder__code">` group containing 12 `<rect class="code-line">` elements — these are the "lines of code" on the screen. Each starts at `scaleX(0)` and GSAP scales them to full width with staggered timing, creating a "typing" animation.
- `<rect class="coder__cursor">` — the blinking typing cursor on the screen (CSS `step-end` animation alternates opacity between 1 and 0 every 500ms)
- Three `<path class="coder__steam">` elements — the coffee mug steam, animated with CSS to float upward and fade out
- Six `<text class="float-sym">` elements — floating code symbols (`</>`, `{ }`, `/**`, etc.) that GSAP animates with continuous sine-wave drift

**Layer 2 — Tech Logos (`hero__logos`):**
```html
<div class="tech-logo tl--1" data-label="Python">
  <svg>...</svg>
</div>
```
12 technology logos (Python, Java, JavaScript, SQL, TensorFlow, Git, Tableau, HTML5, CSS3, pandas, Jupyter, Hadoop), each inside a glassmorphic circle. They're positioned absolutely around the viewport edges using the `tl--1` through `tl--12` position classes. GSAP animates each one entering from a radial direction, then floating on individual sine-wave rhythms, then scattering outward on scroll.

The `data-label` attribute is read by CSS `::after` pseudo-element to show the tech name on hover.

**Layer 3 — Foreground Text (`hero__fg`):**
```html
<p class="hero__tag" id="heroTag"></p>
<h1 class="hero__title" id="heroTitle"></h1>
<p class="hero__sub" id="heroSub"></p>
<div class="hero__actions">...</div>
<div class="hero__socials" id="heroSocials"></div>
```
All content is empty — JS fills it from the JSON. The title gets split into individual `<span class="char">` elements so GSAP can animate each letter rising up independently. The tag, subtitle, buttons, and socials each start at `opacity:0` and animate in sequentially in a GSAP timeline.

### Lines 170–173: Statement Section

```html
<section class="statement">
  <p class="statement__text">I turn <em>complex data</em> into products that <em>people actually use.</em></p>
</section>
```

A full-viewport (100vh) centered quote. JS splits every word into a `<span class="word">` that starts at 10% opacity. As you scroll, a GSAP ScrollTrigger `onUpdate` callback progressively adds the `.lit` class to words (setting opacity to 1), creating the word-by-word reveal effect. The `<em>` tags get special treatment — those words render in the primary `--ink` color while normal words stay muted.

### Lines 175–187: About Section

```html
<section class="about">
  <div class="about__pin">
    <div class="about__left">orb with rings</div>
    <div class="about__right">text + language chips</div>
  </div>
</section>
```

A pinned scroll section. On desktop, GSAP's `ScrollTrigger.pin()` locks `about__pin` to the viewport while you scroll through extra height. During this scroll:
- Each word of the summary text lights up progressively (same word-reveal technique as statements)
- The orb scales from 85% to 105%
- Language chips fade in near the end

The orb is purely CSS: a `radial-gradient` circle with `box-shadow` for glow, inside three concentric rotating rings (each `border: 1px solid` circles with `animation: spin` at different speeds/directions). Each ring has a dot orbiting via `::after` pseudo-element.

### Lines 192–207: Experience Section (GTA VI style)

```html
<section class="experience">
  <div class="experience__pin">
    <div class="experience__counter">01 / 05</div>
    <div class="experience__card" id="expCard">
      ...dates, role, company, highlights, tags...
    </div>
    <div class="experience__progress">...</div>
  </div>
</section>
```

This is the GTA VI-inspired character reveal. Instead of showing all experiences at once, there's a single card that **swaps its content** as you scroll. GSAP pins the section, calculates `scrollPerRole × totalRoles` of scroll distance, and tracks progress. When progress crosses a threshold, `showExp(idx)` fires: it animates the card out (opacity to 0, y to 20), swaps all the text content, then animates it back in. The counter in the corner updates (`01/05` → `02/05` etc.). A progress bar at the bottom fills from 0% to 100%.

### Lines 214–248: Projects, Skills, Education, Certifications, Contact

All follow the same pattern: empty containers with IDs. JS renders cards from JSON data using `insertAdjacentHTML`. Each section has its own GSAP scroll animation:
- **Projects** — Cards fade up on scroll entry, have 3D tilt on hover
- **Skills** — Pinned section where scrolling cycles through categories (same pin-and-swap technique as experience)
- **Education** — Cards slide in from the left
- **Certifications** — Cards fade up with row-staggered delay
- **Contact** — Per-character title reveal, then subtitle, then link buttons stagger in

### Lines 252–254: Script Loading

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="app.js"></script>
```

GSAP (GreenSock Animation Platform) core library and the ScrollTrigger plugin loaded from CDN. These must load before `app.js` since it calls `gsap.registerPlugin(ScrollTrigger)` immediately.

---

## FILE 2: styles.css — The Visual System

### Lines 1–4: Theme Variables

```css
[data-theme="dark"],:root { --bg:#050508; --ink:#eee9e0; --accent:#d4804a; ... }
[data-theme="light"] { --bg:#f4f0ea; --ink:#1a1814; --accent:#c0652e; ... }
```

The entire design system lives in 18 CSS custom properties. Every color in the stylesheet references a variable, never a hardcoded value. When `data-theme` changes on `<html>`, all variables instantly recalculate. The key variables:

| Variable | Dark Value | Light Value | Used For |
|----------|-----------|-------------|----------|
| `--bg` | `#050508` (near black) | `#f4f0ea` (warm cream) | Page background |
| `--ink` | `#eee9e0` (warm white) | `#1a1814` (dark brown) | Primary text |
| `--ink2` | `#a09889` (muted) | `#5a5347` (muted) | Secondary text |
| `--ink3` | `#5c5549` (dim) | `#8a8279` (dim) | Tertiary/disabled text |
| `--accent` | `#d4804a` (copper) | `#c0652e` (deeper copper) | Accent color |
| `--border` | `rgba(white, .07)` | `rgba(black, .08)` | Subtle borders |
| `--nav-bg` | `rgba(dark, .4)` | `rgba(light, .5)` | Nav backdrop |
| `--logo-label` | `#eee9e0` (white) | `#1a1814` (black) | Tech logo hover labels |
| `--glass` | `rgba(white, .03)` | `rgba(black, .03)` | Glassmorphic cards |
| `--tag-bg` | `rgba(accent, .08)` | `rgba(accent, .08)` | Skill tag backgrounds |

### Line 5: Reset & Body

```css
body { background:var(--bg); color:var(--ink); transition:background .5s, color .5s; }
```

The `transition` on background and color means theme switches crossfade smoothly over 500ms instead of flashing.

### Lines 7–11: Custom Cursor

```css
.cursor { width:8px; mix-blend-mode:difference; }
.cursor-ring { width:36px; border:1px solid rgba(accent,.4); }
body.cursor-hover .cursor { width:14px; }
body.cursor-hover .cursor-ring { width:56px; }
```

The cursor is a tiny 8px accent-colored dot. The ring is 36px with a translucent border. When JS adds `.cursor-hover` to `<body>` (on hovering interactive elements), both grow — the dot to 14px, the ring to 56px. `mix-blend-mode:difference` inverts the cursor color against whatever background it's over, making it visible everywhere. In light mode this is switched to `normal` since difference mode looks wrong on light backgrounds.

The `@media(pointer:coarse)` query hides both on touch devices — you can't hover on a phone, so custom cursors are pointless and would just create a stuck dot.

### Lines 13–20: Progress, Particles, Grain

- **Progress** uses a `::after` pseudo-element whose width is driven by `var(--sp)`. JS sets this variable on every scroll frame via `style.setProperty`.
- **Particles canvas** is `position:fixed; inset:0` covering the full viewport, behind content (`z-index:0`).
- **Grain** uses an inline SVG data URI with `feTurbulence` to generate noise. `mix-blend-mode:overlay` makes it interact with underlying colors naturally. At 3% opacity it's barely perceptible but adds tactile quality.

### Lines 22–32: Loader & Nav

The loader uses `position:fixed; inset:0; z-index:10000` — it covers everything. The `.done` class adds `pointer-events:none` so it stops blocking clicks after fading out.

The nav uses `backdrop-filter:blur(16px)` for the frosted glass effect. Two background states via variables: `--nav-bg` (translucent) and `--nav-bg-scroll` (more opaque when scrolled). The `.scrolled` class also shrinks padding and adds a bottom border.

### Lines 34–64: Hero Styles

The hero is `height:100vh; display:flex; align-items:center; justify-content:center` — a centered full-viewport container. Key hero CSS:

- **Grid lines** — Two `linear-gradient` backgrounds (one horizontal, one vertical) at 80px intervals create the grid. `mask-image:radial-gradient(ellipse...transparent)` fades the edges so only the center is visible.
- **Glows** — `filter:blur(120px)` turns hard-edged divs into soft ambient light. They're positioned with negative offsets so they bleed off-screen edges.
- **Coder scene** — Positioned `absolute; right:clamp(20px,8vw,140px); bottom:5%` so it sits in the bottom-right as a background element. `z-index:1` puts it behind the foreground text (`z-index:5`).
- **Title** — `font-size:clamp(56px,12vw,180px)` makes it responsive: minimum 56px, scales with viewport width, caps at 180px. Individual `.char` spans start at `transform:translateY(110%); opacity:0` — pushed below their container and invisible. GSAP animates these to `y:0; opacity:1`.

### Lines 65–113: Tech Logos

```css
.tech-logo {
  border-radius:50%;
  background:var(--glass);
  border:1px solid var(--glass-border);
  backdrop-filter:blur(8px);
}
.tech-logo::after {
  content:attr(data-label);
  color:var(--logo-label);
  text-shadow:0 1px 4px var(--bg);
}
```

Each logo is a circle with glassmorphism (semi-transparent + blur). The `::after` pseudo-element reads the `data-label` HTML attribute and displays it as hover text. `--logo-label` is white in dark mode and black in light mode, solving the visibility problem. `text-shadow` using `var(--bg)` adds a subtle halo matching the background for legibility.

The 12 `tl--1` through `tl--12` classes position each logo at specific viewport percentages around the edges.

### Lines 115–204: Section Styles

Each section follows a consistent pattern:
- Full viewport or padded container
- Section label (monospace, accent color, with a `::before` line decoration)
- Section title (Syne, bold, with italic `<em>` in muted color)
- Content cards with `var(--bg2)` background, `var(--border)` borders, hover effects that strengthen the border and add `box-shadow`

**Pinned sections** (about, experience, skills) use `position:sticky; top:0; height:100vh` — the parent section gets extra height via JS so the sticky element stays locked while you scroll through.

### Lines 206–278: Theme Toggle & Light Overrides

The toggle button uses two stacked SVGs. CSS transitions swap them:
```css
[data-theme="dark"] .theme-toggle__sun { transform:translateY(30px) rotate(90deg); opacity:0; }
[data-theme="dark"] .theme-toggle__moon { transform:translateY(0); opacity:1; }
```

The light theme overrides use `[data-theme="light"]` selectors to adjust elements that need special treatment beyond variable swaps:
- Grain opacity reduced and blend mode changed to `multiply`
- Glow opacity reduced to 12%
- Coder SVG elements get warmer beige fills instead of dark fills (using attribute selectors like `rect[fill="#1c1c22"]`)
- Cursor switches from `mix-blend-mode:difference` to `normal`
- Card shadows use lighter values
- Code screen background stays dark (keeps contrast)

---

## FILE 3: app.js — The Engine

The entire file is wrapped in an IIFE `(() => { ... })()` — an Immediately Invoked Function Expression that runs on load and keeps all variables private, preventing global namespace pollution.

### Lines 1–21: Theme System

```js
const THEME_KEY = "sc-portfolio-theme";
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) root.setAttribute("data-theme", savedTheme);
```

This runs immediately (before any rendering). It checks `localStorage` for a saved theme preference and applies it to `<html>`. This means if you chose light mode yesterday, it loads light mode today — no flash of dark then light.

`initThemeToggle()` adds a click listener that flips the `data-theme` attribute, saves to localStorage, and plays an elastic bounce animation on the button using `gsap.fromTo`.

### Lines 22–32: Helper Functions

- **`esc(string)`** — Escapes HTML special characters (`<`, `>`, `&`, `"`, `'`). This prevents XSS — if anyone put `<script>` in the JSON, it would render as text not code.
- **`fmtDate("2024-01")`** → `"Jan 2024"`. Splits the ISO date string, maps the month number to an abbreviation.
- **`range(start, end)`** → `"Jan 2024 — Present"`. Handles missing end dates by defaulting to "Present".
- **`splitC(text, emText)`** — Splits text into `<span class="char">` for per-character animation. The `emText` portion gets an additional `.em-char` class for gradient styling.
- **`ICO`** — An object containing inline SVG strings for email, LinkedIn, GitHub, LeetCode, and location icons. These get injected into the DOM when rendering socials and contact links.

### Lines 34–45: Custom Cursor System

```js
function initCursor() {
  if (matchMedia("(pointer:coarse)").matches || innerWidth < 900) return;
```

First line: bail out entirely on touch devices or small screens. No cursor system needed.

```js
  document.addEventListener("mousemove", e => {
    cx = e.clientX; cy = e.clientY;
    d.style.left = cx + "px"; d.style.top = cy + "px";
  });
```

The dot snaps instantly to cursor position by setting `left`/`top` on every mouse move.

```js
  (function f() {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(f);
  })();
```

The ring uses **lerping** (linear interpolation): each frame, it moves 10% of the distance toward the actual cursor position. This creates the elastic lag effect — it always chases but never quite catches up, then overshoots slightly. `requestAnimationFrame` ensures this runs at 60fps.

The hover detection loop adds `cursor-hover` class to `<body>` when hovering interactive elements, which triggers the CSS size change.

### Lines 47–53: Magnetic Effect

```js
el.addEventListener("mousemove", e => {
  const r = el.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width/2);
  const dy = e.clientY - (r.top + r.height/2);
  gsap.to(el, { x: dx * 0.2, y: dy * 0.2, ... });
});
```

Calculates the distance between the cursor and the element's center. Moves the element by 20% of that offset using GSAP. When the mouse leaves, GSAP animates it back to `x:0, y:0`. The `overwrite:true` prevents animation stacking (each new mousemove cancels the previous tween).

### Lines 56–62: Particle System

A hand-rolled canvas particle system:

1. **Resize handler** — canvas width/height matches window dimensions
2. **45 particles** created with random position, radius (0.3–1.5px), velocity (±0.15px/frame), and alpha (0.06–0.31)
3. **Draw loop** — clears canvas, updates each particle position (wrapping at edges), draws a filled arc at each position
4. Uses `requestAnimationFrame` for 60fps rendering
5. Particle color is fixed at `rgba(212,128,74,alpha)` — the copper accent at varying transparency

### Lines 64–71: 3D Tilt

```js
card.addEventListener("mousemove", e => {
  const mx = (e.clientX - r.left) / r.width;   // 0 to 1
  const my = (e.clientY - r.top) / r.height;    // 0 to 1
  gsap.to(card, {
    rotateX: (my - 0.5) * -6,   // -3° to +3°
    rotateY: (mx - 0.5) * 6,    // -3° to +3°
    transformPerspective: 900,
  });
});
```

Converts mouse position to a 0–1 range, then maps it to ±6° of rotation. `transformPerspective` creates the 3D depth effect. The CSS `--mx` and `--my` custom properties are also set, which drive the radial gradient shine effect on the card's `::before` pseudo-element.

### Lines 73–131: Render Function

This is the data pipeline. It reads `portfolio-data.json` and injects HTML into every empty container:

1. **Loader name** — Splits the full name into chars for the loader animation
2. **Hero title** — Splits first name and last name into separate lines, each letter wrapped in `<span class="char">`. Last name gets wrapped in `<span class="em-wrap">` for the gradient effect.
3. **Socials** — Filters contact URLs, maps to icon SVGs, creates clickable links
4. **Statement text** — Takes the existing HTML (with `<em>` tags) and wraps each word in `<span class="word">` for the scroll reveal. The `<em>` tags are preserved inside the word spans using a delimiter trick (`⌘`).
5. **Marquees** — Flattens all skill category items into one array, joins with `◆` separators, doubles it (for seamless CSS animation loop)
6. **About text** — Splits the summary by whitespace, wraps each word in `<span class="word">` for the word-by-word reveal
7. **Experience** — Stores the array globally (`window.__expData`) and shows the first entry
8. **Projects** — Loops through projects, builds card HTML with title, description (first highlight), skill tags, and links
9. **Skills** — Creates category buttons in the sidebar, shows the first category
10. **Education / Certifications** — Loops and builds cards
11. **Contact** — Splits "Let's connect." into per-character spans, builds contact link buttons

### Lines 134–150: Experience Reveal (GTA VI style)

```js
function showExp(idx) {
  gsap.to(card, { opacity:0, y:20, duration:.3, onComplete:() => {
    // ... swap all text content ...
    gsap.fromTo(card, {opacity:0, y:20}, {opacity:1, y:0});
  }});
}
```

Two-phase animation: animate OUT (fade + slide down), then in the `onComplete` callback, swap all DOM text content (dates, role, company, highlights, tags, counter), then animate IN (fade + slide up). This creates a smooth crossfade between roles without needing multiple DOM elements.

### Lines 152–164: Skill Category Switching

Same two-phase pattern: GSAP animates existing chips to `opacity:0, y:8` with 10ms stagger, then in `onComplete` clears the container, creates new chips, and animates them in with `opacity:1, y:0` with 25ms stagger and an `ease:"power3.out"` for that snappy deceleration feel.

### Lines 166–174: Scroll Spy

```js
ScrollTrigger.create({
  trigger: el,
  start: "top 40%",
  end: "bottom 40%",
  onToggle: self => {
    links.forEach(l => l.classList.toggle("active", self.isActive && l.dataset.section === id));
  }
});
```

For each section, creates a ScrollTrigger that fires when the section's top crosses 40% of the viewport and unfires when its bottom crosses 40%. `onToggle` adds/removes the `.active` class on the matching nav link. This means exactly one nav link is highlighted at any time, corresponding to which section you're currently reading.

### Lines 176–330: Master Animation Controller (`initAnimations`)

This is the brain. Every scroll animation in the entire site is set up here. `gsap.matchMedia()` is used to scope desktop-only animations (pinned sections) so they don't break on mobile.

**Progress bar (line 181):**
```js
ScrollTrigger.create({ start:0, end:"max", onUpdate: s => 
  document.getElementById("progress").style.setProperty("--sp", (s.progress*100)+"%")
});
```
Single ScrollTrigger spanning the entire page. Updates the CSS variable on every frame.

**Nav appearance (lines 183–185):**
Triggers once when 80% of the hero has been scrolled past. Adds `.visible` class and animates opacity/y. A separate ScrollTrigger adds `.scrolled` after 30px of scroll for the compact nav state.

**Hero timeline (lines 188–195):**
A GSAP `timeline` sequences animations in order:
1. All title characters rise up (1s, 20ms stagger between each)
2. Tag fades in (overlapping with step 1 by 300ms — that's what `"-=0.3"` means)
3. Subtitle, buttons, socials, scroll indicator, and coder scene all fade in with overlapping timing

The negative offsets (`"-=0.2"`) make animations overlap, creating a cascade rather than sequential waiting.

**Code line typing (lines 198–199):**
Each `.code-line` rect is set to `scaleX(0)` then animated to `scaleX(1)` with random duration variation (0.25–0.45s) and staggered start (100ms apart). This mimics typing speed variance.

**Floating symbols (lines 200–203):**
Each symbol gets two animations: a one-shot fade-in, then a repeating `yoyo:true` float (moving up/sideways and back). `repeat:-1` means infinite loop.

**Tech logo entrance (lines 207–234):**
Each logo enters from a radial direction calculated by its index:
```js
const angle = (i / logos.length) * Math.PI * 2;
const fromX = Math.cos(angle) * 40;
const fromY = Math.sin(angle) * 40;
```
This distributes entry directions evenly around a circle. Then continuous float and rotation loops, each with randomized parameters so no two logos move identically.

**Hero parallax exit (lines 236–251):**
Four separate ScrollTriggers with `scrub:true` (animation tied directly to scroll position):
- Foreground text exits upward fast (`y:-100`)
- Coder scene drifts down slower (`y:60`)
- Background scales up slightly
- Logos scatter outward in alternating directions

This creates **parallax depth** — closer objects move faster, distant objects move slower.

**About pinned reveal (lines 262–273):**
Wrapped in `mm.add("(min-width:861px)")` — desktop only. Calculates section height based on word count (`wordCount × 18px`), pins the content, and uses a single `onUpdate` callback to progressively light up words based on scroll progress. This is more efficient than creating individual ScrollTriggers per word.

**Experience pinned reveal (lines 276–292):**
Same pin pattern. Divides scroll distance by number of experiences. `onUpdate` calculates which experience index should be showing and calls `showExp()` when it changes.

### Lines 332–339: Loader Sequence

```js
let v = 0;
const t = setInterval(() => {
  v += Math.floor(Math.random()*6) + 3;   // random 3-9 per tick
  if (v > 100) v = 100;
  fill.style.width = v + "%";
  pct.textContent = v;
}, 45);
```

Runs every 45ms, incrementing by a random amount (3–9). This creates natural-feeling loading progress rather than linear. When hitting 100, it triggers the exit sequence: chars animate out upward, then the whole loader fades away and calls the callback to start the main site animations.

### Lines 341–342: Resize Handler

```js
let rt;
addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => ScrollTrigger.refresh(), 200);
});
```

Debounced resize handler. Waits 200ms after the user stops resizing, then calls `ScrollTrigger.refresh()` which recalculates all pin heights, scroll distances, and trigger positions. Without this, pinned sections would break after window resize.

### Lines 344–353: Boot Sequence

```js
fetch("portfolio-data.json", {cache:"no-cache"})
  .then(r => r.json())
  .then(data => {
    window.__portfolioData = data;
    render(data);
    runLoader(() => {
      initCursor();
      initMagnetic();
      initParticles();
      initTilt();
      initThemeToggle();
      initAnimations();
      ScrollTrigger.refresh();
    });
  });
```

The entire site initialization chain:
1. Fetch the JSON (with `cache:"no-cache"` so edits take effect immediately)
2. Store data globally (needed by skill switching and experience reveal)
3. Run `render()` to inject all HTML content
4. Start the loader animation
5. When loader finishes (callback), initialize all interactive systems in order
6. Final `ScrollTrigger.refresh()` ensures all measurements are correct after DOM is fully populated

---

## How Everything Connects

```
portfolio-data.json
        ↓ (fetch)
      app.js
        ↓ (render function)
    index.html (empty containers filled with data)
        ↓ (GSAP animations applied to rendered elements)
    styles.css (theme variables + layout + transitions)
        ↓
     Browser renders the final page
```

The data flow is one-directional: JSON → JS → DOM → CSS → pixels. Change the JSON and everything downstream updates. Change the CSS variables (via theme toggle) and everything visual updates. The JS is the bridge between data and presentation.
