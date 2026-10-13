import React from 'react';
import { Search, Sun, Moon, Menu, X, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  activeId: string;
  onSelectChapter: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  isDark,
  onToggleTheme,
  mobileMenuOpen,
  onToggleMobileMenu,
  activeId,
  onSelectChapter,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-15">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectChapter('login-session-architecture');
            }}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>SWE Handbook</span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onSelectChapter('login-session-architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'login-session-architecture'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Login & Session
          </button>
          <button
            onClick={() => onSelectChapter('logging-audit-trail')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'logging-audit-trail'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Logging & Audit
          </button>
          <button
            onClick={() => onSelectChapter('docker-for-teams')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'docker-for-teams'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Docker สำหรับทีม
          </button>
          <button
            onClick={() => onSelectChapter('nodejs-production-guide')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'nodejs-production-guide'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Node.js Guide
          </button>
          <button
            onClick={() => onSelectChapter('cli-cheat-sheet')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'cli-cheat-sheet'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CLI Cheat Sheet
          </button>
          <button
            onClick={() => onSelectChapter('prompt-library')}
            className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeId === 'prompt-library'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Prompts</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search & Theme Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search trigger button in Nextra style */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ค้นหาเนื้อหา...</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Toggle Color Theme"
            title={isDark ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
