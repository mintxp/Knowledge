import React, { useState } from 'react';
import { ShieldCheck, FileText, Container, Server, Terminal, Sparkles, Search, BookOpen, Layers } from 'lucide-react';
import { DOCS_SECTIONS } from '../data/docsContent';

interface SidebarProps {
  activeId: string;
  onSelectChapter: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelectChapter,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [filterText, setFilterText] = useState('');

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'Container':
        return <Container className="w-4 h-4 text-cyan-500 shrink-0" />;
      case 'Server':
        return <Server className="w-4 h-4 text-violet-500 shrink-0" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const filteredSections = DOCS_SECTIONS.filter((s) =>
    s.title.toLowerCase().includes(filterText.toLowerCase()) ||
    s.category.toLowerCase().includes(filterText.toLowerCase()) ||
    s.headings.some(h => h.title.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelect = (id: string) => {
    onSelectChapter(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-15 z-35 md:z-10 h-[calc(100vh-3.75rem)] w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] transition-transform duration-200 ease-in-out overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* Filter in sidebar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="กรองหัวข้อ..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Group 1: Core Guides */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
              คู่มือหลักสำหรับทีม (Core Guides)
            </div>
            <div className="space-y-1">
              {filteredSections.map((sec) => {
                const isActive = activeId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelect(sec.id)}
                    className={`w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="mt-0.5">{getIcon(sec.iconName)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-1">{sec.shortTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {sec.readingTime} · {sec.category.split(' & ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: AI Prompt Library */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
              AI Prompts & Templates
            </div>
            <button
              onClick={() => handleSelect('prompt-library')}
              className={`w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                activeId === 'prompt-library'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="line-clamp-1">Prompt Library & Generator</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  คลังแม่แบบคำสั่ง AI สำหรับวิศวกร
                </div>
              </div>
            </button>
          </div>

          {/* Group 3: Subheadings of Active Section */}
          {activeId !== 'prompt-library' && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                โครงสร้างในบทนี้
              </div>
              <div className="space-y-1 pl-1">
                {DOCS_SECTIONS.find((s) => s.id === activeId)?.headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(h.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        onCloseMobile();
                      }
                    }}
                    className={`block py-1 px-2.5 text-[11px] rounded transition-colors text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 line-clamp-1 ${
                      h.level === 3 ? 'pl-5 text-slate-500' : ''
                    }`}
                  >
                    {h.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 px-2 leading-relaxed">
            สร้างตามข้อกำหนด Nextra Framework Layout เพื่อเป็นคู่มือซอฟต์แวร์ระดับโปรดักชัน
          </div>
        </div>
      </aside>
    </>
  );
};
