// FilterGroups.jsx: the grouped filter pills under the search box.
// Three rows (Languages, Tools, Skills), each a set of toggle buttons.
//
// All state (facets, onToggle) comes from useProjectSearch.
// This component is strictly presentational
// Group with no tags renders nothing, empty facet disappears.

const GROUPS = [
  ["tools", "Tools"],
  ["skills", "Skills"],
  ["languages", "Languages"],
];

export default function FilterGroups({ facets, selected, onToggle }) {
  return (
    <div className="m-filter-groups">
      {GROUPS.map(([key, label]) =>
        facets[key].length === 0 ? null : (
          <div className="m-filter-group" key={key}>
            <span className={`m-filter-group-label m-glabel-${key}`}>{label}</span>
            <div className="m-filters">
              {facets[key].map((tag) => (
                <button
                  key={tag}
                  className={`m-filter m-filter-${key} ${
                    selected[key].includes(tag) ? "active" : ""
                  }`}
                  onClick={() => onToggle(key, tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
