"use client";

import { useEffect, useRef, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { allSearchableItems } from "@/lib/data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setQuery("");
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? allSearchableItems.filter((item) =>
        (item.name + " " + item.description).toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 backdrop-blur-sm p-4 pt-20" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-plate border border-rule rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-rule">
          <SearchIcon size={18} className="text-faint" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search data structures, algorithms, concepts..."
            className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-faint"
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-ink/[0.04] text-faint">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm font-mono text-faint">
              no results for &ldquo;{query}&rdquo;
            </div>
          )}
          {results.map((item) => (
            <Link
              key={item.slug}
              href={item.type === "data-structure" ? `/data-structures/${item.slug}` : `/algorithms/${item.slug}`}
              onClick={onClose}
              className="block px-4 py-3 border-b border-rule/60 last:border-b-0 hover:bg-ink/[0.03] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-primary/40 text-primary">
                  {item.type.replace("-", " ")}
                </span>
                <span className="font-semibold text-sm text-ink">{item.name}</span>
              </div>
              <p className="text-xs text-muted mt-1 line-clamp-1">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}