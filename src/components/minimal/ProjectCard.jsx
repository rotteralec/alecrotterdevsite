// ProjectCard.jsx: the COLLAPSED project card for the minimal layout.
//
// Always shows name + summary + highlight + possible links
// Must click "Details" to expand <ProjectDetails> and see rest of details.
//    Uses local state, not routing.
//
// Highlight is used as a wildcard slot. 
// Each project picks one block to "highlight" in foreground.
// Can lead with skills or description depending on project.


import { useState } from "react";
import Chip from "./Chip.jsx";
import ProjectDetails from "./ProjectDetails.jsx";

// Map a facet highlight to chip color-kind.
const KIND = { languages: "language", tools: "tool", skills: "skill" };

// Max characters allowed in highlight if description is chosen to highlight
const TEASER_LEN = 140;

const MAX_CHIPS = 7;

// Render the wildcard highlight block based on project.highlight.
// Understands ["skills", "description", "tools", "languages"], null renders nothing.
function Highlight({ project }) {
  const h = project.highlight;
  if (!h) return null; // null / omitted → no highlight

  // "description": a short text teaser from the first paragraph.
  if (h === "description") {
    const first = project.description?.[0] || "";
    if (!first) return null;
    const teaser =
      first.length > TEASER_LEN
        ? first.slice(0, TEASER_LEN).trimEnd() + "…"
        : first;
    return <p className="m-card-highlight-text">{teaser}</p>;
  }

  // "languages" | "tools" | "skills": a row of colour-coded chips.
  const items = project[h] || [];
  if (items.length === 0) return null;
  return (
    <div className="m-card-tags">
      {items.slice(0, MAX_CHIPS).map((item) => (
        <Chip key={item} kind={KIND[h]}>
          {item}
        </Chip>
      ))}
    </div>
  );
}

export default function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);
  const bodyId = `${project.slug}-body`;

  return (
    <article className={open ? "m-card is-open" : "m-card"}>
      <h3 className="m-card-name">{project.name}</h3>
      <p className="m-card-desc">{project.summary}</p>

      {/* The wildcard highlight */}
      {/* Expanded body: only mounted when open. */}
      <div className="m-card-body" id={bodyId} key={open ? "open" : "closed"}>
        {open ? (
          <ProjectDetails project={project} />
        ) : (
          <Highlight project={project} />
        )}
      </div>

      {/* Links + the expand toggle on same row. 
      Each link renders only if it exists.
      Github may be null for a private repo. */}
      <div className="m-card-links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        )}
        {project.website && (
          <a href={project.website} target="_blank" rel="noreferrer">
            Live site ↗
          </a>
        )}
        <button
          className="m-card-expand"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={bodyId}
        >
          {open ? "Hide details ▾" : "Details ▸"}
        </button>
      </div>
    </article>
  );
}
