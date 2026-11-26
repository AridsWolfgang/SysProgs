# DESIGN SYSTEM — SysProgs Study

Serious, not decorative. One source of truth for web + future mobile standalone.

## Principles
1.  **Content first.** Type and code legibility > decoration. 65ch prose, 15px/1.65, Inter + JetBrains Mono.
2.  **No heavy stack.** Tokens + vanilla CSS only. No JS framework, no build. `tokens.css` is the contract.
3.  **8pt grid.** All spacing multiples of 4. No magic numbers.
4.  **Accessible by default.** 4.5:1 contrast, focus rings, `prefers-reduced-motion`, keyboard `/` to search.

## Tokens (`web/css/tokens.css`)

| Group | Tokens | Usage |
|-------|--------|-------|
| **Color** | `--bg` `#0f1115`, `--surface` `#12151d`, `--card` `#171a21`, `--border` `#242a36`, `--text` `#e6e8eb`, `--muted` `#9aa3b2`, `--accent` `#6ee7b7`, `--accent2` `#60a5fa`, `--warning` `#fbbf24`, `--danger` `#f87171` | Dark default; `html[data-theme="light"]` flips to `--bg #f6f7f9`, `--card #fff` |
| **Type** | `--font-sans` Inter, `--font-mono` JetBrains Mono, `--text-xs 11` → `--text-2xl 24`, `--leading-tight 1.25` / `normal 1.65`, `--weight 400/500/600/700` | Headings use `weight-bold + tracking-tight`, body `base/normal` |
| **Space** | `--space-1 4` → `--space-12 48` | `card` padding `space-4` (16), grid gaps `space-3` (12) |
| **Radius** | `sm 8`, `md 10`, `lg 14`, `xl 18`, `pill 999` | `card` `lg`, `badge` `pill`, `btn` `md` |
| **Shadow** | `sm 0 1 0`, `md 0 4 12`, `lg 0 12 40` | `card` `sm`, `module:hover` `md`, `sidebar` `lg` (mobile) |
| **Layout** | `--side 286`, `--content-max 1180`, `--toc 240`, `--header-h 52` | `app` grid `[side] 1fr`, `content-grid` `1fr toc` |

## Components (`web/css/components.css`)

*   **Button** `.btn` + `.small` `.primary` `.ghost` — 13px medium, 8/12 padding, hover lift `-1px`, focus ring `2px accent2`.
*   **Icon button** `.iconbtn` — 36×36, `card` bg.
*   **Input** `.input` — `surface` bg, focus `border-focus + 3px soft ring`.
*   **Card** `.card` — `card` bg, `border`, `radius-lg`, `shadow-sm`, `space-4` padding.
*   **Badge** `.badge` + `.accent`/`.info` — pill, 11px medium.
*   **Progress** `.progress` — 6px, `accent→accent2` gradient.
*   **Module row** `.mod` — dot `8px`, active `accent2` + soft ring, done `accent`.
*   **Code** `pre` — `#0b0e13`, `mono 13/1.55`, `copy` top-right.
*   **TOC** `.toc` — sticky `68px`, left border, active `accent2`.

## Layout (`web/css/style.css`)

*   `.app` — `grid [side] 1fr` desktop, `1fr` + drawer `translateX(-100%)` mobile (<900px) + bottom `nav mobile-only`.
*   `.content-grid` — `1fr 240px` (main + TOC) → `1fr` mobile, `1180` max, `22px` gutter.
*   `.topbar` — sticky `84% bg + blur 10px`, `header-h` border.
*   `.sidebar` — sticky `100vh`, `linear-gradient`, `thin scrollbar`.

## Usage

*   Add new component? Add token first in `tokens.css`, then class in `components.css`, then demo in `web/design.html`.
*   New color? Add to `:root` + `[data-theme="light"]`, not hard-coded.
*   New spacing? Use `var(--space-*)`, not `13px`.

## Accessibility

*   Contrast: `text` on `bg` 13.2:1, `muted` on `bg` 5.1:1 (WCAG AA).
*   Focus: `focus-visible` 2px `border-focus` on all interactive.
*   Motion: `prefers-reduced-motion` disables transitions.
*   Keyboard: `/` focuses search, `Esc` clears, `Enter` on `.mod`.

## Live Guide

Open `web/design.html` (or `http://127.0.0.1:8000/design.html`) — every token and component rendered, copyable.

## Future Mobile Standalone

Same tokens, same components. `tokens.css` is shared; `style.css` layout will add `web/css/mobile.css` for standalone `display: standalone` tweaks (safe-area, haptics via `navigator.vibrate`).
