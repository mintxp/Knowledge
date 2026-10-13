import React from 'react';
import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'tip';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
          defaultTitle: 'ข้อควรระวัง (Warning)',
        };
      case 'danger':
        return {
          container: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100',
          icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
          defaultTitle: 'ข้อห้ามสำคัญ (Critical / Danger)',
        };
      case 'tip':
        return {
          container: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100',
          icon: <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
          defaultTitle: 'คำแนะนำปฏิบัติ (Pro Tip)',
        };
      case 'info':
      default:
        return {
          container: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-800/80 text-slate-900 dark:text-slate-100',
          icon: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
          defaultTitle: 'ข้อมูลสำคัญ (Information)',
        };
    }
  };

  const style = getStyles();

  return (
    <aside className={`my-5 rounded-xl border p-4.5 ${style.container} text-sm leading-relaxed shadow-xs`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          <div className="font-semibold mb-1 text-[14px]">
            {title || style.defaultTitle}
          </div>
          <div className="text-slate-700 dark:text-slate-300 text-[13.5px] leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:my-2">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};
