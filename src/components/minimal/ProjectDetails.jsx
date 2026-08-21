// ProjectDetails.jsx — the EXPANDED body of a project card.
// Revealed when a visitor clicks "Details" on a ProjectCard. 
// The collapsed card only shows highlight.
// This shows all info from project.

import Chip from "./Chip.jsx";

// A labelled row of chips ("Languages: [x] [y]"). 
// Renders nothing if the list is empty.
// A project with no tools simply omits that row.
function ChipRow({ label, items, kind }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="m-detail-row">
      <span className="m-detail-label">{label}</span>
      <div className="m-detail-chips">
        {items.map((item) => (
          <Chip key={item} kind={kind}>
            {item}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetails({ project }) {
  return (
    <div className="m-details">
      {/* Each description string is its own paragraph. */}
      <div className="m-detail-row">
        <span className="m-detail-label">Details</span>
        <div className="m-detail-text">
          {project.description.map((paragraph, i) => (
            <p className="m-text" key={i}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* The full facet lists, colour-coded to match the filters. */}
      <ChipRow label="Languages" items={project.languages} kind="language" />
      <ChipRow label="Tools" items={project.tools} kind="tool" />
      <ChipRow label="Skills" items={project.skills} kind="skill" />
    </div>
  );
}
