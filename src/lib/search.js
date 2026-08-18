// search.js — the pure search/filter logic, with NO React in it.
//
// Both faces of the site filter projects through THIS one module: the
// minimal layout (via the useProjectSearch hook) and the terminal (via
// commands.jsx). One module, two very different uses: 
// `grep react` in the terminal and clicking the "React" pill in minimal mode return
// exactly the same projects.

// The facets we group filters by.
export const GROUPS = ["languages", "tools", "skills"];

// Build the sorted, de-duped list of every value that appears in each
// facet across all projects. 
// This is used by filter buttons (minimal) and valid --lang/--tool/--skill values (terminal)
export function getFacets(projects) {
  const buckets = { languages: new Set(), tools: new Set(), skills: new Set() };
  for (const p of projects) {
    for (const g of GROUPS) {
      for (const value of p[g]) buckets[g].add(value);
    }
  }
  return {
    languages: [...buckets.languages].sort(),
    tools: [...buckets.tools].sort(),
    skills: [...buckets.skills].sort(),
  };
}

// Match free-text query to projects.
// Case-insensitive substring searched in name, summary, every description paragraph, and all tags. 
// **An empty query matches everything.**
export function matchesQuery(project, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    project.name,
    project.summary,
    ...(project.description || []),
    ...project.languages,
    ...project.tools,
    ...project.skills,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

// The full filter: text query AND facet selections. 
// Facet groups are || (Python OR Rust)
// Groups are && (Python AND uses Docker)
export function filterProjects(projects, { query = "", selected } = {}) {
  const sel = selected || { languages: [], tools: [], skills: [] };
  return projects.filter((p) => {
    if (!matchesQuery(p, query)) return false;
    for (const g of GROUPS) {
      const picked = sel[g] || [];
      if (picked.length && !picked.some((v) => p[g].includes(v))) return false;
    }
    return true;
  });
}
