import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const separateTextAndCode = (response: string) => {
  const codeRegex = /```([\w+]*)\s*([\s\S]*?)```/g;
  const result: {
    type: "text" | "code";
    content: string;
    language?: string;
  }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(response)) !== null) {
    const [fullMatch, lang, code] = match;
    const index = match.index;

    if (lastIndex < index) {
      const text = response.slice(lastIndex, index).trim();
      if (text) result.push({ type: "text", content: text });
    }

    result.push({
      type: "code",
      language: lang || "plaintext",
      content: code.trim(),
    });

    lastIndex = index + fullMatch.length;
  }

  const remainingText = response.slice(lastIndex).trim();
  if (remainingText) {
    result.push({ type: "text", content: remainingText });
  }

  return result;
};

type ChatViewerProps = {
  response: string;
  request: string;
};

const ChatViewer: React.FC<ChatViewerProps> = ({ request, response }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (code:any) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
      }}
    >
      <div style={{ width: "65%" }}>
        <p
          className="text-white px-3 py-2 mt-2 mb-5"
          style={{
            width: "fit-content",
            maxWidth: "500px",
            borderRadius: "18px",
            fontSize: "15px",
            marginLeft: "auto", // pushes element to the right
            backgroundColor: "rgb(108 117 125 / 26%)",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          {request}
        </p>

        {separateTextAndCode(response).map((block, index) =>
          block.type === "code" ? (
            <>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <button
                  onClick={()=>handleCopy(block.content)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "10px",
                    background: "#2d2d2d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>

                <SyntaxHighlighter
                  language={block.language}
                  style={vscDarkPlus}
                  wrapLongLines
                  customStyle={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    borderRadius: "12px",
                    padding: "1rem",
                  }}
                >
                  {block.content}
                </SyntaxHighlighter>
              </div>
            </>
          ) : (
            <div
              key={index}
              style={{
                textAlign: "justify",
                color: "#ececec",
                fontSize: "15px",
                fontFamily: "Arial, Helvetica, sans-serif",
                lineHeight: "28px",
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {block.content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
      
    </div>
  );
};

export default ChatViewer;
