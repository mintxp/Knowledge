import React, { useState } from 'react';
import { Copy, Check, Workflow, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, GitBranch, Layers, Cpu, AlertTriangle, Activity, Zap, RefreshCw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { AutomataVisualizer } from '../widgets/AutomataVisualizer';

interface AutomataChapterProps {
  promptText: string;
}

export const AutomataChapter: React.FC<AutomataChapterProps> = ({ promptText }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          <span>วิทยาการคอมพิวเตอร์ & สถาปัตยกรรมระบบ</span>
          <span aria-hidden="true">·</span>
          <span>Computer Science & State Machines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          ทฤษฎีออโตมาตา (Automata Theory) และการออกแบบ State Machine ในงาน Software
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือประยุกต์ทฤษฎี Deterministic Finite Automata (DFA) และ Finite State Machine (FSM) เข้ากับงานวิศวกรรมซอฟต์แวร์จริง: 
          เจาะลึกการออกแบบกฎ Email Validator ด้วย State Transitions, การจัดการ State ของ Order Lifecycle แบบป้องกัน Illegal States, 
          Lexer Tokenizer สำหรับตัวเลข และ Circuit Breaker สำหรับ Microservices พร้อมแผนภาพรูปทรง Flowchart และห้องทดลองจำลองแบบ Interactive
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 14 นาที</span>
          <span aria-hidden="true">·</span>
          <span>พร้อม Interactive Shape Flow Sandbox</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={handleCopyPrompt}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedPrompt ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3" />}
            {copiedPrompt ? 'คัดลอก Master Prompt แล้ว' : 'คัดลอก Master Prompt'}
          </button>
        </div>
      </div>

      {/* Section 1: Intro */}
      <section id="overview" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-500" />
          1. บทนำ: ทำไมวิศวกรซอฟต์แวร์ต้องเข้าใจ Automata?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          นักพัฒนาซอฟต์แวร์จำนวนมากมองว่า <strong>Automata Theory (ทฤษฎีออโตมาตา)</strong> เป็นเพียงคณิตศาสตร์นามธรรมในตำรา 
          แต่ในความเป็นจริง กลไกสำคัญของโลกซอฟต์แวร์ที่เราใช้งานอยู่ทุกวินาทีล้วนสร้างขึ้นบนฐานของ Automata:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-500" /> Regular Expression (Regex Engine)
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              ทุกครั้งที่คุณใช้ Regex ตัว Engine (เช่น V8 ใน Chrome/Node.js) จะแปลงไวยากรณ์นั้นเป็น 
              <strong> NFA (Non-deterministic Finite Automaton)</strong> แล้วแปลงเป็น <strong>DFA</strong> เพื่อสแกนตัวอักษรในความเร็วเชิงเส้น O(N)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-emerald-500" /> Business State Machine (FSM)
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              วงจรชีวิตของระบบ (Order Lifecycle, Payment Gateway, TCP 3-way Handshake) 
              ต้องอาศัย <strong>Finite State Machine</strong> ขจัดข้อผิดพลาดตรรกะ เช่น สินค้าถูกยกเลิกแล้วแต่เผลอตัดบัตรเครดิตซ้ำ
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-500" /> Lexical Tokenizer & Parsers
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              คอมไพเลอร์และเอนจินของ <code className="font-mono text-xs">JSON.parse()</code> หรือ TypeScript Compiler 
              ใช้ DFA สแกนสตริงทีละตัวอักษรเพื่อแยกคำ (Keywords, Identifiers, Numbers, Operators) โดยไม่มีปัญหา Stack Overflow
            </p>
          </div>
        </div>

        {/* 5-Tuple Definition */}
        <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 my-6">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
            นิยาม 5 องค์ประกอบทางคณิตศาสตร์ของ Finite Automata: M = (Q, &Sigma;, &delta;, q0, F)
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Q (Set of States):</strong> เซตของสถานะทั้งหมดที่เป็นไปได้ในระบบ เช่น &#123; q0, q1, q2, q3, q4, q_trap &#125;</li>
            <li><strong>&Sigma; (Alphabet):</strong> เซตของชุดอักขระหรืออินพุตที่ยอมรับ เช่น [a-zA-Z0-9], '@', '.'</li>
            <li><strong>&delta; (Transition Function):</strong> ฟังก์ชันการเปลี่ยนสถานะ &delta;: Q &times; &Sigma; &rarr; Q (เมื่ออยู่ที่สถานะปัจจุบันแล้วรับอินพุต จะย้ายไปสถานะใด)</li>
            <li><strong>q0 (Start State):</strong> สถานะเริ่มต้นของระบบก่อนรับข้อมูล (q0 &isin; Q)</li>
            <li><strong>F (Accepting / Final States):</strong> เซตสถานะสุดท้ายที่ยอมรับว่าข้อมูลถูกต้องสมบูรณ์ (F &sube; Q)</li>
          </ul>
        </div>
      </section>

      {/* Section 2: Email Validator Automata with Shape Flow */}
      <section id="email-automata" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          2. การออกแบบ DFA สำหรับตรวจสอบ Email Validation (พร้อมรูปทรงประกอบ Flow)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
          การตรวจสอบอีเมลด้วย Regular Expression มักเกิดช่องโหว่ <strong>ReDoS (Regular Expression Denial of Service)</strong> 
          จากการทำ Catastrophic Backtracking เมื่อเจอสตริงยาวผิดปกติ การแปลงกฎ RFC 5322 เป็น <strong>Deterministic Finite Automaton (DFA)</strong> 
          ช่วยให้โปรแกรมตรวจสอบได้ในเวลา $O(N)$ และใช้หน่วยความจำ $O(1)$:
        </p>

        {/* Embedded Visual Shape Flow Diagram for Email DFA */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 shadow-xs">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              แผนภาพรูปทรง Flow การทำงานของ Email DFA (State Transition Diagram)
            </span>
            <span className="text-[11px] font-mono text-slate-500">RFC 5322 Simplified Architecture</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            สัญลักษณ์รูปทรง: วงกลมเดี่ยว = สถานะทั่วไป | วงกลมซ้อนสองชั้น = สถานะสิ้นสุดยอมรับ (Accepting State) | สี่เหลี่ยมมน = Trap State (Reject)
          </p>

          {/* SVG Shape Graphic */}
          <div className="overflow-x-auto py-4">
            <svg viewBox="0 0 860 210" className="w-full min-w-[780px] h-auto select-none font-sans">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                </marker>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* Start Arrow pointing to q0 */}
              <path d="M 20 80 L 60 80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="25" y="70" fontSize="11" fill="#64748b" fontFamily="monospace">Start</text>

              {/* Node q0: Initial State (Circle) */}
              <circle cx="95" cy="80" r="32" fill="#f8fafc" stroke="#6366f1" strokeWidth="2.5" />
              <text x="95" y="76" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1e293b">q0</text>
              <text x="95" y="94" fontSize="10" textAnchor="middle" fill="#64748b">Initial</text>
              <text x="95" y="130" fontSize="10" textAnchor="middle" fill="#475569">เริ่มต้น</text>

              {/* Transition q0 -> q1 on [a-zA-Z0-9] */}
              <path d="M 127 80 L 210 80" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow)" />
              <rect x="135" y="62" width="68" height="18" rx="4" fill="#e0e7ff" />
              <text x="169" y="75" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill="#4338ca">[a-z0-9]</text>

              {/* Node q1: Local Part (Circle) */}
              <circle cx="245" cy="80" r="32" fill="#f8fafc" stroke="#6366f1" strokeWidth="2.5" />
              <text x="245" y="76" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1e293b">q1</text>
              <text x="245" y="94" fontSize="10" textAnchor="middle" fill="#64748b">Local</text>
              <text x="245" y="130" fontSize="10" textAnchor="middle" fill="#475569">ชื่อผู้ใช้</text>

              {/* Self Loop on q1: [a-z0-9_.-] */}
              <path d="M 230 49 C 220 15, 270 15, 260 49" fill="none" stroke="#6366f1" strokeWidth="1.8" markerEnd="url(#arrow)" />
              <text x="245" y="12" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fill="#4338ca">[a-z0-9._-]</text>

              {/* Transition q1 -> q2 on '@' */}
              <path d="M 277 80 L 360 80" stroke="#6366f1" strokeWidth="2.2" markerEnd="url(#arrow)" />
              <rect x="295" y="60" width="46" height="20" rx="5" fill="#4f46e5" />
              <text x="318" y="75" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff">@</text>

              {/* Node q2: Domain Name (Circle) */}
              <circle cx="395" cy="80" r="32" fill="#f8fafc" stroke="#6366f1" strokeWidth="2.5" />
              <text x="395" y="76" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1e293b">q2</text>
              <text x="395" y="94" fontSize="10" textAnchor="middle" fill="#64748b">Domain</text>
              <text x="395" y="130" fontSize="10" textAnchor="middle" fill="#475569">ชื่อโดเมน</text>

              {/* Self Loop on q2: [a-z0-9-] */}
              <path d="M 380 49 C 370 15, 420 15, 410 49" fill="none" stroke="#6366f1" strokeWidth="1.8" markerEnd="url(#arrow)" />
              <text x="395" y="12" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fill="#4338ca">[a-z0-9-]</text>

              {/* Transition q2 -> q3 on '.' */}
              <path d="M 427 80 L 510 80" stroke="#6366f1" strokeWidth="2.2" markerEnd="url(#arrow)" />
              <rect x="445" y="60" width="46" height="20" rx="5" fill="#4f46e5" />
              <text x="468" y="75" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#ffffff">.</text>

              {/* Node q3: Dot / Waiting TLD (Circle) */}
              <circle cx="545" cy="80" r="32" fill="#f8fafc" stroke="#d97706" strokeWidth="2.5" />
              <text x="545" y="76" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#b45309">q3</text>
              <text x="545" y="94" fontSize="10" textAnchor="middle" fill="#64748b">Dot</text>
              <text x="545" y="130" fontSize="10" textAnchor="middle" fill="#475569">คั่น TLD</text>

              {/* Transition q3 -> q4 on [a-z] */}
              <path d="M 577 80 L 660 80" stroke="#10b981" strokeWidth="2.2" markerEnd="url(#arrow-green)" />
              <rect x="590" y="62" width="56" height="18" rx="4" fill="#d1fae5" />
              <text x="618" y="75" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill="#047857">[a-z]</text>

              {/* Node q4: Accepting State (Double Circle!) */}
              <circle cx="700" cy="80" r="36" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="700" cy="80" r="29" fill="none" stroke="#10b981" strokeWidth="2" />
              <text x="700" y="76" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#065f46">q4</text>
              <text x="700" y="93" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#10b981">ACCEPT</text>
              <text x="700" y="130" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#047857">Valid Email</text>

              {/* Self Loop on q4: [a-z] */}
              <path d="M 685 45 C 675 10, 725 10, 715 45" fill="none" stroke="#10b981" strokeWidth="1.8" markerEnd="url(#arrow-green)" />
              <text x="700" y="8" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fill="#047857">[a-z]</text>

              {/* Back transition for Sub-TLD: q4 -> q3 on '.' (e.g. .co.th) */}
              <path d="M 680 115 C 640 160, 580 160, 550 115" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#arrow)" />
              <rect x="595" y="150" width="40" height="18" rx="4" fill="#e0e7ff" />
              <text x="615" y="163" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill="#4338ca">'.' (Sub-TLD)</text>

              {/* Trap State (Rounded Rectangle at bottom) */}
              <rect x="360" y="165" width="80" height="38" rx="10" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2" />
              <text x="400" y="184" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#be123c">q_trap</text>
              <text x="400" y="196" fontSize="9" textAnchor="middle" fill="#e11d48">Error / Reject</text>

              {/* Arrows to trap state */}
              <path d="M 95 115 L 360 175" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-red)" />
              <path d="M 245 115 L 370 165" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-red)" />
              <path d="M 545 115 L 435 170" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-red)" />
              <text x="210" y="160" fontSize="9" fill="#e11d48">Invalid char / Syntax error</text>
            </svg>
          </div>
        </div>

        {/* Transition Table */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
          ตารางฟังก์ชันการเปลี่ยนสถานะ (State Transition Table: &delta;)
        </h3>

        <div className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse font-sans">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <th className="p-3 font-semibold">สถานะปัจจุบัน (State)</th>
                <th className="p-3 font-semibold">รับ [a-zA-Z0-9]</th>
                <th className="p-3 font-semibold">รับ '@'</th>
                <th className="p-3 font-semibold">รับ '.'</th>
                <th className="p-3 font-semibold">รับ อักขระอื่นๆ / สเปซ</th>
                <th className="p-3 font-semibold">สถานะสิ้นสุด?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              <tr>
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">q0 (Start)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">q1</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-slate-400 font-sans">ไม่ใช่</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">q1 (Local Part)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">q1 (Loop)</td>
                <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">q2</td>
                <td className="p-3 text-indigo-600 dark:text-indigo-400">q1 (ถ้าไม่ติดกัน)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-slate-400 font-sans">ไม่ใช่</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">q2 (Domain Name)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">q2 (Loop)</td>
                <td className="p-3 text-rose-500">q_trap (@ ซ้ำ)</td>
                <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">q3</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-slate-400 font-sans">ไม่ใช่</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">q3 (Dot Separator)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">q4 (TLD)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap (.. ซ้ำ)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-slate-400 font-sans">ไม่ใช่</td>
              </tr>
              <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">q4 (TLD Valid)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">q4 (Loop)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">q3 (Sub-TLD)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold font-sans">✓ ใช่ (ACCEPT)</td>
              </tr>
              <tr className="bg-rose-50/40 dark:bg-rose-950/20">
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">q_trap (Dead State)</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-500">q_trap</td>
                <td className="p-3 text-rose-600 dark:text-rose-400 font-bold font-sans">✗ ไม่ใช่ (REJECT)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TypeScript Implementation of DFA Email Validator */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          ตัวอย่างโค้ด Implementation: DFA Parser ในภาษา TypeScript (ความเร็ว O(N))
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          การนำ Transition Table มาเขียนโค้ดแบบ pure functions ไร้ Regex Backtracking ปลอดภัยจาก ReDoS 100%:
        </p>

        <CodeBlock
          filename="src/validators/emailDfaValidator.ts"
          language="typescript"
          code={`export type EmailState = 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'q_trap';

export interface DfaResult {
  isValid: boolean;
  finalState: EmailState;
  reason?: string;
}

/**
 * ฟังก์ชันตรวจสอบความถูกต้องของอีเมลด้วยหลักการ Deterministic Finite Automata (DFA)
 * Time Complexity: O(N) | Space Complexity: O(1)
 */
export function validateEmailWithDFA(email: string): DfaResult {
  if (!email || email.length > 254) {
    return { isValid: false, finalState: 'q_trap', reason: 'ความยาวเกินขีดจำกัด RFC 5321 (254 อักขระ)' };
  }

  let state: EmailState = 'q0';

  for (let i = 0; i < email.length; i++) {
    const char = email[i];

    switch (state) {
      case 'q0': // Initial State: รับเฉพาะตัวอักษรหรือตัวเลขของ Local Part
        if (/^[a-zA-Z0-9_+-]$/.test(char) && char !== '.') {
          state = 'q1';
        } else {
          return { isValid: false, finalState: 'q_trap', reason: \`อักขระเริ่มต้น '\${char}' ผิดกฎ\` };
        }
        break;

      case 'q1': // Local Part
        if (char === '@') {
          state = 'q2'; // เข้าสู่ Domain Part
        } else if (/^[a-zA-Z0-9._+-]$/.test(char)) {
          // ป้องกันจุดสองจุดติดกัน '..' ตามกฎ RFC 5322
          if (char === '.' && email[i - 1] === '.') {
            return { isValid: false, finalState: 'q_trap', reason: 'ห้ามมีจุดซ้อนกันใน Local Part' };
          }
          state = 'q1'; // วนรอบตัวเอง
        } else {
          return { isValid: false, finalState: 'q_trap', reason: \`อักขระต้องห้าม '\${char}' ใน Local Part\` };
        }
        break;

      case 'q2': // Domain Name
        if (char === '.') {
          state = 'q3'; // พบจุดคั่น TLD
        } else if (/^[a-zA-Z0-9-]$/.test(char)) {
          state = 'q2'; // วนรอบตัวเอง
        } else {
          return { isValid: false, finalState: 'q_trap', reason: \`อักขระผิดกฎ '\${char}' ใน Domain Name\` };
        }
        break;

      case 'q3': // รออ่าน TLD
      case 'q4': // อยู่ในสถานะยอมรับ (Accepting State)
        if (char === '.') {
          state = 'q3'; // รองรับ Sub-TLD เช่น .co.th, .in.th
        } else if (/^[a-zA-Z]$/.test(char)) {
          state = 'q4'; // อักขระ TLD ถูกต้อง
        } else {
          return { isValid: false, finalState: 'q_trap', reason: \`TLD ต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น\` };
        }
        break;

      case 'q_trap':
      default:
        return { isValid: false, finalState: 'q_trap', reason: 'ไวยากรณ์ผิดหลักออโตมาตา' };
    }
  }

  // ข้อมูลจะผ่านก็ต่อเมื่อหยุดอยู่ที่ Accepting State (q4) เท่านั้น
  return {
    isValid: state === 'q4',
    finalState: state,
    reason: state === 'q4' ? undefined : 'อีเมลไม่สมบูรณ์ (ไม่พบ TLD ที่ถูกต้อง)'
  };
}`}
        />
      </section>

      {/* Section 3: E-Commerce State Machine with Shapes */}
      <section id="order-lifecycle" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-500" />
          3. การออกแบบ Finite State Machine (FSM) ในระบบ E-Commerce (Order Lifecycle)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          ข้อผิดพลาดร้ายแรงที่สุดในระบบ Backend คือการใช้ <strong>Boolean Flags สะเปะสะปะ</strong> เพื่อควบคุมสถานะของคำสั่งซื้อ:
        </p>

        <div className="p-3 my-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-700 dark:text-rose-400">
          // ❌ สิ่งที่มักทำผิด: ใช้ boolean flags หลายตัว<br/>
          const order = &#123; isPaid: true, isShipped: true, isCancelled: true, isRefunded: false &#125;;<br/>
          // เกิด Impossible State: สินค้าส่งไปแล้ว แต่ถูกยกเลิกด้วย?! บอทคลังสินค้าจะส่งของหรือไม่?
        </div>

        {/* Embedded Visual Shape Flow for Order FSM */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 shadow-xs">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              แผนภาพรูปทรง Flow วงจรชีวิตคำสั่งซื้อ (Order Lifecycle State Flowchart)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Guarded Transitions Architecture</span>
          </div>

          <div className="overflow-x-auto py-3">
            <svg viewBox="0 0 880 260" className="w-full min-w-[800px] h-auto select-none font-sans">
              <defs>
                <marker id="fsm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                </marker>
                <marker id="fsm-cancel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                </marker>
                <marker id="fsm-refund" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
                </marker>
              </defs>

              {/* Main Line: PENDING_PAYMENT */}
              <rect x="20" y="50" width="130" height="55" rx="10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <text x="85" y="74" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#312e81">PENDING_PAYMENT</text>
              <text x="85" y="92" fontSize="10" textAnchor="middle" fill="#4338ca">รอการชำระเงิน</text>

              {/* Arrow PAY */}
              <path d="M 150 77 L 210 77" stroke="#6366f1" strokeWidth="2" markerEnd="url(#fsm-arrow)" />
              <rect x="155" y="58" width="50" height="17" rx="3" fill="#ecfdf5" />
              <text x="180" y="70" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#065f46">PAY ➔</text>

              {/* State 2: PAID */}
              <rect x="210" y="50" width="110" height="55" rx="10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <text x="265" y="74" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#312e81">PAID</text>
              <text x="265" y="92" fontSize="10" textAnchor="middle" fill="#4338ca">ชำระเงินสำเร็จ</text>

              {/* Arrow PACK */}
              <path d="M 320 77 L 380 77" stroke="#6366f1" strokeWidth="2" markerEnd="url(#fsm-arrow)" />
              <rect x="325" y="58" width="50" height="17" rx="3" fill="#e0e7ff" />
              <text x="350" y="70" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#4338ca">PACK ➔</text>

              {/* State 3: PROCESSING */}
              <rect x="380" y="50" width="125" height="55" rx="10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <text x="442" y="74" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#312e81">PROCESSING</text>
              <text x="442" y="92" fontSize="10" textAnchor="middle" fill="#4338ca">กำลังจัดเตรียมสินค้า</text>

              {/* Arrow SHIP */}
              <path d="M 505 77 L 565 77" stroke="#6366f1" strokeWidth="2" markerEnd="url(#fsm-arrow)" />
              <rect x="510" y="58" width="50" height="17" rx="3" fill="#e0e7ff" />
              <text x="535" y="70" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#4338ca">SHIP ➔</text>

              {/* State 4: SHIPPED */}
              <rect x="565" y="50" width="115" height="55" rx="10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <text x="622" y="74" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#312e81">SHIPPED</text>
              <text x="622" y="92" fontSize="10" textAnchor="middle" fill="#4338ca">จัดส่งเรียบร้อย</text>

              {/* Arrow DELIVER */}
              <path d="M 680 77 L 740 77" stroke="#10b981" strokeWidth="2.2" markerEnd="url(#fsm-arrow)" />
              <rect x="685" y="58" width="52" height="17" rx="3" fill="#d1fae5" />
              <text x="711" y="70" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#047857">DELIVER ➔</text>

              {/* State 5: DELIVERED (Accepting Terminal) */}
              <rect x="740" y="46" width="125" height="63" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" />
              <text x="802" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#065f46">DELIVERED</text>
              <text x="802" y="88" fontSize="9.5" textAnchor="middle" fill="#047857">ส่งมอบสมบูรณ์</text>
              <text x="802" y="102" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#10b981">✓ SUCCESS TERMINAL</text>

              {/* Branch 1: Cancel from PENDING_PAYMENT */}
              <path d="M 85 105 L 85 190 L 210 190" stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#fsm-cancel)" />
              <rect x="90" y="145" width="80" height="16" rx="3" fill="#fee2e2" />
              <text x="130" y="156" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#b91c1c">CANCEL (ลูกค้ากดยกเลิก)</text>

              {/* Terminal State: CANCELLED */}
              <rect x="210" y="165" width="130" height="50" rx="10" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
              <text x="275" y="186" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#991b1b">CANCELLED</text>
              <text x="275" y="202" fontSize="9" textAnchor="middle" fill="#ef4444">สถานะสิ้นสุด (Terminal)</text>

              {/* Branch 2: Refund from PAID or PROCESSING */}
              <path d="M 265 105 L 265 135 L 442 135 L 442 165" stroke="#a855f7" strokeWidth="1.8" />
              <path d="M 442 105 L 442 165" stroke="#a855f7" strokeWidth="1.8" markerEnd="url(#fsm-refund)" />
              <rect x="300" y="126" width="115" height="16" rx="3" fill="#f3e8ff" />
              <text x="357" y="138" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#7e22ce">REFUND (ยกเลิก & คืนเงิน)</text>

              {/* Terminal State: REFUNDED */}
              <rect x="380" y="165" width="130" height="50" rx="10" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" />
              <text x="445" y="186" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#6b21a8">REFUNDED</text>
              <text x="445" y="202" fontSize="9" textAnchor="middle" fill="#a855f7">สถานะสิ้นสุด (Terminal)</text>

              {/* Refund from DELIVERED (After return) */}
              <path d="M 802 109 L 802 235 L 445 235 L 445 215" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#fsm-refund)" />
              <text x="630" y="247" fontSize="9" fill="#7e22ce" textAnchor="middle">RETURN_ITEM (ส่งคืนสินค้า ➔ อนุมัติคืนเงิน)</text>
            </svg>
          </div>
        </div>

        <CodeBlock
          filename="src/models/orderStateMachine.ts"
          language="typescript"
          code={`export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// Transition Map กำหนดเส้นทางเปลี่ยนผ่านที่ถูกกฎหมาย (Legal Transitions)
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'REFUNDED'],
  SHIPPED: ['DELIVERED'],          // เมื่อส่งของแล้ว ห้าม Cancel หรือ Refund ลอยๆ
  DELIVERED: ['REFUNDED'],        // ลูกค้าต้องส่งคืนสินค้าก่อน จึงจะเข้าสู่กระบวนการ Refund
  CANCELLED: [],                  // Terminal State
  REFUNDED: []                    // Terminal State
};

export class OrderStateMachine {
  constructor(public currentStatus: OrderStatus = 'PENDING_PAYMENT') {}

  public canTransitionTo(nextStatus: OrderStatus): boolean {
    const allowed = ORDER_TRANSITIONS[this.currentStatus];
    return allowed.includes(nextStatus);
  }

  public transition(nextStatus: OrderStatus, reason?: string): void {
    if (!this.canTransitionTo(nextStatus)) {
      throw new Error(
        \`[Illegal State Transition] ปฏิเสธการเปลี่ยนสถานะจาก \${this.currentStatus} ➔ \${nextStatus} (เหตุผล: \${reason || 'ไม่มีสิทธิ์'})\`
      );
    }
    this.currentStatus = nextStatus;
  }
}`}
        />
      </section>

      {/* Section 4: Compiler Lexer DFA */}
      <section id="compiler-lexer" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          4. การประยุกต์ใช้ Automata ใน Lexer / Tokenizer (Number & Floating-Point Parsing)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
          เบื้องหลังของฟังก์ชัน <code className="font-mono text-xs">JSON.parse()</code> หรือคอมไพเลอร์ของภาษาโปรแกรม 
          ใช้ DFA ในการแปลงสายอักขระให้เป็น Token ของตัวเลขทศนิยมและวิทยาศาสตร์ เช่น <code className="font-mono text-xs">+12.40</code>, 
          <code className="font-mono text-xs">-0.05</code>, หรือ <code className="font-mono text-xs">1.5e-3</code>:
        </p>

        {/* Number Lexer Shape Flowchart */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 my-4 overflow-x-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Floating-Point & Scientific Number Tokenizer Shape Pipeline:
          </div>
          <div className="flex items-center gap-2 min-w-[720px] text-xs font-mono py-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">s0: Start</span>
            <span className="text-slate-500">--( +/- )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">s1: Sign</span>
            <span className="text-slate-500">--( 0-9 )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">s2: Integer ◎</span>
            <span className="text-slate-500">--( . )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500 text-amber-300">s3: Dot</span>
            <span className="text-slate-500">--( 0-9 )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">s4: Float ◎</span>
            <span className="text-slate-500">--( e/E )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-500 text-indigo-300">s5: Exp</span>
            <span className="text-slate-500">--( 0-9 )--&gt;</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">s7: Sci ◎</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            * สัญลักษณ์ ◎ หมายถึง Accepting States: จบสายสตริงที่ s2, s4, หรือ s7 ถือว่าเป็นตัวเลขที่ถูกต้องตามไวยากรณ์
          </div>
        </div>
      </section>

      {/* Section 5: Interactive Visualizer Widget */}
      <section className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" />
          ห้องทดลองจำลองสถานะแบบโต้ตอบ (Automata & State Machine Interactive Flow Sandbox)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          ทดลองป้อนข้อความและสังเกตการเปลี่ยนสถานะของ Email DFA, Number Lexer, Order FSM และ Password Policy แบบ Real-time:
        </p>

        <AutomataVisualizer />
      </section>

      {/* Section 6: Circuit Breaker State Machine */}
      <section id="circuit-breaker-fsm" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          5. State Machine ใน Microservices: ตัวอย่าง Circuit Breaker Pattern
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
          ในสถาปัตยกรรม Microservices เมื่อ Service ปลายทางล่ม การยิง Request ซ้ำๆ จะทำให้เกิด Cascading Failure 
          วิศวกรจึงใช้ <strong>Circuit Breaker State Machine</strong> (CLOSED &rarr; OPEN &rarr; HALF-OPEN) เพื่อป้องกันระบบล่มทั้งระบบ:
        </p>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4 overflow-x-auto">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            แผนผัง Circuit Breaker 3-State Lifecycle:
          </div>
          <div className="flex items-center justify-around gap-4 min-w-[620px] py-3">
            {/* CLOSED */}
            <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-center w-40">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">CLOSED</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">ทำงานปกติ ยิง Request ได้</div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-rose-500">Error &gt; Threshold ➔</span>
              <div className="w-20 h-0.5 bg-rose-400" />
              <span className="text-[9px] font-mono text-emerald-600 mt-1">✓ Success Loop</span>
            </div>

            {/* OPEN */}
            <div className="p-3 rounded-xl border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-center w-40">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300">OPEN</div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">ตัดวงจร ปฏิเสธ Request ทันที</div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-amber-500">Cool-down Timer ➔</span>
              <div className="w-20 h-0.5 bg-amber-400" />
            </div>

            {/* HALF-OPEN */}
            <div className="p-3 rounded-xl border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-center w-40">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300">HALF-OPEN</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">ทดลองปล่อย Request เล็กน้อย</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Best practices */}
      <section id="production-rules" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          6. กฎเหล็กและข้อพึงปฏิบัติในการใช้ State Machine บน Production
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> สิ่งที่ต้องทำ (Do)
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>• ใช้ <strong>Optimistic Locking (version column)</strong> หรือ Redis Redlock เพื่อป้องกัน Race Condition เมื่อมี 2 คำขอเปลี่ยน State ในระดับมิลลิวินาทีเดียวกัน</li>
              <li>• บันทึก <strong>Audit Trail ทุกการเปลี่ยน State</strong> (ใครเปลี่ยน, timestamp, oldState, newState, reason)</li>
              <li>• กำหนดสถานะสิ้นสุด (Terminal States) ให้ชัดเจน เช่น CANCELLED, REFUNDED และบล็อกการ transition ออกจาก terminal state 100%</li>
              <li>• เขียน Unit Test แบบ <strong>Exhaustive Transition Matrix</strong> ครอบคลุมทั้งกรณีที่ได้รับอนุญาตและ assert throw error กรณีที่ผิดกฎ</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> ข้อห้ามสำคัญ (Don't)
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>• ห้ามอัปเดต State ตรงๆ ในฐานข้อมูลโดยไม่ผ่าน Guard Function ของ State Machine</li>
              <li>• ห้ามใช้ Boolean Flags ผสมกับ State Enum เพราะจะนำไปสู่ Impossible States เช่น isPaid=true แต่ status=CANCELLED</li>
              <li>• ห้ามใช้ Regular Expression ที่ซ้อนกันโดยไม่จำกัดความยาว เพื่อป้องกันช่องโหว่ ReDoS ที่ทำให้ CPU 100%</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 8: Prompt Box */}
      <section id="original-prompt" className="scroll-mt-24 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Prompt ต้นฉบับสำหรับสั่ง AI สร้างแบบจำลอง Automata & State Machine
            </h3>
          </div>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5" /> คัดลอกแล้ว
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> คัดลอก Prompt
              </>
            )}
          </button>
        </div>
        <pre className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
          {promptText}
        </pre>
      </section>
    </article>
  );
};
