import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { DOCS_SECTIONS } from '../data/docsContent';

interface SearchResult {
  sectionId: string;
  title: string;
  category: string;
  matchType: 'chapter' | 'heading' | 'description' | 'keyword';
  matchText: string;
  targetAnchor?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sectionId: string, anchor?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          const item = results[selectedIndex];
          onSelect(item.sectionId, item.targetAnchor);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getResults = (): SearchResult[] => {
    const q = query.trim().toLowerCase();
    const list: SearchResult[] = [];

    // Add prompt library as an item
    if (q === '' || 'prompt library'.includes(q) || 'แม่แบบ'.includes(q) || 'ai'.includes(q)) {
      list.push({
        sectionId: 'prompt-library',
        title: 'Prompt Library & AI Generator',
        category: 'AI Prompts',
        matchType: 'chapter',
        matchText: 'คลังคำสั่งและแม่แบบสร้างคู่มือสำหรับวิศวกรซอฟต์แวร์',
      });
    }

    DOCS_SECTIONS.forEach((sec) => {
      // Check title match
      if (q === '' || sec.title.toLowerCase().includes(q) || sec.shortTitle.toLowerCase().includes(q)) {
        list.push({
          sectionId: sec.id,
          title: sec.title,
          category: sec.category,
          matchType: 'chapter',
          matchText: sec.description,
        });
      }

      // Check headings match
      sec.headings.forEach((h) => {
        if (q !== '' && h.title.toLowerCase().includes(q)) {
          list.push({
            sectionId: sec.id,
            title: `${sec.shortTitle} → ${h.title}`,
            category: sec.category,
            matchType: 'heading',
            matchText: `หัวข้อย่อยใน ${sec.shortTitle}`,
            targetAnchor: h.id,
          });
        }
      });
    });

    return list.slice(0, 8);
  };

  const results = getResults();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ค้นหาคู่มือ, โค้ด, หรือหัวข้อ เช่น JWT, Docker, PDPA, Log..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-900">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              ไม่พบผลลัพธ์สำหรับ "{query}"
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={`${item.sectionId}-${item.targetAnchor || ''}-${idx}`}
                  onClick={() => {
                    onSelect(item.sectionId, item.targetAnchor);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">
                      {item.sectionId === 'prompt-library' ? (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.matchText}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑</kbd>{' '}
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↓</kbd> นำทาง
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">Enter</kbd> เลือก
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">Esc</kbd> ปิด
            </span>
          </div>
          <div>คู่มือวิศวกรรมซอฟต์แวร์</div>
        </div>
      </div>
    </div>
  );
};
