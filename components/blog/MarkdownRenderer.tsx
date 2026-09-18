"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Copy,
  Check,
  CheckSquare,
  Square,
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type CalloutType = "note" | "tip" | "warning" | "important" | "caution";

interface CalloutConfig {
  icon: React.ElementType;
  title: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  iconClass: string;
}

const CALLOUT_CONFIGS: Record<CalloutType, CalloutConfig> = {
  note: {
    icon: Info,
    title: "Note",
    borderClass: "border-info",
    bgClass: "bg-info-light/70",
    textClass: "text-info-text",
    iconClass: "text-info",
  },
  tip: {
    icon: Lightbulb,
    title: "Pro Tip",
    borderClass: "border-success",
    bgClass: "bg-success-light/70",
    textClass: "text-success-text",
    iconClass: "text-success",
  },
  warning: {
    icon: AlertTriangle,
    title: "Warning",
    borderClass: "border-warning",
    bgClass: "bg-warning-light/70",
    textClass: "text-warning-text",
    iconClass: "text-warning",
  },
  important: {
    icon: CheckCircle2,
    title: "Important",
    borderClass: "border-flash-orange",
    bgClass: "bg-flash-orange/10",
    textClass: "text-tech-slate",
    iconClass: "text-flash-orange",
  },
  caution: {
    icon: AlertOctagon,
    title: "Caution",
    borderClass: "border-error",
    bgClass: "bg-error-light/70",
    textClass: "text-error-text",
    iconClass: "text-error",
  },
};

/**
 * Parses inline markdown: bold, italic, code, links, strikethrough
 */
