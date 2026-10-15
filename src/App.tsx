/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { LoginChapter } from './components/chapters/LoginChapter';
import { LoggingChapter } from './components/chapters/LoggingChapter';
import { DockerChapter } from './components/chapters/DockerChapter';
import { NodeJsChapter } from './components/chapters/NodeJsChapter';
import { CliCheatSheetChapter } from './components/chapters/CliCheatSheetChapter';
import { WindowsLinuxCommandsChapter } from './components/chapters/WindowsLinuxCommandsChapter';
import { BatchScriptingChapter } from './components/chapters/BatchScriptingChapter';
import { AngularDevelopmentChapter } from './components/chapters/AngularDevelopmentChapter';
import { AutomataChapter } from './components/chapters/AutomataChapter';
import { PromptLibraryChapter } from './components/chapters/PromptLibraryChapter';
import { DOCS_SECTIONS } from './data/docsContent';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState<string>('login-session-architecture');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Sync dark class on <html> and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectChapter = (id: string, anchor?: string) => {
    setActiveChapterId(id);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentSection = DOCS_SECTIONS.find((s) => s.id === activeChapterId);

  // Pagination calculation
  const currentIndex = DOCS_SECTIONS.findIndex((s) => s.id === activeChapterId);
  const prevChapter = currentIndex > 0 ? DOCS_SECTIONS[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < DOCS_SECTIONS.length - 1
    ? DOCS_SECTIONS[currentIndex + 1]
    : activeChapterId !== 'prompt-library'
    ? { id: 'prompt-library', shortTitle: 'Prompt Library & AI Generator' }
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        mobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        activeId={activeChapterId}
        onSelectChapter={handleSelectChapter}
      />

      {/* Main 3-Column Documentation Container */}
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          activeId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
            <span
              onClick={() => handleSelectChapter('login-session-architecture')}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              คู่มือวิศวกรรมซอฟต์แวร์
            </span>
            <span aria-hidden="true">/</span>
            <span>
              {activeChapterId === 'prompt-library'
                ? 'AI Prompts'
                : currentSection?.category || 'เอกสาร'}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 dark:text-slate-200 truncate">
              {activeChapterId === 'prompt-library'
                ? 'Prompt Library'
                : currentSection?.shortTitle}
            </span>
          </nav>

          {/* Chapter Renderers */}
          {activeChapterId === 'login-session-architecture' && (
            <LoginChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'logging-audit-trail' && (
            <LoggingChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'docker-for-teams' && (
            <DockerChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'nodejs-production-guide' && (
            <NodeJsChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'cli-cheat-sheet' && (
            <CliCheatSheetChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'windows-linux-commands' && (
            <WindowsLinuxCommandsChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'batch-scripting-guide' && (
            <BatchScriptingChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'angular-development-guide' && (
            <AngularDevelopmentChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'automata-state-machine' && (
            <AutomataChapter promptText={currentSection?.promptText || ''} />
          )}

          {activeChapterId === 'prompt-library' && <PromptLibraryChapter />}

          {/* Bottom Pagination Links (Nextra Style) */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevChapter ? (
              <button
                onClick={() => handleSelectChapter(prevChapter.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  <span>บทความก่อนหน้า</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {prevChapter.shortTitle}
                </div>
              </button>
            ) : <div />}

            {nextChapter ? (
              <button
                onClick={() => handleSelectChapter(nextChapter.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/40 text-right transition-colors cursor-pointer group sm:col-start-2"
              >
                <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mb-1">
                  <span>บทความถัดไป</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {nextChapter.shortTitle}
                </div>
              </button>
            ) : null}
          </div>

          {/* Footer note */}
          <footer className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-900 text-center text-xs text-slate-500">
            <p>Software Engineer Handbook · ออกแบบตามสไตล์ Nextra Framework สำหรับทีมพัฒนาซอฟต์แวร์</p>
          </footer>
        </main>

        {/* Right Table of Contents (On this page) */}
        {currentSection && activeChapterId !== 'prompt-library' && (
          <TableOfContents
            headings={currentSection.headings}
            promptText={currentSection.promptText}
          />
        )}
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectChapter}
      />
    </div>
  );
}
