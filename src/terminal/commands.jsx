// commands.jsx — the "brain" of my terminal. Every command a visitor can
// type lives here, in one place, away from the layout code.
//
// TerminalLayout hands me the raw string typed plus a `ctx` object with the
// few powers commands need (change theme, switch layout). I parse the
// string, find the matching command, and return JSX for the layout to print.
//
// Project data now comes from the shared data layer (src/data/projects.js),
// and all searching/filtering runs through the SAME pure logic the minimal
// layout uses (src/lib/search.js). So `grep react` here and the "React"
// pill over there return exactly the same projects.
//
// To add a new command: write a `case` in runCommand, then document it in
// the help screen. That's it.

import { profile, interests } from "../data/content.js";
import { projects } from "../data/projects.js";
import { getFacets, filterProjects } from "../lib/search.js";
import ProjectCard from "../components/terminal/ProjectCard.jsx";

// ─── Helpers ─────────────────────────────────────────────────────────

// The facet lists (all languages / tools / skills that exist), used for
// validating filter flags and for hints in the help + error messages.
const facets = getFacets(projects);
const allFacetValues = [...facets.languages, ...facets.tools, ...facets.skills];

// Case-insensitive project lookup by slug, forgiving a trailing slash.
function findProject(nameArg) {
  const wanted = nameArg.replace(/\/$/, "").toLowerCase();
  return projects.find((p) => p.slug === wanted);
}

// Plain error line, used by several commands.
const err = (text) => <p className="t-error">{text}</p>;

// Given a facet list and a lowercased input, return the properly-cased
// value (so "react" displays as "React"). undefined if not found.
const canonical = (list, lc) => list.find((v) => v.toLowerCase() === lc);

// ─── Small output components ─────────────────────────────────────────

// One row of the help screen: command on the left, what it does on the
// right. A component so every row stays aligned via CSS grid.
function HelpRow({ cmd, desc }) {
  return (
    <div className="t-help-row">
      <span className="t-help-cmd">{cmd}</span>
      <span className="t-help-desc">{desc}</span>
    </div>
  );
}

