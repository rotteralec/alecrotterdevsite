// ProjectCard.jsx (terminal): project data printed like a terminal would
//  "cat" a file. 
// 'full' prop adds description paragraphs.
// 'grep' /filter stays compact while 'cat projects/NAME' shows everything


// Labeled line such as:  "tools: React · Firebase". 
// Renders nothing when the list is empty.
function Line({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <p className="t-card-line">
      <span className="t-key">{label}:</span> {items.join(" · ")}
    </p>
  );
}

export default function ProjectCard({ project, full = false }) {
  const hasLink = project.github || project.website;

  return (
    <article className="t-card">
      {/* Project name printed like a directory. */}
      <h3 className="t-card-name">
        {project.slug}/
        {project.inProgress && <span className="t-wip"> [wip]</span>}
      </h3>
      <p className="t-card-desc">{project.summary}</p>

      {/* Full view (cat) prints the detailed description paragraphs. */}
      {full &&
        project.description.map((paragraph, i) => (
          <p className="t-text" key={i}>
            {paragraph}
          </p>
        ))}

      <Line label="langs" items={project.languages} />
      <Line label="tools" items={project.tools} />
      <Line label="skills" items={project.skills} />

      {/* Links. github may be null (private repo); website may be null. */}
      {hasLink && (
        <p className="t-card-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              [github]
            </a>
          )}
          {project.website && (
            <a href={project.website} target="_blank" rel="noreferrer">
              [live site]
            </a>
          )}
        </p>
      )}
    </article>
  );
}
