import { useCallback, useRef, useState } from "react";

export default function useTypewriterLines(lines, { charDelay = 14, lineDelay = 260 } = {}) {
  const [typed, setTyped] = useState(() => lines.map(() => ""));
  const [activeIndex, setActiveIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setActiveIndex(0);

    let li = 0;
    let ci = 0;

    const tick = () => {
      if (li >= lines.length) {
        setActiveIndex(-1);
        setDone(true);
        return;
      }
      const text = lines[li];
      if (ci <= text.length) {
        const l = li;
        const c = ci;
        setTyped((prev) => {
          const next = [...prev];
          next[l] = text.slice(0, c);
          return next;
        });
        ci++;
        setTimeout(tick, charDelay);
      } else {
        li++;
        ci = 0;
        setActiveIndex(li);
        setTimeout(tick, lineDelay);
      }
    };

    tick();
  }, [lines, charDelay, lineDelay]);

  return { typed, activeIndex, done, start };
}
