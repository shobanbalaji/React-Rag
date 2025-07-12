import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/prism";

type ChatViewerProps = {
  response: string;
  request: string;
};

const ChatViewer: React.FC<ChatViewerProps> = ({ request, response }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
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
            marginLeft: "auto",
            backgroundColor: "rgb(108 117 125 / 26%)",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          {request}
        </p>

        <div
          className="response-markdown"
          style={{
            textAlign: "justify",
            color: "#ececec",
            fontSize: "15px",
            fontFamily: "Arial, Helvetica, sans-serif",
            lineHeight: "28px",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match?.[1] || "plaintext";
                const code = String(children).trim();
                const index = node?.position?.start.line || Math.random(); // fallback index

                if (inline) {
                  return (
                    <code
                      style={{
                        backgroundColor: "#333",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        textShadow:"none"
                      }}
                      {...props}
                    >
                      {code}
                    </code>
                  );
                }

                return (
                  <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.3rem 1rem",
                        background: "#1e1e1e",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        fontSize: "12px",
                        color: "#bbb",
                        fontFamily: "monospace",
                      }}
                    >
                      <span>{language}</span>
                      <button
                        onClick={() => handleCopy(code, index)}
                        style={{
                          background: "transparent",
                          border: "1px solid #555",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        {copiedIndex === index ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      // style={vs2015}
                      customStyle={{
                        padding: "1rem",
                        margin: 0,
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        backgroundColor: "#1e1e1e",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                      wrapLines
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatViewer;
