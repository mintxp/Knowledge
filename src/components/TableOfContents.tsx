import React, { useEffect, useState } from 'react';
import { ArrowUp, Sparkles, Copy, Check } from 'lucide-react';

interface HeadingItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
  promptText?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  promptText,
}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveHeadingId(headings[i].id);
          return;
        }
      }
      if (headings.length > 0) {
        setActiveHeadingId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPrompt = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // fallback
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0 sticky top-15 h-[calc(100vh-3.75rem)] overflow-y-auto p-6 text-xs border-l border-slate-200 dark:border-slate-800">
      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-xs tracking-tight">
        ในหน้านี้ (On this page)
      </div>

      <nav className="space-y-1 mb-6">
        {headings.map((h) => {
          const isActive = activeHeadingId === h.id;
          return (
            <button
              key={h.id}
              onClick={() => scrollToHeading(h.id)}
              className={`block w-full text-left py-1 text-xs transition-colors cursor-pointer truncate ${
                h.level === 3 ? 'pl-4' : 'pl-0'
              } ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={h.title}
            >
              {h.title}
            </button>
          );
        })}
      </nav>

      {/* Auxiliary actions */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {promptText && (
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-xs w-full"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">คัดลอก Master Prompt แล้ว</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>คัดลอก Master Prompt</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer text-xs"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>เลื่อนกลับขึ้นด้านบน</span>
        </button>
      </div>
    </aside>
  );
};
