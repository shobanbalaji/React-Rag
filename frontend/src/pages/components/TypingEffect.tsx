import React from "react";
import { useTypewriter } from "../../hooks/useTypewriter";
import "../../styles/typewriter.css";

interface TypingEffectProps {
  text: string;
  children?: (typedText: string) => React.ReactNode;
  viewContainerRef:any;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, children, viewContainerRef}) => {
  const out = useTypewriter(text, viewContainerRef);

  // compare only visible characters (ignore line breaks) so cursor hides correctly
  const visibleLen = text.replace(/\n/g, "").length;
  const outVisibleLen = out.replace(/\n/g, "").length;
  const done = outVisibleLen >= visibleLen && visibleLen === text.length - (text.match(/\n/g)?.length ?? 0);

  // simpler done fallback (works fine): done when the visible counts match
  // const done = out.replace(/\n/g, "").length === text.replace(/\n/g, "").length;

  if (children) {
    return (
      <span className={`tw-react ${done ? "done" : ""}`}>
        {children(out)}
      </span>
    );
  }

  return <span className={`tw-react ${done ? "done" : ""}`}>{out}</span>;
};

export default TypingEffect;
