// Chip.jsx — one small tag object in the shape of a rounded corner rectangle.
// Reusable for interests, language/tool/skill tags on cards, and filter buttons

// 'kind' is optional and only used for changing the color of each facet.
export default function Chip({ children, kind = "", className = "" }) {
  const kindClass = kind ? `m-chip-${kind}` : "";
  return (
    <span className={`m-chip ${kindClass} ${className}`.replace(/\s+/g, " ").trim()}>
      {children}
    </span>
  );
}
