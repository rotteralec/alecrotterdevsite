# My Portfolio — terminal ⇄ minimal

A React portfolio with two complete personalities. The terminal layout is a
**real, type-able terminal** — visitors run commands like `help`,
`cat about.txt`, and `ls projects/` to explore. The minimal layout is a clean
button-driven site. Both read from the same content file, so I only ever edit
my info once. Typing `minimal` in the terminal (or clicking `Terminal mode →`
in minimal) swaps the entire site between them.

Built with **Vite + React**, run with **Deno**.

## Run it

```sh
# from this folder (Deno 2.x required — https://deno.com)
deno install        # reads package.json, installs deps into node_modules
deno task dev       # starts the dev server → http://localhost:5173
```

Other commands:

```sh
deno task build     # bundles the site into dist/ (static files)
deno task preview   # serves the dist/ build locally to check it
```

The same project also works with Node (`npm install && npm run dev`) —
nothing here is Deno-specific except how I run it.

## Edit my content (the part I'll do most)

Open **`src/data/content.js`**. Everything visible on the site lives there:

- `profile` — name, tagline, bio paragraphs, links
- `interests` — list of short labels
- `projects` — one object per project (name, description, tech tags,
  what I learned, GitHub/demo links)

Adding a project = copy one project block, edit it. Both layouts update
automatically: the minimal layout's filter buttons and the terminal's
`--filter=` values both come straight from the projects' tech arrays.

## How the project is organized

```
index.html                  the single HTML page React mounts into
vite.config.js              Vite (dev server / bundler) config
src/
  main.jsx                  boots React, imports the CSS
  App.jsx                   holds layout + theme state, picks which layout to render
  data/
    content.js              ★ ALL site content — the file I edit
  hooks/
    useLocalStorage.js      state that survives reloads (saved choices)
    useProjectFilter.js     filter logic for the minimal layout's buttons
    useTypewriter.js        typing animation for the terminal banner
  terminal/
    commands.jsx            ★ every terminal command + the help screen
  layouts/
    TerminalLayout.jsx      the terminal REPL (input, history, autoscroll)
    MinimalLayout.jsx       the minimal look
  styles/
    base.css                shared resets
    terminal.css            all terminal styles + its dark/light palettes
    minimal.css             all minimal styles + its light/dark palettes
```

## How the terminal works

Terminal mode is a REPL — everything is typed, with one exception: a
`minimal mode →` button stays in the title bar as an escape hatch for
visitors who don't type commands.

- Type `help` for the full command list (explore, projects, settings).
- Quitting works like a real terminal: `exit`, `quit`, `logout`, vim-style
  `:q` / `:wq` / `:q!`, and Ctrl+C / Ctrl+D all drop you to minimal mode.
- `TerminalLayout.jsx` keeps the session (typed commands + their output),
  handles ↑/↓ history recall and tab completion, and auto-scrolls.
- `src/terminal/commands.jsx` is the command dispatcher: it parses what was
  typed and returns the JSX to print. New command = new `case` there + a row
  in the help screen.
- `theme [dark|light]` and `minimal` / `exit` change site state via setters
  passed down from `App.jsx`.

## How the two switches work

- **Layout switch**: `App.jsx` keeps a `layout` state and literally renders a
  different component tree per value — that's why the two looks can be
  completely different. Terminal → minimal via the `minimal` command;
  minimal → terminal via its `Terminal mode →` button.
- **Theme switch** (dark/light): `App.jsx` puts the theme name as a CSS class
  on the wrapper div. Each stylesheet defines its color variables twice
  (once per theme), so flipping the class recolors everything with zero JS.
  Terminal uses the `theme` command; minimal keeps its button.
- Both choices are saved to localStorage via `useLocalStorage`, so visitors
  come back to what they picked.

## Deploy

`deno task build` produces a plain static `dist/` folder. Host it on
GitHub Pages, Netlify, Vercel, or Deno Deploy — no server needed.
