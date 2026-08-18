// useTypewriter.js: Simulates a terminal catching up to a user's typing
// Given a typed string, it returns the string typed out one character
// at a time.
//
// Usage:  const typed = useTypewriter("Hello world", 45);

import { useState, useEffect } from "react";

export function useTypewriter(fullText, speedMs = 45) {
  // Count of text characters revealed so far. (Start at 0)
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Runs after render and re-runs whenever [fullText, speedMs] changes.
    // Runs once on first mount
    setCount(0);

    // setInterval fires every {speedMs} milliseconds and reveals one
    // more character at a time
    const timer = setInterval(() => {
      setCount((current) => {
        if (current >= fullText.length) {
          clearInterval(timer); // Done typing and stops clock
          return current;
        }
        return current + 1;
      });
    }, speedMs);

    // Cleanup Step: if the component unmounts
    // (user switches to the minimal layout mid-typing), 
    // kill the timer so it does not run forever in background.
    return () => clearInterval(timer);
  }, [fullText, speedMs]);

  // slice(0, count) = first `count` characters of the text.
  // return done so that layout knows when to add blinking cursor
  return { typed: fullText.slice(0, count), done: count >= fullText.length };
}
