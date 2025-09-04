import { useEffect, useState } from "react";

interface TypewriterOptions {
  speed?: number;       // base ms per character
  randomness?: number;  // adds natural variation
  punctPause?: number;  // extra pause on punctuation
}

export function useTypewriter(
  text: string,
  opts: TypewriterOptions = {}
): string {
  const { speed = 28, randomness = 0.35, punctPause = 260 } = opts;
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    setOut("");

    const tick = () => {
      if (i > text.length) return;

      setOut(text.slice(0, i));

      const prev = text[i - 1] || "";
      const isPunct = /[.,!?;:]/.test(prev);
      const jitter = speed * randomness * (Math.random() - 0.5) * 2;
      const delay = Math.max(0, speed + jitter + (isPunct ? punctPause : 0));

      i++;
      timer = setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [text, speed, randomness, punctPause]);

  return out;
}
