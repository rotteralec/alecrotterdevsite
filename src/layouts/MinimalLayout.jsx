// MinimalLayout.jsx: the clean, user-friendly side of the site.

import { profile, interests } from "../data/content.js";
import { useProjectSearch } from "../hooks/useProjectSearch.js";
import ProjectCard from "../components/minimal/ProjectCard.jsx";
import SearchBar from "../components/minimal/SearchBar.jsx";
import FilterGroups from "../components/minimal/FilterGroups.jsx";


// Section heading with a number, like "01 — About".
function SectionTitle({ number, children }) {
  return (
    <h2 className="m-section-title">
      <span className="m-section-number">{number}</span> {children}
    </h2>
  );
}

// ─── The layout itself ──────────────────────────────────────────────

export default function MinimalLayout({ controls }) {
  // Everything the search needs: the query, the selected filters, the
  // filtered results, and the helpers to change them
  // Destructured useProjectSearch() parts
  const {
    query,
    setQuery,
    selected,
    toggleFacet,
    clearAll,
    facets,
    results,
    activeCount,
  } = useProjectSearch();
  //TODO: Change light and dark icons to not look like an emoji
  return (
    <div className="m-page">
      {/* Header: name on the left, switches on the right */}
      <header className="m-header">
        <span className="m-logo">{profile.name}</span>
        <nav className="m-nav">
          <button className="m-btn" onClick={controls.toggleTheme}>
            {/* Show what clicking will switch TO, not the current state */}
            {controls.theme === "dark" ? "☀ Light" : "● Dark"}
          </button>
          <button className="m-btn m-btn-accent" onClick={controls.toggleLayout}>
            Terminal mode →
          </button>
        </nav>
      </header>

      <main className="m-main">
        {/* Hero */}
        <section className="m-hero">
          <h1 className="m-hero-name">{profile.name}</h1>
          <p className="m-hero-tagline">{profile.tagline}</p>
        </section>

        {/* About */}
        <section>
          <SectionTitle number="01">About</SectionTitle>
          {profile.bio.map((paragraph, i) => (
            <p className="m-text" key={i}>
              {paragraph}
            </p>
          ))}
        </section>

        {/* Interests as a row of chips */}
        <section>
          <SectionTitle number="02">Interests</SectionTitle>
          <div className="m-interests">
            {interests.map((item) => (
              <span className="m-chip m-chip-lg" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Projects: search + grouped filters + expandable cards */}
        <section>
          <SectionTitle number="03">Projects</SectionTitle>

          <div className="m-search">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <FilterGroups
            facets={facets}
            selected={selected}
            onToggle={toggleFacet}
          />

          {/* How many currently match + a clear control when anything
              is active. */}
          <div className="m-results-bar">
            <span className="m-results-count">
              {results.length} {results.length === 1 ? "project" : "projects"}
            </span>
            {activeCount > 0 && (
              <button className="m-clear-btn" onClick={clearAll}>
                Clear filters ({activeCount})
              </button>
            )}
          </div>

          {/* The grid, or empty state when no matches exist. */}
          {results.length > 0 ? (
            <div className="m-projects">
              {results.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="m-empty">
              No projects match — try clearing a filter or searching for
              something else.
            </p>
          )}
        </section>

        {/* Contact / footer */}
        <footer className="m-footer">
          <SectionTitle number="04">Contact</SectionTitle>
          <p className="m-text">
            Want to work together or just say hi? My inbox is open.
          </p>
          <div className="m-card-links m-footer-links">
            <a href={`mailto:${profile.email}`}>Email ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
          {/* new Date().getFullYear() keeps the year current */}
          <p className="m-copyright">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </main>
    </div>
  );
}
