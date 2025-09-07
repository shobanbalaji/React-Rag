  import ReactMarkdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
  import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
  import { useState } from "react";
  import type { Components } from "react-markdown";
  import TypingEffect from "./TypingEffect";

  type MessageBlock = {
    type: "text" | "code";
    content: string;
    language?: string;
  };

  type ChatViewerProps = {
    request: string;
    response: MessageBlock[] | string;
    responsive: boolean;
    viewContainerRef : any
  };

  export default function ChatViewer({request, response, responsive, viewContainerRef}: ChatViewerProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const normalizedResponse: MessageBlock[] = Array.isArray(response)
      ? response
      : [{ type: "text", content: String(response) }];

    const handleCopy = async (code: string, key: string) => {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
      } catch (err) {
      }
    };

    const components: Components = {
      // @ts-ignore
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        if (!inline && match) {
          const codeContent = String(children).replace(/\n$/, "");
          const uniqueKey = `md-${match[1]}-${codeContent.length}`;
          return (
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <button
                onClick={() => handleCopy(codeContent, uniqueKey)}
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
                {copiedKey === uniqueKey ? "Copied!" : "Copy"}
              </button>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                wrapLongLines
                customStyle={{
                  margin: 0,
                  borderRadius: "12px",
                  padding: "1rem",
                  background: "#1e1e1e",
                }}
              >
                {codeContent}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    };

    return (
      <div className="chat-container">
        <pre className="request-bubble">{request}</pre>
        <div className="response-container">
          {normalizedResponse.map((block, blockIndex) => {
            if (block.type === "code") {
              const uniqueKey = `explicit-${blockIndex}`;
              return (
                <div
                  key={uniqueKey}
                  className="code-bubble"
                  style={{ position: "relative", marginBottom: "1.5rem" }}
                >
                  <button
                    onClick={() => handleCopy(block.content, uniqueKey)}
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
                    {copiedKey === uniqueKey ? "Copied!" : "Copy"}
                  </button>
                  <SyntaxHighlighter
                    language={block.language || "javascript"}
                    style={vscDarkPlus}
                    wrapLongLines
                    customStyle={{
                      margin: 0,
                      borderRadius: "12px",
                      padding: "1rem",
                      background: "#1e1e1e",
                    }}
                  >
                    {block.content}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // ✅ Only use TypingEffect if responsive is true
            return (
              <div key={`text-${blockIndex}`} className="text-block">
                {responsive ? (
                  <TypingEffect text={block.content} viewContainerRef = {viewContainerRef}>
                    {(typedText) => (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={components}
                      >
                        {typedText}
                      </ReactMarkdown>
                    )}
                  </TypingEffect>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  >
                    {block.content}
                  </ReactMarkdown>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
