"use client";

import { useState } from "react";

type Language = "python" | "java" | "cpp" | "javascript";

interface CodeBlock {
  language: Language;
  code: string;
}

interface CodeViewerProps {
  codeBlocks: CodeBlock[];
  activeLine?: number;
}

const LANGUAGES: Language[] = ["python", "java", "cpp", "javascript"];

const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  java: "Java",
  cpp: "C++",
  javascript: "JavaScript",
};

function highlightCode(code: string, language: Language, activeLine?: number): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    let content = line;

    if (language !== "python" && (line.includes("//") || line.includes("/*"))) {
      const commentIdx = line.indexOf("//");
      if (commentIdx !== -1) {
        const before = line.slice(0, commentIdx);
        const comment = line.slice(commentIdx);
        content = `<span class="text-faint italic">${escapeHTML(before)}${escapeHTML(comment)}</span>`;
      } else {
        content = `<span class="text-faint italic">${escapeHTML(line)}</span>`;
      }
    }

    return (
      <div
        key={i}
        className={`px-4 whitespace-pre ${
          activeLine === i
            ? "bg-accent/15 border-l-2 border-accent font-semibold"
            : "border-l-2 border-transparent transition-colors duration-300"
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  });
}

function escapeHTML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function CodeViewer({ codeBlocks, activeLine }: CodeViewerProps) {
  const [currentLang, setCurrentLang] = useState<Language>("python");

  const currentBlock = codeBlocks.find((cb) => cb.language === currentLang) || codeBlocks[0];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 bg-ink/[0.02] border-b border-rule overflow-x-auto">
        {LANGUAGES.map((lang) => {
          const available = codeBlocks.some((cb) => cb.language === lang);
          return (
            <button
              key={lang}
              onClick={() => available && setCurrentLang(lang)}
              disabled={!available}
              className={`px-3 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wide transition-colors whitespace-nowrap ${
                currentLang === lang
                  ? "bg-primary-fill text-white"
                  : available
                  ? "text-muted hover:text-ink hover:bg-ink/[0.04]"
                  : "text-faint cursor-not-allowed"
              }`}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          );
        })}
      </div>
      <div className="font-mono text-[13px] leading-7 overflow-x-auto bg-ink/[0.02] py-3 text-ink">
        {highlightCode(currentBlock.code, currentBlock.language, activeLine)}
      </div>
    </div>
  );
}