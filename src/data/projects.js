// projects.js — the ONLY file that touches the raw projects.json.
//
// Why this middle layer exists: (a) explain the data, (b) catch
// a broken entry before it can crash the site, (c) add the derived
// `slug` each project needs, and (d) sort everything into display order.
//
// Every component imports from HERE, never from the .json directly.

// Vite imports JSON natively — no parser needed.
import data from "./projects.json";

// Remove uppercase, whitespace and - from slug.
export const slug = (name) => name.toLowerCase().replaceAll(" ", "-");

// Only possible highlighted parts for a project.
export const HIGHLIGHTS = ["skills", "description", "tools", "languages"];

// Lightweight runtime validation. The JSON Schema file catches mistakes
// when inputted; this catches them at run time too.
// Keeps one bad entry from taking whole site down.
function isValid(project, index) {
  const problems = [];

  const needsString = ["name", "summary"];
  const needsArray = ["languages", "tools", "skills", "description"];

  for (const key of needsString) {
    if (typeof project[key] !== "string" || project[key].length === 0)
      problems.push(`"${key}" must be a non-empty string`);
  }
  for (const key of needsArray) {
    if (!Array.isArray(project[key]))
      problems.push(`"${key}" must be an array`);
  }
  // github may be a string or null (null = private repo / no public link).
  if (project.github != null && typeof project.github !== "string")
    problems.push(`"github" must be a string or null`);
  // website may be a string or null.
  if (project.website != null && typeof project.website !== "string")
    problems.push(`"website" must be a string or null`);
  // Both dates may be a string ("YYYY" / "YYYY-MM") or null.
  if (project.started != null && typeof project.started !== "string")
    problems.push(`"started" must be a string (YYYY or YYYY-MM) or null`);
  if (project.lastWorked != null && typeof project.lastWorked !== "string")
    problems.push(`"lastWorked" must be a string (YYYY or YYYY-MM) or null`);
  // highlight is optional, but if present must be one of the known blocks.
  if (project.highlight != null && !HIGHLIGHTS.includes(project.highlight))
    problems.push(`"highlight" must be one of: ${HIGHLIGHTS.join(", ")} (or omitted)`);

  if (problems.length) {
    // A named, numbered warning so offending entry can be found quickly.
    console.warn(
      `[projects.js] Skipping project #${index} (${project.name ?? "unnamed"}): ` +
        problems.join("; ")
    );
    return false;
  }
  return true;
}


function normalizeLink(value, field, name) {
  const s = typeof value === "string" ? value.trim() : value;
  if (s == null || s === "") return null;
  if (s === "null" || s === "undefined") {
    console.warn(
      `[projects.js] "${field}" on "${name}" is the string "${s}", not a real null — ` +
        `treating it as null. Remove the quotes in projects.json.`
    );
    return null;
  }
  return s;
}

// Sort newest first by START DATE ONLY.
// New commit on old project should not pop that project to top.
function byNewest(list) {
  const dated = list.filter((p) => p.started);
  const undated = list.filter((p) => !p.started);
  dated.sort((a, b) => b.started.localeCompare(a.started));
  return [...dated, ...undated];
}

// Build the clean, ready-to-render list once, when this module first
// loads. Everything downstream imports THIS.
export const projects = byNewest(
  (data.projects ?? [])
    .filter(isValid)
    .map((p) => ({
      // Fill in the optional fields so components never see `undefined`.
      highlight: null,
      started: null,
      lastWorked: null,
      ...p,
      github: normalizeLink(p.github, "github", p.name),
      website: normalizeLink(p.website, "website", p.name),
      // Add the derived slug last so it can't be overridden by the JSON.
      slug: slug(p.name),
    }))
);
