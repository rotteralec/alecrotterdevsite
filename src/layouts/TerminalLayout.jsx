// TerminalLayout.jsx: the terminal layout of the site.
//  Visitors type commands (`help`, `cat about.txt`, 
// `ls projects/`, …) and the output prints
// into the session, exactly like a shell.
//
// The command logic lives in src/terminal/commands.jsx.
// this file only manages the *session*: what's been typed so far,
// the input line, keyboard shortcuts, and auto-scrolling.

import { useState, useRef, useEffect } from "react";
import { profile } from "../data/content.js";
import { useTypewriter } from "../hooks/useTypewriter.js";
import { runCommand, COMMAND_NAMES } from "../terminal/commands.jsx";

// The shell prompt symbols, reused for typed lines and the live input.
function PromptSymbol({ cwd = "~" }) {
  const path = cwd === "projects" ? "~/projects" : "~";
  return (
    <>
      <span className="t-arrow">➜</span> <span className="t-path">{path}</span>{" "}
    </>
  );
}

export default function TerminalLayout({ controls }) {
  // Session state 
  // Everything printed so far: [{ id, command, output }, ...].
  // `output` is the JSX a command returned (null for empty inputs).
  const [entries, setEntries] = useState([]);

  // The live input line.
  const [input, setInput] = useState("");

  //Handles working directory state.
  const [cwd, setCwd] = useState("~");

  // history: Commands the visitor has run, for ↑/↓ recall 
  // historyIndex: index where history is currently pointing to (-1 = not browsing history)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  // The boot banner types out tagline
  const { typed, done } = useTypewriter(profile.tagline, 50);

  // Scroll session to bottom so prompt stays in view after every new entry.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries]);

  // Running a command
  function submit() {
    const cmd = input.trim();
    setInput("");
    setHistoryIndex(-1);

    // Empty enter = just echo a blank prompt line.
    if (!cmd) {
      setEntries((e) => [...e, { id: Date.now(), command: "", output: null, cwd }]);
      return;
    }

    setHistory((h) => [...h, cmd]);

    const result = runCommand(cmd, {
      theme: controls.theme,
      setTheme: controls.setTheme,
      goMinimal: () => controls.setLayout("minimal"),
      cwd,
      setCwd,
    });

    // `clear` returns a signal instead of output: wipe the session.
    if (result === "CLEAR") {
      setEntries([]);
      return;
    }

    setEntries((e) => [...e, { id: Date.now(), command: cmd, output: result }]);
  }


  // Quit to minimal. 
  // Print goodbye message, wait, then switch to minimal layout
  function quitToMinimal(echo) {
    setEntries((e) => [
      ...e,
      {
        id: Date.now(),
        command: echo,
        output: <p className="t-text">logout — switching to minimal mode…</p>,
      },
    ]);
    setInput("");
    setTimeout(() => controls.setLayout("minimal"), 600);
  }

  // Keyboard handling on the input
  function onKeyDown(event) {
    if (event.key === "Enter") {
      submit();
      return;
    }

    // Ctrl+C / Ctrl+D — the two reflexes every terminal user has for
    // "get me out of here". Both quit to minimal. One exception:
    // if text is selected, Ctrl+C means COPY — never steal that.
    // Ctrl+C / Ctrl+D both quit to minimal layout
    // Ctrl+C copies text if selection is highlighted
    if (event.ctrlKey && (event.key === "c" || event.key === "d")) {
      if (event.key === "c" && window.getSelection()?.toString()) return;
      event.preventDefault();
      quitToMinimal(input + (event.key === "c" ? "^C" : "^D"));
      return;
    }

    // ↑/↓ walk through past commands, newest first.
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        // Walked past the newest entry → back to a fresh line.
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }

    // Tab completes against the known command list.
    if (event.key === "Tab") {
      event.preventDefault();
      const typed = input.toLowerCase();
      if (!typed) return;
      const match = COMMAND_NAMES.find((c) => c.startsWith(typed));
      if (match) setInput(match);
    }
  }

  // Clicking anywhere in the window focuses the input.
  // (Unless the visitor is selecting text to copy)
  function focusInput() {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <div className="t-screen">
      <div className="t-window" onClick={focusInput}>
        {/* Title bar: dots, title, and ONE button. Theme stays a
              command (`theme light`), but the layout switch keeps a
              visible button as an escape hatch for non-technical visitors */}
        <header className="t-bar">
          <span className="t-dots">
            <i className="t-dot red" />
            <i className="t-dot yellow" />
            <i className="t-dot green" />
          </span>
          <span className="t-bar-title">
            {profile.name.toLowerCase().replaceAll(" ", "")}@portfolio
          </span>
          <button
            className="t-btn"
            onClick={() => controls.setLayout("minimal")}
          >
            minimal mode →
          </button>
        </header>

        <main className="t-body">
          {/* Boot banner: prints once, stays above the session. */}
          <div className="t-banner">
            <h1 className="t-name">{profile.name}</h1>
            <p className="t-tagline">
              {typed}
              {!done && <span className="t-cursor">█</span>}
            </p>
            <p className="t-hint">
              welcome to my portfolio. type <b>help</b> to see what you can do.
            </p>
          </div>

          {/* The session: every command typed so far + its output */}
          {entries.map((entry) => (
            <div className="t-entry" key={entry.id}>
              <p className="t-prompt">
                <PromptSymbol cwd={entry.cwd} />
                {entry.command}
              </p>
              {entry.output && <div className="t-output">{entry.output}</div>}
            </div>
          ))}

          {/* The live input line */}
          <div className="t-input-row">
            <p className="t-prompt t-input-prompt">
              {/* current directory here: `entry` only exists inside the
                  entries.map() above, so using it here would crash. */}
              <PromptSymbol cwd={cwd} />
            </p>
            <input
              ref={inputRef}
              className="t-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              aria-label="terminal command input"
            />
          </div>

          {/* Invisible anchor the auto-scroll aims for */}
          <div ref={endRef} />
        </main>
      </div>
    </div>
  );
}
