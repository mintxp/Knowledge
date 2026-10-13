import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, Sliders, ArrowRight } from 'lucide-react';
import { DOCS_SECTIONS } from '../../data/docsContent';

export const PromptLibraryChapter: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Customizer state
  const [customTopic, setCustomTopic] = useState('การออกแบบระบบ Caching และ Redis Invalidations');
  const [customBackend, setCustomBackend] = useState('Node.js / Express');
  const [customFrontend, setCustomFrontend] = useState('Angular');
  const [customDatabase, setCustomDatabase] = useState('PostgreSQL + Redis');
  const [customFormat, setCustomFormat] = useState('MDX Format (Nextra Style)');
  const [copiedCustom, setCopiedCustom] = useState(false);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  const generatedCustomPrompt = `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับหัวข้อ '${customTopic}' โดยใช้สแต็ก ${customBackend} ร่วมกับ ${customFrontend} และ ${customDatabase}

รายละเอียดที่ต้องครอบคลุม:
1. สถาปัตยกรรมและกลไกการทำงานระดับ Low-level พร้อมเปรียบเทียบทางเลือกหลัก
2. ปัญหาที่พบบ่อยในระดับ Production และแนวทางแก้ไข (Pitfalls & Defenses)
3. ตัวอย่างโค้ดจำลองที่สมบูรณ์และใช้งานได้จริง
4. สรุป Checklist ข้อควรปฏิบัติ (Best Practices) สำหรับทีมวิศวกรซอฟต์แวร์
จัดรูปแบบให้อยู่ในสไตล์คู่มือ ${customFormat}`;

  const handleCopyCustom = async () => {
    try {
      await navigator.clipboard.writeText(generatedCustomPrompt);
      setCopiedCustom(true);
      setTimeout(() => setCopiedCustom(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          <span>คลังคำสั่ง & แม่แบบ AI สำหรับวิศวกร</span>
          <span aria-hidden="true">·</span>
          <span>Prompt Engineering Templates</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          คลัง Prompt แม่แบบสำหรับเขียนคู่มือ Software Engineer
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          รวบรวมทั้ง 3 Master Prompts ที่ใช้ในการสังเคราะห์เนื้อหาคู่มือ พร้อมเครื่องมือ Interactive Prompt Generator 
          ให้คุณสามารถปรับแต่งตัวแปรทางเทคนิค เพื่อสร้างคู่มือ MDX ในหัวข้ออื่นๆ สำหรับทีมพัฒนาของคุณได้ทันที
        </p>
      </div>

      {/* Master Prompts */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Master Prompts ทั้ง 4 หัวข้อหลักระดับ Production
        </h2>

        <div className="space-y-6">
          {DOCS_SECTIONS.map((section, idx) => (
            <div
              key={section.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-900">
                <div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                    Prompt 0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {section.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(section.promptText, idx)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> คัดลอกแล้ว
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> คัดลอก Prompt นี้
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {section.promptText}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Customizer */}
      <section className="mb-12 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            เครื่องมือสร้าง Prompt คู่มือสำหรับหัวข้อใหม่ (Customizer)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
          เลือกเทคโนโลยีและหัวข้อที่ทีมคุณกำลังทำงานอยู่ เพื่อสร้าง Prompt แม่แบบที่พร้อมคัดลอกไปสั่งการโมเดล AI
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              หัวข้อบทความ (Topic)
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="เช่น การออกแบบระบบ Caching"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Backend Framework
            </label>
            <select
              value={customBackend}
              onChange={(e) => setCustomBackend(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Node.js / Express">Node.js / Express</option>
              <option value="NestJS (TypeScript)">NestJS (TypeScript)</option>
              <option value="Go / Gin">Go / Gin</option>
              <option value="Python / FastAPI">Python / FastAPI</option>
              <option value="Java / Spring Boot">Java / Spring Boot</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Frontend Framework
            </label>
            <select
              value={customFrontend}
              onChange={(e) => setCustomFrontend(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Angular">Angular</option>
              <option value="React (Next.js)">React (Next.js)</option>
              <option value="Vue (Nuxt.js)">Vue (Nuxt.js)</option>
              <option value="Flutter (Mobile)">Flutter (Mobile)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Database & Storage
            </label>
            <select
              value={customDatabase}
              onChange={(e) => setCustomDatabase(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="PostgreSQL + Redis">PostgreSQL + Redis</option>
              <option value="PostgreSQL (Supabase/Neon)">PostgreSQL (Supabase/Neon)</option>
              <option value="MongoDB + Redis">MongoDB + Redis</option>
              <option value="MySQL 8.0">MySQL 8.0</option>
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="pt-4 border-t border-indigo-200/60 dark:border-indigo-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> ผลลัพธ์ Prompt ที่สร้างขึ้น:
            </span>
            <button
              onClick={handleCopyCustom}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors cursor-pointer"
            >
              {copiedCustom ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedCustom ? 'คัดลอกแล้ว!' : 'คัดลอกไปใช้'}
            </button>
          </div>
          <pre className="p-3.5 rounded-lg bg-slate-950 text-indigo-200 text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
            {generatedCustomPrompt}
          </pre>
        </div>
      </section>
    </article>
  );
};
