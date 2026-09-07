"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { SoundToggle } from "./SoundToggle";
import { SearchModal } from "./SearchModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/data-structures", label: "Data Structures" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const iconBtn =
    "p-2 rounded-md border border-transparent text-faint hover:text-ink hover:border-rule hover:bg-ink/[0.04] transition-colors duration-200";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-plate/85 backdrop-blur-xl border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-ink">
              <div className="w-8 h-8 rounded-md overflow-hidden ring-1 ring-rule shrink-0">
                <Image
                  src="/DSA-Logo.png"
                  alt="DSA Visualizer"
                  width={2000}
                  height={2000}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="hidden sm:inline">DSA Visualizer</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 font-mono text-[13px] uppercase tracking-wide border-b-2 transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-primary border-primary"
                      : "text-muted border-transparent hover:text-ink hover:border-rule"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className={iconBtn}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <SoundToggle />
              <button
                onClick={toggleTheme}
                className={iconBtn}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`${iconBtn} md:hidden`}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-rule bg-plate animate-slide-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[13px] uppercase tracking-wide rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/[0.06]"
                      : "text-muted hover:text-ink hover:bg-ink/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}