// A set of matching projects, printed as compact cards (grep + filters).
function ProjectResults({ list }) {
  return (
    <div className="t-projects">
      {list.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}

// ─── Command names (exported for tab completion in the layout) ──────
export const COMMAND_NAMES = [
  "help",
  "whoami",
  "ls",
  "ls projects/",
  "cat interests.txt",
  "ls projects/ --lang=",
  "ls projects/ --tool=",
  "ls projects/ --skill=",
  "ls projects/ --wip",
  "grep",
  "find",
  "cat",
  "cat about.txt",
  "cat contact.txt",
  "cat projects/",
  "theme",
  "minimal",
  "exit",
  "quit",
  "logout",
  ":q",
  "clear",
];

// ─── The detailed help screen ────────────────────────────────────────
// Kept REALLY detailed on purpose: every command gets its usage and a
// concrete example a visitor can copy.
function HelpScreen() {
  const exLang = (facets.languages[0] || "typescript").toLowerCase();
  const exTool = (facets.tools[0] || "react").toLowerCase();
  const exSkill = (facets.skills[0] || "").toLowerCase();
  const exProject = projects[0]?.slug || "taskflow";

  return (
    <div className="t-help">
      <p className="t-help-title">available commands</p>

      <p className="t-help-section">── explore ──</p>
      <HelpRow cmd="whoami" desc="print my name and what I do" />
      <HelpRow cmd="ls" desc="list everything here: about.txt, interests/, projects/, contact.txt" />
      <HelpRow cmd="cat about.txt" desc="read my bio" />
      <HelpRow cmd="cat interests/" desc="print the things I'm into" />
      <HelpRow cmd="cat contact.txt" desc="print my email, github, and linkedin" />

      <p className="t-help-section">── projects ──</p>
      <HelpRow cmd="cd projects" desc="change into the projects folder — then `ls` lists them" />
      <HelpRow cmd="cd .." desc="go back home (~)" />
      <HelpRow cmd="ls projects/" desc="list all my projects by name" />
      <HelpRow
        cmd="cat projects/NAME"
        desc={`full details on one project — try: cat projects/${exProject}`}
      />
      <HelpRow
        cmd="grep TERM"
        desc={`search everything — name, summary, description, and tags. try: grep ${exProject}`}
      />
      <HelpRow
        cmd="ls projects/ --lang=X"
        desc={`filter by language — try: ls projects/ --lang=${exLang}`}
      />
      <HelpRow
        cmd="ls projects/ --tool=X"
        desc={`filter by tool/framework — try: ls projects/ --tool=${exTool}`}
      />
      <HelpRow
        cmd="ls projects/ --skill=X"
        desc={
          exSkill
            ? `filter by skill — try: ls projects/ --skill=${exSkill.split(" ")[0]}`
            : "filter by skill"
        }
      />
      <HelpRow
        cmd="ls projects/ --filter=X"
        desc="filter by ANY tag (language, tool, or skill)"
      />
      <HelpRow
        cmd="ls projects/ --wip"
        desc="show only in-progress projects"
      />
      <HelpRow
        cmd="…combine + comma lists"
        desc="flags stack, and take comma lists: ls projects/ --lang=python,typescript --tool=docker"
      />

      <p className="t-help-section">── settings ──</p>
      <HelpRow cmd="theme" desc="toggle between dark and light" />
      <HelpRow cmd="theme dark | theme light" desc="jump straight to a specific theme" />
      <HelpRow cmd="minimal" desc="leave the terminal — switch to the minimal site" />
      <HelpRow
        cmd="exit | quit | logout | :q | ctrl+c"
        desc="all the classic ways out work too — they each drop you to minimal"
      />

      <p className="t-help-section">── terminal ──</p>
      <HelpRow cmd="clear" desc="wipe the screen" />
      <HelpRow cmd="help" desc="show this screen again" />
      <HelpRow cmd="↑ / ↓" desc="walk back through commands you've typed" />
      <HelpRow cmd="tab" desc="autocomplete a command" />

    </div>
  );
}

// ─── ls outputs ──────────────────────────────────────────────────────

// `ls` with no args: the "root directory" of the site.
function RootListing() {
  return (
    <ul className="t-ls">
      <li>about.txt</li>
      <li>interests.txt</li>
      <li>projects/</li>
      <li>contact.txt</li>
    </ul>
  );
}

function InterestsListing() {
  return (
    <ul className="t-ls">
      {interests.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// `ls projects/` — directory-style names plus a hint, because a visitor
// won't guess `cat projects/NAME` on their own.
function ProjectsListing({ list }) {
  return (
    <>
      <ul className="t-ls">
        {list.map((p) => (
          <li key={p.slug}>{p.slug}/</li>
        ))}
      </ul>
      <p className="t-hint">
        run `cat projects/{list[0].slug}` for details, or `grep TERM` to search
      </p>
    </>
  );
}

function ContactOutput() {
  return (
    <p className="t-card-links t-contact">
      <a href={`mailto:${profile.email}`}>[email]</a>
      <a href={profile.github} target="_blank" rel="noreferrer">
        [github]
      </a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer">
        [linkedin]
      </a>
    </p>
  );
}

// ─── ls projects/ with filter flags ─────────────────────────────────
// Handles --lang= / --tool= / --skill= (precise, per-facet) and --filter=
// (matches ANY facet). Values are case-insensitive and accept comma lists.
// Returns JSX to print, or an error line.
function runProjectFilter(parts) {
  const flags = parts.filter((p) => p.startsWith("--"));
  if (flags.length === 0) return <ProjectsListing list={projects} />;

  const groupOf = { "--lang": "languages", "--tool": "tools", "--skill": "skills" };
  const selected = { languages: [], tools: [], skills: [] };
  const filterTerms = []; // from --filter (match ANY facet)
  let inProgressOnly = false;

  const facetsLc = {
    languages: facets.languages.map((v) => v.toLowerCase()),
    tools: facets.tools.map((v) => v.toLowerCase()),
    skills: facets.skills.map((v) => v.toLowerCase()),
  };

  for (const f of flags) {
    const eq = f.indexOf("=");
    const key = (eq === -1 ? f : f.slice(0, eq)).toLowerCase();
    const rawVal = eq === -1 ? "" : f.slice(eq + 1);
    const values = rawVal
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (key === "--wip") {
      if (eq !== -1)
        return err(`--wip takes no value — just: ls projects/ --wip`);
      inProgressOnly = true;
      continue;
    }

    if (values.length === 0)
      return err(`${key} needs a value — e.g. ${key}=${(allFacetValues[0] || "react").toLowerCase()}`);

    if (key === "--filter") {
      for (const v of values) {
        const lc = v.toLowerCase();
        const known =
          facetsLc.languages.includes(lc) ||
          facetsLc.tools.includes(lc) ||
          facetsLc.skills.includes(lc);
        if (!known)
          return err(`nothing tagged "${v}". try one of: ${allFacetValues.join(", ")}`);
        filterTerms.push(lc);
      }
    } else if (groupOf[key]) {
      const group = groupOf[key];
      for (const v of values) {
        const lc = v.toLowerCase();
        if (!facetsLc[group].includes(lc))
          return err(`no ${group} tagged "${v}". valid ${group}: ${facets[group].join(", ")}`);
        selected[group].push(canonical(facets[group], lc));
      }
    } else {
      return err(`unknown flag "${key}" — use --lang= --tool= --skill= --filter= or --wip`);
    }
  }

  let list = filterProjects(projects, { selected, inProgressOnly });
  if (filterTerms.length)
    list = list.filter((p) => {
      const tags = [...p.languages, ...p.tools, ...p.skills].map((t) =>
        t.toLowerCase()
      );
      return filterTerms.every((t) => tags.includes(t));
    });

  if (list.length === 0) return err("no projects match those filters.");
  return <ProjectResults list={list} />;
}

// ─── The dispatcher ──────────────────────────────────────────────────
// Takes the raw typed string + ctx, returns JSX to print (or the string
// "CLEAR" as a signal that the layout should wipe the screen).
//
// ctx = {
//   theme:    "dark" | "light"  (current theme)
//   setTheme: (t) => void
//   goMinimal: () => void       (switch the whole site to minimal)
//   cwd,
//   setCwd
// }
export function runCommand(raw, ctx) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts[1] || "";

  // Vim escape hatches: :q, :q!, :wq, :x, :qa … anything a vim user would
  // reflexively type to get out. All of them quit to minimal.
  if (/^:(q|qa|wq|x)!?$/.test(cmd)) {
    setTimeout(ctx.goMinimal, 600);
    return (
      <p className="t-text">
        this isn't vim, but I'll take the hint — switching to minimal…
      </p>
    );
  }

  switch (cmd) {
    case "help":
      return <HelpScreen />;

    case "cd" : {
      const dest = arg.replace(/\/$/, "").toLowerCase();
      if (!dest || dest === "-" || dest === "..") {
        ctx.setCwd("~");
        return null;
      }
      if (dest === "projects") {
        ctx.setCwd("projects");
        return null;
      }
      return err(`cd: ${arg}: not a directory`);
    }

    case "whoami":
      return (
        <>
          <h1 className="t-name">{profile.name}</h1>
          <p className="t-tagline">{profile.tagline}</p>
        </>
      );

case "ls": {
  const pathArg = parts.slice(1).find((p) => !p.startsWith("--"));
  const target = (pathArg || "").replace(/\/$/, "").toLowerCase();

  // explicit path wins; otherwise list wherever we currently are
  const dir = target || (ctx.cwd === "projects" ? "projects" : "root");

  if (dir === "root") return <RootListing />;
  if (dir === "projects") return runProjectFilter(parts);
  if (dir === "interests" || dir === "interests.txt")
    return err("ls: interests.txt is a file — try `cat interests.txt`");
  return err(`ls: cannot access '${pathArg}': no such file or directory`);
}

    // Full-text search across every project. `find` is an alias.
    case "grep":
    case "find": {
      const term = parts.slice(1).join(" ").trim();
      if (!term) return err("usage: grep TERM — e.g. grep python");
      const list = filterProjects(projects, { query: term });
      if (list.length === 0)
        return <p className="t-error">no projects match "{term}".</p>;
      return (
        <>
          <p className="t-hint">
            {list.length} match{list.length === 1 ? "" : "es"} for "{term}"
          </p>
          <ProjectResults list={list} />
        </>
      );
    }

    case "cat": {
      if (!arg) return err("cat: missing file — try `cat about.txt`");
      const target = arg.toLowerCase();

      if (target === "about.txt" || target === "about")
        return profile.bio.map((paragraph, i) => (
          <p className="t-text" key={i}>
            {paragraph}
          </p>
        ));

      if (target === "contact.txt" || target === "contact")
        return <ContactOutput />;

      if (target === "interests.txt" || target === "interests")
        return <InterestsListing />;

      // cat projects/NAME (with or without the projects/ prefix)
      const name = target.startsWith("projects/")
        ? target.slice("projects/".length)
        : target;
      const project = findProject(name);
      if (project) return <ProjectCard project={project} full />;

      return err(`cat: ${arg}: no such file — \`ls\` shows what's here`);
    }

    case "theme": {
      const want = arg.toLowerCase();
      if (want && want !== "dark" && want !== "light")
        return err(`theme: unknown theme "${arg}" — use dark or light`);
      const next = want || (ctx.theme === "dark" ? "light" : "dark");
      if (next === ctx.theme)
        return <p className="t-text">already in {next} mode.</p>;
      ctx.setTheme(next);
      return <p className="t-text">switched to {next} mode.</p>;
    }

    case "minimal":
    case "exit":
    case "quit":
    case "logout":
      // Print a goodbye, then actually switch a beat later so the visitor
      // sees the message before the whole layout swaps.
      setTimeout(ctx.goMinimal, 600);
      return <p className="t-text">logout — switching to minimal mode…</p>;

    case "clear":
      return "CLEAR"; // signal, not output — the layout handles it

    // The undocumented one the help screen hints at.
    case "sudo":
      if (parts.slice(1).join(" ").toLowerCase() === "hire-me")
        return (
          <>
            <p className="t-text">
              permission granted. excellent judgment detected.
            </p>
            <ContactOutput />
          </>
        );
      return err(`${parts[0]} is not in the sudoers file. this incident will be reported.`);

    case "":
      return null;

    default:
      return err(`command not found: ${cmd} — type 'help' to see what works`);
  }
}