function renderInline(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  // Regex to match inline patterns:
  // 1: Link: [label](url)
  // 2: Bold: **text** or __text__
  // 3: Italic: *text* or _text_
  // 4: Inline code: `text`
  // 5: Strikethrough: ~~text~~
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|(?<!\*)\*(?!\*).*?(?<!\*)\*(?!\*)|`.*?`|~~.*?~~)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      // Link [text](url)
      const closeBracket = token.indexOf("](");
      const label = token.slice(1, closeBracket);
      const href = token.slice(closeBracket + 2, -1);
      const isInternal = href.startsWith("/") || href.startsWith("#");

      if (isInternal) {
        elements.push(
          <Link
            key={`l-${keyIndex++}`}
            href={href}
            className="font-medium text-flash-orange hover:text-flash-orange-hover underline decoration-flash-orange/40 hover:decoration-flash-orange transition-colors"
          >
            {label}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={`a-${keyIndex++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-flash-orange hover:text-flash-orange-hover underline decoration-flash-orange/40 hover:decoration-flash-orange transition-colors"
          >
            {label}
          </a>
        );
      }
    } else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      // Bold
      elements.push(
        <strong key={`b-${keyIndex++}`} className="font-bold text-tech-slate">
          {renderInline(token.slice(2, -2))}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      // Italic
      elements.push(
        <em key={`i-${keyIndex++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      // Inline code
      elements.push(
        <code
          key={`c-${keyIndex++}`}
          className="rounded-md bg-mist-gray px-1.5 py-0.5 font-mono text-xs sm:text-sm font-semibold text-tech-slate border border-border-default"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      // Strikethrough
      elements.push(
        <del key={`d-${keyIndex++}`} className="line-through text-text-muted">
          {token.slice(2, -2)}
        </del>
      );
    } else {
      elements.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

/**
 * Creates slug for anchor links
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Code Block Component with Copy to Clipboard
 */
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden bg-tech-slate border border-border-dark shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5 bg-tech-slate-dark border-b border-border-dark text-xs font-mono text-text-muted">
        <span className="uppercase tracking-wider font-semibold">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-2xs font-semibold text-text-muted hover:text-clean-white hover:bg-tech-slate transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-mist-gray leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Main Client-Side Markdown Parser & Renderer Component
 */
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const parsedNodes = useMemo(() => {
    if (!content) return [];

    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let nodeKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Fenced Code Block: ```language
      if (line.trim().startsWith("```")) {
        const langMatch = line.trim().match(/^```(\w*)/);
        const language = langMatch ? langMatch[1] : "";
        const codeLines: string[] = [];
        i++;

        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```

        nodes.push(
          <CodeBlock
            key={`code-${nodeKey++}`}
            code={codeLines.join("\n")}
            language={language}
          />
        );
        continue;
      }

      // 2. Horizontal Rule: --- or ***
      if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
        nodes.push(
          <hr key={`hr-${nodeKey++}`} className="my-8 border-t border-border-default" />
        );
        i++;
        continue;
      }

      // 3. Headings: #, ##, ###, ####
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = slugify(text);

        switch (level) {
          case 1:
            nodes.push(
              <h1
                key={`h1-${nodeKey++}`}
                id={id}
                className="scroll-mt-24 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight mt-10 mb-4"
              >
                {renderInline(text)}
              </h1>
            );
            break;
          case 2:
            nodes.push(
              <h2
                key={`h2-${nodeKey++}`}
                id={id}
                className="scroll-mt-24 font-heading text-xl sm:text-2xl font-bold text-tech-slate tracking-tight mt-8 mb-3.5 pb-2 border-b border-border-default"
              >
                {renderInline(text)}
              </h2>
            );
            break;
          case 3:
            nodes.push(
              <h3
                key={`h3-${nodeKey++}`}
                id={id}
                className="scroll-mt-24 font-heading text-lg sm:text-xl font-bold text-tech-slate mt-6 mb-2.5"
              >
                {renderInline(text)}
              </h3>
            );
            break;
          default:
            nodes.push(
              <h4
                key={`h4-${nodeKey++}`}
                id={id}
                className="scroll-mt-24 font-heading text-base sm:text-lg font-bold text-tech-slate mt-5 mb-2"
              >
                {renderInline(text)}
              </h4>
            );
            break;
        }
        i++;
        continue;
      }

      // 4. Blockquotes & GitHub Style Alerts: > [!NOTE], > [!TIP], etc.
      if (line.trim().startsWith(">")) {
        const quoteLines: string[] = [];

        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }

        const fullQuoteText = quoteLines.join("\n").trim();
        const alertMatch = fullQuoteText.match(
          /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*([\s\S]*)$/i
        );

        if (alertMatch) {
          const type = alertMatch[1].toLowerCase() as CalloutType;
          const body = alertMatch[2].trim();
          const config = CALLOUT_CONFIGS[type] || CALLOUT_CONFIGS.note;
          const Icon = config.icon;

          nodes.push(
            <aside
              key={`alert-${nodeKey++}`}
              role="alert"
              className={`my-6 rounded-2xl border-l-4 ${config.borderClass} ${config.bgClass} p-4 sm:p-5 shadow-2xs`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4.5 w-4.5 ${config.iconClass}`} />
                <span className={`font-heading text-xs sm:text-sm font-bold uppercase tracking-wider ${config.iconClass}`}>
                  {config.title}
                </span>
              </div>
              <div className={`text-xs sm:text-sm leading-relaxed ${config.textClass} space-y-2`}>
                {body.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx}>{renderInline(para)}</p>
                ))}
              </div>
            </aside>
          );
        } else {
          // Standard blockquote
          nodes.push(
            <blockquote
              key={`quote-${nodeKey++}`}
              className="my-6 rounded-r-2xl border-l-4 border-flash-orange bg-mist-gray/60 p-4 sm:p-5 text-text-secondary italic text-sm sm:text-base leading-relaxed"
            >
              {quoteLines.map((qLine, qIdx) => (
                <p key={qIdx} className={qIdx > 0 ? "mt-2" : ""}>
                  {renderInline(qLine)}
                </p>
              ))}
            </blockquote>
          );
        }
        continue;
      }

      // 5. Tables: | Header | Header |
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];

        while (
          i < lines.length &&
          lines[i].trim().startsWith("|") &&
          lines[i].trim().endsWith("|")
        ) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const parseRow = (rowStr: string) =>
            rowStr
              .slice(1, -1)
              .split("|")
              .map((c) => c.trim());

          const headers = parseRow(tableLines[0]);
          // check if row 1 is divider
          const isDivider = /^(\|\s*[-:]+[-| :]*\|)$/.test(tableLines[1]);
          const dataRows = (isDivider ? tableLines.slice(2) : tableLines.slice(1)).map(
            parseRow
          );

          nodes.push(
            <div
              key={`table-${nodeKey++}`}
              className="my-6 overflow-x-auto rounded-2xl border border-border-default shadow-2xs bg-clean-white"
            >
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-mist-gray border-b border-border-default">
                  <tr>
                    {headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-3 font-heading font-bold text-tech-slate uppercase tracking-wider text-2xs sm:text-xs"
                      >
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {dataRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? "bg-clean-white" : "bg-elevated-surface/50"}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-text-secondary font-medium"
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 6. Lists: Unordered (- or *), Ordered (1.), Checklists (- [ ])
      const isUnordered = /^(\s*)[-*]\s+(.*)$/.test(line);
      const isOrdered = /^(\s*)\d+\.\s+(.*)$/.test(line);

      if (isUnordered || isOrdered) {
        const listItems: {
          text: string;
          isChecklist: boolean;
          checked?: boolean;
          indent: number;
        }[] = [];
        const isOrderedList = isOrdered;

        while (i < lines.length) {
          const currLine = lines[i];
          const uMatch = currLine.match(/^(\s*)[-*]\s+(.*)$/);
          const oMatch = currLine.match(/^(\s*)\d+\.\s+(.*)$/);

          if (isOrderedList ? oMatch : uMatch) {
            const match = isOrderedList ? oMatch! : uMatch!;
            const indent = match[1].length;
            const rawText = match[2];

            // Check if checklist item: [ ] or [x]
            const checkMatch = rawText.match(/^\[([ xX])\]\s+(.*)$/);
            if (checkMatch) {
              listItems.push({
                text: checkMatch[2],
                isChecklist: true,
                checked: checkMatch[1].toLowerCase() === "x",
                indent,
              });
            } else {
              listItems.push({
                text: rawText,
                isChecklist: false,
                indent,
              });
            }
            i++;
          } else {
            break;
          }
        }

        const hasChecklist = listItems.some((item) => item.isChecklist);

        if (hasChecklist) {
          nodes.push(
            <div key={`checklist-${nodeKey++}`} className="my-5 space-y-2.5">
              {listItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary"
                >
                  {item.checked ? (
                    <CheckSquare className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <Square className="h-4 w-4 text-text-muted shrink-0 mt-0.5" />
                  )}
                  <span className={item.checked ? "line-through text-text-muted" : ""}>
                    {renderInline(item.text)}
                  </span>
                </div>
              ))}
            </div>
          );
        } else if (isOrderedList) {
          nodes.push(
            <ol
              key={`ol-${nodeKey++}`}
              className="my-5 list-decimal pl-5 space-y-2 text-xs sm:text-sm sm:leading-relaxed text-text-secondary marker:font-bold marker:text-flash-orange"
            >
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {renderInline(item.text)}
                </li>
              ))}
            </ol>
          );
        } else {
          nodes.push(
            <ul
              key={`ul-${nodeKey++}`}
              className="my-5 list-disc pl-5 space-y-2 text-xs sm:text-sm sm:leading-relaxed text-text-secondary marker:text-flash-orange"
            >
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {renderInline(item.text)}
                </li>
              ))}
            </ul>
          );
        }
        continue;
      }

      // 7. Regular Paragraph or blank lines
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Collect contiguous paragraph lines
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith(">") &&
        !lines[i].trim().startsWith("```") &&
        !/^(\s*)[-*]\s+/.test(lines[i]) &&
        !/^(\s*)\d+\.\s+/.test(lines[i]) &&
        !/^(\s*[-*_]\s*){3,}$/.test(lines[i]) &&
        !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|"))
      ) {
        paraLines.push(lines[i]);
        i++;
      }

      if (paraLines.length > 0) {
        nodes.push(
          <p
            key={`p-${nodeKey++}`}
            className="my-3.5 text-xs sm:text-sm sm:text-base leading-relaxed text-text-secondary font-normal"
          >
            {renderInline(paraLines.join(" "))}
          </p>
        );
      }
    }

    return nodes;
  }, [content]);

  return <article className={`blog-prose ${className}`}>{parsedNodes}</article>;
}
