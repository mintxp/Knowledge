import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-bash';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const getGrammar = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'ts':
      case 'typescript':
        return Prism.languages.typescript || Prism.languages.javascript;
      case 'js':
      case 'javascript':
        return Prism.languages.javascript;
      case 'json':
        return Prism.languages.json;
      case 'yaml':
      case 'yml':
        return Prism.languages.yaml;
      case 'docker':
      case 'dockerfile':
        return Prism.languages.docker;
      case 'bash':
      case 'shell':
      case 'sh':
        return Prism.languages.bash;
      default:
        return Prism.languages.markup || Prism.languages.javascript;
    }
  };

  const highlightedCode = React.useMemo(() => {
    try {
      const grammar = getGrammar(language);
      if (grammar) {
        return Prism.highlight(code.trim(), grammar, language);
      }
    } catch {
      // fallback to plain text escaping
    }
    return code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }, [code, language]);

  const lines = code.trim().split('\n');

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 shadow-sm text-[13px] font-mono leading-relaxed">
      {/* File Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          {filename ? (
            <span className="text-slate-200 font-medium">{filename}</span>
          ) : (
            <span className="uppercase tracking-wider text-[11px] text-slate-400">{language}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">{language}</span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs cursor-pointer"
            title="คัดลอกโค้ด"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอก</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 flex">
        {showLineNumbers && (
          <div className="select-none pr-4 text-slate-600 text-right font-mono text-xs border-r border-slate-800/70 mr-4">
            {lines.map((_, i) => (
              <div key={i} className="leading-6 tabular-nums">{i + 1}</div>
            ))}
          </div>
        )}
        <pre className="flex-1 font-mono text-xs leading-6 overflow-x-auto text-slate-200 focus:outline-none">
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className={`language-${language}`}
          />
        </pre>
      </div>
    </div>
  );
};
