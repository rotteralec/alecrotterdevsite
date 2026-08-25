// useProjectSearch.js: React wrapper around the shared search logic.
//
// Real matching logic lives in src/lib/search.js.
// useProjectSearch holds query + selected filters in state and recomputes
//  results when changed.


import { useState, useMemo } from "react";
import { projects } from "../data/projects.js";
import { getFacets, filterProjects } from "../lib/search.js";

const hasInProgress = projects.some((p) => p.inProgress);

export function useProjectSearch() {
  // Free-text search box.
  const [query, setQuery] = useState("");

  const [inProgressOnly, setInProgressOnly] = useState(false);
  const toggleInProgress = () => setInProgressOnly((v) => !v);

  // Selected tags, grouped by facet.
  const [selected, setSelected] = useState({
    languages: [],
    tools: [],
    skills: [],
  });

  // Filter button lists, built once at runtime.
  const facets = useMemo(() => getFacets(projects), []);

  // Add/remove one tag in one facet group.
  const toggleFacet = (group, value) =>
    setSelected((s) => {
      const has = s[group].includes(value);
      return {
        ...s,
        [group]: has
          ? s[group].filter((v) => v !== value)
          : [...s[group], value],
      };
    });

  // Reset everything, used by the "clear filters" control.
  const clearAll = () => {
    setQuery("");
    setSelected({ languages: [], tools: [], skills: [] });
    setInProgressOnly(false);
  };

  // Recompute matches only when the query or selections change. 
  const results = useMemo(
    () => filterProjects(projects, { query, selected, inProgressOnly }),
    [query, selected, inProgressOnly]
  );

  // Active Filters (for the "clear (n)" label).
  const activeCount =
    selected.languages.length +
    selected.tools.length +
    selected.skills.length +
    (inProgressOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  return {
    query,
    setQuery,
    selected,
    toggleFacet,
    clearAll,
    facets,
    results,
    activeCount,
    inProgressOnly,
    toggleInProgress,
    hasInProgress,
  };
}
