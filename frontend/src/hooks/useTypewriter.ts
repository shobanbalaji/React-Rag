import { useEffect, useState } from "react";

interface TypewriterOptions {
  speed?: number;       // base ms per character
  randomness?: number;  // adds natural variation
  punctPause?: number;  // extra pause on punctuation
}

export function useTypewriter(
  text: string,
  opts: TypewriterOptions = {},
  viewContainerRef?: React.RefObject<HTMLElement>
): string {
  const { speed = 12, randomness = 0.2, punctPause = 120 } = opts;
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!text) {
      setOut("");
      return;
    }

    const tokens: { text: string; isNewline: boolean }[] = [];
    let p = 0;
    while (p < text.length) {
      if (text[p] === "\n") {
        let j = p;
        while (j < text.length && text[j] === "\n") j++;
        tokens.push({ text: text.slice(p, j), isNewline: true });
        p = j;
      } else {
        let j = p;
        while (j < text.length && text[j] !== "\n") j++;
        tokens.push({ text: text.slice(p, j), isNewline: false });
        p = j;
      }
    }

    let tokenIndex = 0;
    let charIndex = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    setOut("");

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const tick = () => {
      clearTimer();

      if (tokenIndex >= tokens.length) return;

      const token = tokens[tokenIndex];

      if (token.isNewline) {
        setOut((prev) => {
          const newText = prev + token.text;

          // scroll after adding newline
          viewContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
          return newText;
        });
        tokenIndex++;
        timer = setTimeout(tick, 0);
        return;
      }

      const chunk = token.text;
      if (charIndex < chunk.length) {
        const ch = chunk.charAt(charIndex);
        setOut((prev) => {
          const newText = prev + ch;

          // scroll as each character is added
          viewContainerRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
          return newText;
        });

        const prevChar = charIndex > 0 ? chunk.charAt(charIndex - 1) : "";
        const isPunct = /[.,!?;:]/.test(prevChar);
        const jitter = speed * randomness * (Math.random() - 0.5) * 2;
        const delay = Math.max(0, speed + jitter + (isPunct ? punctPause : 0));

        charIndex++;
        timer = setTimeout(tick, delay);
        return;
      }

      tokenIndex++;
      charIndex = 0;
      timer = setTimeout(tick, Math.max(0, speed));
    };

    timer = setTimeout(tick, 0);

    return () => {
      clearTimer();
    };
  }, [text, speed, randomness, punctPause, viewContainerRef]);

  return out;
}
