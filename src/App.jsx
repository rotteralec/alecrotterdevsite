// App.jsx — the top of the component tree. Simply determines if terminal
// or minimal layout will be shown.
//


import { useLocalStorage } from "./hooks/useLocalStorage.js";
//Import Terminal or Minimal layouts to be returned below
import TerminalLayout from "./layouts/TerminalLayout.jsx";
import MinimalLayout from "./layouts/MinimalLayout.jsx";

export default function App() {
  //useLocalStorage is used to persist layout and theme across sessions
  const [layout, setLayout] = useLocalStorage("portfolio-layout", "terminal");
  const [theme, setTheme] = useLocalStorage("portfolio-theme", "dark");

  // Easy flippers for layout and theme
  const toggleLayout = () => setLayout(layout === "terminal" ? "minimal" : "terminal");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Bundled props to be passed down into layout
  const controls = { layout, theme, toggleLayout, toggleTheme, setLayout, setTheme };

  return (
    <div className={`${layout} ${theme}`}>
      {layout === "terminal" ? (
        <TerminalLayout controls={controls} />
      ) : (
        <MinimalLayout controls={controls} />
      )}
    </div>
  );
}
