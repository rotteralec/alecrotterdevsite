// SearchBar.jsx: the free-text box above the project filters.
//
// It's a "controlled input": its value comes DOWN from the hook and
//  every keystroke calls back UP via onChange. 
// This component holds no state.
// useProjectSearch is single source of truth.

export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="m-search-input"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search projects, tech, skills…"
      aria-label="Search projects"
    />
  );
}
