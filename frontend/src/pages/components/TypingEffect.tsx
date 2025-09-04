import React from "react";
import { useTypewriter } from "../../hooks/useTypewriter";
import "../../styles/typewriter.css";

interface TypingEffectProps {
  text: string;
  children?: (typedText: string) => React.ReactNode;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, children }) => {
  const out = useTypewriter(text);
  const done = out.length === text.length; // ✅ check if finished

  if (children) {
    return <span className={`tw-react ${done ? "done" : ""}`}>{children(out)}</span>;
  }

  return <span className={`tw-react ${done ? "done" : ""}`}>{out}</span>;
};

export default TypingEffect;
