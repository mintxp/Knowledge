import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, ArrowRight, Sparkles, AlertTriangle, ShieldCheck, Cpu, ShoppingBag, Lock, HelpCircle } from 'lucide-react';

export const AutomataVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'number' | 'order' | 'password'>('email');

  // ==========================================
  // TAB 1: EMAIL VALIDATOR DFA
  // ==========================================
  const [emailInput, setEmailInput] = useState<string>('developer@enterprise.th');
  const [emailStepIndex, setEmailStepIndex] = useState<number>(0);
  const [isEmailPlaying, setIsEmailPlaying] = useState<boolean>(false);

  interface EmailStep {
    char: string;
    fromState: string;
    toState: string;
    description: string;
  }

  const computeEmailSteps = (input: string) => {
    const steps: EmailStep[] = [];
    let state = 'q0';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const from = state;
      let to = 'q_trap';
      let desc = '';

      if (state === 'q0') {
        if (/^[a-zA-Z0-9_+-]$/.test(char) && char !== '.') {
          to = 'q1';
          desc = `อักขระแรก '${char}' ถูกต้องสำหรับ Local Part -> ไป q1`;
        } else {
          to = 'q_trap';
          desc = `อักขระ '${char}' ไม่สามารถขึ้นต้นอีเมลได้ -> ตกสู่ q_trap`;
        }
      } else if (state === 'q1') {
        if (char === '@') {
          to = 'q2';
          desc = `พบสัญลักษณ์ '@' ตัวคั่นระหว่างชื่อและโดเมน -> ย้ายไป q2`;
        } else if (/^[a-zA-Z0-9._+-]$/.test(char)) {
          // Check consecutive dots if previous was dot
          if (char === '.' && input[i - 1] === '.') {
            to = 'q_trap';
            desc = `พบจุดติดกัน '..' ใน Local Part ผิดกฎ RFC 5322 -> ตกสู่ q_trap`;
          } else {
            to = 'q1';
            desc = `อ่านอักขระ '${char}' ใน Local Part -> วนซ้ำในสถานะ q1`;
          }
        } else {
          to = 'q_trap';
          desc = `พบอักขระไม่อนุญาต '${char}' ใน Local Part -> ตกสู่ q_trap`;
        }
      } else if (state === 'q2') {
        if (char === '.') {
          to = 'q3';
          desc = `พบจุด '.' คั่นระหว่าง Domain และ Top-Level Domain -> ไป q3`;
        } else if (/^[a-zA-Z0-9-]$/.test(char)) {
          to = 'q2';
          desc = `อ่านอักขระ Domain '${char}' -> วนซ้ำในสถานะ q2`;
        } else {
          to = 'q_trap';
          desc = `พบอักขระผิดกฎ '${char}' ในชื่อโดเมน -> ตกสู่ q_trap`;
        }
      } else if (state === 'q3' || state === 'q4') {
        if (char === '.') {
          to = 'q3';
          desc = `พบจุด '.' สำหรับ Sub-TLD (เช่น .co.th) -> ย้อนกลับมารออ่าน TLD ถัดไปที่ q3`;
        } else if (/^[a-zA-Z]$/.test(char)) {
          to = 'q4';
          desc = `อ่านอักขระ TLD '${char}' -> เข้าสู่สถานะยอมรับ q4 (Accepting State)`;
        } else {
          to = 'q_trap';
          desc = `TLD ต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น -> ตกสู่ q_trap`;
        }
      } else {
        to = 'q_trap';
        desc = `ระบบค้างอยู่ใน q_trap แล้ว -> ไม่สามารถฟื้นตัวได้`;
      }

      steps.push({
        char,
        fromState: from,
        toState: to,
        description: desc
      });
      state = to;
    }

    return {
      steps,
      finalState: state,
      isAccepted: state === 'q4'
    };
  };

  const emailResult = computeEmailSteps(emailInput);
  const currentEmailStep = emailResult.steps[emailStepIndex - 1];
  const currentEmailState = emailStepIndex === 0 ? 'q0' : currentEmailStep?.toState || 'q0';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isEmailPlaying) {
      if (emailStepIndex < emailResult.steps.length) {
        timer = setTimeout(() => {
          setEmailStepIndex((prev) => prev + 1);
        }, 550);
      } else {
        setIsEmailPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isEmailPlaying, emailStepIndex, emailResult.steps.length]);

  // ==========================================
  // TAB 2: NUMBER LEXER DFA
  // ==========================================
  const [numberInput, setNumberInput] = useState<string>('+3.1415e-2');
  const [numStepIndex, setNumStepIndex] = useState<number>(0);
  const [isNumPlaying, setIsNumPlaying] = useState<boolean>(false);

  interface NumStep {
    char: string;
    fromState: string;
    toState: string;
    description: string;
  }

  const computeNumSteps = (input: string) => {
    const steps: NumStep[] = [];
    let state = 's0'; // s0: start, s1: sign, s2: integer, s3: dot, s4: fraction, s5: exp, s6: exp_sign, s7: exp_digits, s_trap: error

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const from = state;
      let to = 's_trap';
      let desc = '';

      if (state === 's0') {
        if (char === '+' || char === '-') {
          to = 's1';
          desc = `พบเครื่องหมายนำหน้า '${char}' -> ไปสถานะ Sign (s1)`;
        } else if (/^[0-9]$/.test(char)) {
          to = 's2';
          desc = `พบตัวเลขจำนวนเต็มแรก '${char}' -> ไปสถานะ Integer (s2 - Accept)`;
        } else if (char === '.') {
          to = 's3';
          desc = `พบจุดทศนิยมเริ่มต้น '.' -> ไปสถานะ Dot (s3)`;
        } else {
          to = 's_trap';
          desc = `อักขระ '${char}' ไม่ใช่รูปแบบตัวเลขที่ถูกต้อง -> ตกสู่ s_trap`;
        }
      } else if (state === 's1') {
        if (/^[0-9]$/.test(char)) {
          to = 's2';
          desc = `อ่านตัวเลขหลังเครื่องหมาย '${char}' -> ไป Integer (s2 - Accept)`;
        } else if (char === '.') {
          to = 's3';
          desc = `พบจุดทศนิยมหลังเครื่องหมาย '.' -> ไป Dot (s3)`;
        } else {
          to = 's_trap';
          desc = `หลังเครื่องหมายต้องตามด้วยตัวเลขหรือจุด -> ตกสู่ s_trap`;
        }
      } else if (state === 's2') {
        if (/^[0-9]$/.test(char)) {
          to = 's2';
          desc = `อ่านตัวเลขจำนวนเต็มต่อ '${char}' -> วนซ้ำใน s2 (Accept)`;
        } else if (char === '.') {
          to = 's3';
          desc = `พบจุดทศนิยม '.' -> เปลี่ยนไปสถานะ Dot (s3)`;
        } else if (char === 'e' || char === 'E') {
          to = 's5';
          desc = `พบสัญลักษณ์ Exponent '${char}' -> ไป Exponent (s5)`;
        } else {
          to = 's_trap';
          desc = `อักขระผิดกฎ '${char}' ในจำนวนเต็ม -> ตกสู่ s_trap`;
        }
      } else if (state === 's3') {
        if (/^[0-9]$/.test(char)) {
          to = 's4';
          desc = `พบตัวเลขทศนิยมแรก '${char}' -> ไป Fraction (s4 - Accept)`;
        } else {
          to = 's_trap';
          desc = `หลังจุดทศนิยมต้องมีตัวเลขอย่างน้อยหนึ่งตัว -> ตกสู่ s_trap`;
        }
      } else if (state === 's4') {
        if (/^[0-9]$/.test(char)) {
          to = 's4';
          desc = `อ่านตัวเลขทศนิยมต่อ '${char}' -> วนซ้ำใน s4 (Accept)`;
        } else if (char === 'e' || char === 'E') {
          to = 's5';
          desc = `พบสัญลักษณ์ Exponent '${char}' -> ไป Exponent (s5)`;
        } else {
          to = 's_trap';
          desc = `อักขระผิดกฎ '${char}' ในตำแหน่งทศนิยม -> ตกสู่ s_trap`;
        }
      } else if (state === 's5') {
        if (char === '+' || char === '-') {
          to = 's6';
          desc = `พบเครื่องหมายหลัง Exponent '${char}' -> ไป Exp-Sign (s6)`;
        } else if (/^[0-9]$/.test(char)) {
          to = 's7';
          desc = `พบตัวเลขยกกำลังแรก '${char}' -> ไป Exp-Digits (s7 - Accept)`;
        } else {
          to = 's_trap';
          desc = `หลัง Exponent ต้องเป็นเครื่องหมายหรือตัวเลข -> ตกสู่ s_trap`;
        }
      } else if (state === 's6') {
        if (/^[0-9]$/.test(char)) {
          to = 's7';
          desc = `พบตัวเลขหลังเครื่องหมายยกกำลัง '${char}' -> ไป Exp-Digits (s7 - Accept)`;
        } else {
          to = 's_trap';
          desc = `หลังเครื่องหมายยกกำลังต้องเป็นตัวเลข -> ตกสู่ s_trap`;
        }
      } else if (state === 's7') {
        if (/^[0-9]$/.test(char)) {
          to = 's7';
          desc = `อ่านตัวเลขยกกำลังต่อ '${char}' -> วนซ้ำใน s7 (Accept)`;
        } else {
          to = 's_trap';
          desc = `อักขระผิดกฎ '${char}' ในส่วนยกกำลัง -> ตกสู่ s_trap`;
        }
      } else {
        to = 's_trap';
        desc = `ระบบอยู่ในสถานะ Trap -> ข้อมูลไม่ผ่าน`;
      }

      steps.push({
        char,
        fromState: from,
        toState: to,
        description: desc
      });
      state = to;
    }

    const isAccepted = state === 's2' || state === 's4' || state === 's7';
    return {
      steps,
      finalState: state,
      isAccepted
    };
  };

  const numResult = computeNumSteps(numberInput);
  const currentNumStep = numResult.steps[numStepIndex - 1];
  const currentNumState = numStepIndex === 0 ? 's0' : currentNumStep?.toState || 's0';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isNumPlaying) {
      if (numStepIndex < numResult.steps.length) {
        timer = setTimeout(() => {
          setNumStepIndex((prev) => prev + 1);
        }, 550);
      } else {
        setIsNumPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isNumPlaying, numStepIndex, numResult.steps.length]);

  // ==========================================
  // TAB 3: ORDER LIFECYCLE FSM
  // ==========================================
  type OrderState = 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  const [orderState, setOrderState] = useState<OrderState>('PENDING_PAYMENT');
  const [orderLogs, setOrderLogs] = useState<string[]>([
    'ระบบเริ่มต้น: สร้าง Order #TH-8820 ในสถานะ PENDING_PAYMENT'
  ]);

  const validTransitions: Record<OrderState, OrderState[]> = {
    PENDING_PAYMENT: ['PAID', 'CANCELLED'],
    PAID: ['PROCESSING', 'REFUNDED'],
    PROCESSING: ['SHIPPED', 'REFUNDED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: ['REFUNDED'],
    CANCELLED: [],
    REFUNDED: []
  };

  const transitionOrder = (action: string, targetState: OrderState) => {
    if (validTransitions[orderState].includes(targetState)) {
      setOrderState(targetState);
      setOrderLogs((prev) => [
        `[SUCCESS] Action "${action}" สำเร็จ: เปลี่ยนสถานะ ${orderState} ➔ ${targetState}`,
        ...prev
      ]);
    } else {
      setOrderLogs((prev) => [
        `[BLOCKED] ปฏิเสธการเปลี่ยนสถานะ: ไม่สามารถเปลี่ยนจาก ${orderState} ➔ ${targetState} ได้โดยตรง (Illegal State Transition)`,
        ...prev
      ]);
    }
  };

  // ==========================================
  // TAB 4: PASSWORD POLICY STATE MACHINE
  // ==========================================
  const [pwdInput, setPwdInput] = useState<string>('P@ssw0rd2026');
  const checkPwd = (str: string) => {
    const hasLen = str.length >= 8;
    const hasUpper = /[A-Z]/.test(str);
    const hasLower = /[a-z]/.test(str);
    const hasDigit = /[0-9]/.test(str);
    const hasSpecial = /[^A-Za-z0-9]/.test(str);
    const score = [hasLen, hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    return { hasLen, hasUpper, hasLower, hasDigit, hasSpecial, score, isAllPassed: score === 5 };
  };
  const pwdStatus = checkPwd(pwdInput);

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 shadow-xs">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              ห้องทดลองจำลอง Automata & State Machine Flow
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            จำลองการไหลของสถานะ (State Flow) พร้อมรูปทรงและเส้นทางการเปลี่ยนสถานะแบบโต้ตอบได้
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            1. Email Validator (DFA)
          </button>
          <button
            onClick={() => setActiveTab('number')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'number'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2. Number Lexer (DFA)
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'order'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3. Order Lifecycle (FSM)
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'password'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            4. Password Policy (FSM)
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: EMAIL VALIDATION DFA */}
      {/* ========================================================= */}
      {activeTab === 'email' && (
        <div className="mt-4 space-y-4">
          {/* Input & Controller Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                ข้อความทดสอบ:
              </span>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailStepIndex(0);
                  setIsEmailPlaying(false);
                }}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="กรอกอีเมลเพื่อทดสอบ เช่น dev@domain.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEmailStepIndex(0);
                  setIsEmailPlaying(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                title="รีเซ็ตสถานะ"
              >
                <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ต
              </button>
              <button
                onClick={() => {
                  if (emailStepIndex >= emailResult.steps.length) {
                    setEmailStepIndex(0);
                  }
                  setIsEmailPlaying(!isEmailPlaying);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {isEmailPlaying ? 'หยุดชั่วคราว' : 'รันอัตโนมัติ (Play)'}
              </button>
              <button
                onClick={() => {
                  if (emailStepIndex < emailResult.steps.length) {
                    setEmailStepIndex((prev) => prev + 1);
                  }
                }}
                disabled={emailStepIndex >= emailResult.steps.length}
                className="px-2.5 py-1.5 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                ก้าวทีละตัว ({emailStepIndex}/{emailResult.steps.length})
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 overflow-x-auto pb-1">
            <span className="font-medium text-slate-600 dark:text-slate-400">ตัวอย่างทดสอบด่วน:</span>
            <button
              onClick={() => { setEmailInput('user@company.com'); setEmailStepIndex(0); }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              user@company.com (ผ่าน)
            </button>
            <span>·</span>
            <button
              onClick={() => { setEmailInput('admin.infra@cloud.co.th'); setEmailStepIndex(0); }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              admin.infra@cloud.co.th (Sub-TLD ผ่าน)
            </button>
            <span>·</span>
            <button
              onClick={() => { setEmailInput('user..name@domain.com'); setEmailStepIndex(0); }}
              className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              user..name@domain.com (จุดซ้อน ตก Trap)
            </button>
            <span>·</span>
            <button
              onClick={() => { setEmailInput('hello@sub@domain.com'); setEmailStepIndex(0); }}
              className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              hello@sub@domain.com (@ ซ้ำ ตก Trap)
            </button>
          </div>

          {/* Graphical State Transition Flow Diagram (Shape Diagram) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>แผนภาพรูปทรงการเปลี่ยนสถานะ (DFA Visual Shape Flow):</span>
              <span className="text-[11px] font-mono text-slate-500">
                สถานะปัจจุบัน:{' '}
                <strong className={`px-2 py-0.5 rounded ${
                  currentEmailState === 'q4' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  currentEmailState === 'q_trap' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                  'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {currentEmailState === 'q4' ? 'q4 (Accepting State)' : currentEmailState === 'q_trap' ? 'q_trap (Dead State)' : currentEmailState}
                </strong>
              </span>
            </div>

            {/* SVG Visual Flow Diagram */}
            <div className="min-w-[680px] py-4 px-2 flex items-center justify-between gap-1 relative">
              {/* q0: Start */}
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                  currentEmailState === 'q0'
                    ? 'border-3 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 ring-4 ring-indigo-500/25 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  <span className="text-[9px] text-slate-400 absolute -top-4 font-normal">Start ➔</span>
                  q0
                  <span className="text-[9px] font-normal text-slate-500">Init</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 font-medium">เริ่มต้น</div>
              </div>

              {/* Arrow q0 -> q1 */}
              <div className="flex-1 flex flex-col items-center px-1">
                <span className="text-[10px] font-mono text-slate-500 mb-0.5 font-medium">[a-z0-9]</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* q1: Local part */}
              <div className="flex flex-col items-center relative">
                {/* Self-loop badge */}
                <div className="text-[9px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 mb-1">
                  ↺ [a-z0-9_.-]
                </div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                  currentEmailState === 'q1'
                    ? 'border-3 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 ring-4 ring-indigo-500/25 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  q1
                  <span className="text-[9px] font-normal text-slate-500">Local</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 font-medium">ชื่อผู้ใช้</div>
              </div>

              {/* Arrow q1 -> q2 */}
              <div className="flex-1 flex flex-col items-center px-1">
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-0.5">@</span>
                <div className="w-full h-0.5 bg-indigo-400 dark:bg-indigo-600 relative">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* q2: Domain Name */}
              <div className="flex flex-col items-center relative">
                {/* Self-loop badge */}
                <div className="text-[9px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 mb-1">
                  ↺ [a-z0-9-]
                </div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                  currentEmailState === 'q2'
                    ? 'border-3 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 ring-4 ring-indigo-500/25 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  q2
                  <span className="text-[9px] font-normal text-slate-500">Domain</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 font-medium">ชื่อโดเมน</div>
              </div>

              {/* Arrow q2 -> q3 */}
              <div className="flex-1 flex flex-col items-center px-1">
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-0.5">.</span>
                <div className="w-full h-0.5 bg-indigo-400 dark:bg-indigo-600 relative">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* q3: Dot separator */}
              <div className="flex flex-col items-center relative">
                <div className="text-[9px] font-mono text-transparent mb-1">placeholder</div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                  currentEmailState === 'q3'
                    ? 'border-3 border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-4 ring-amber-500/25 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  q3
                  <span className="text-[9px] font-normal text-slate-500">Dot</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 font-medium">คั่น TLD</div>
              </div>

              {/* Arrow q3 -> q4 */}
              <div className="flex-1 flex flex-col items-center px-1">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">[a-z]</span>
                <div className="w-full h-0.5 bg-emerald-400 dark:bg-emerald-600 relative">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 absolute right-0 -top-1.5" />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">q4 ➔ '.' ➔ q3</span>
              </div>

              {/* q4: Double circle Accepting State */}
              <div className="flex flex-col items-center relative">
                {/* Self loop for TLD chars */}
                <div className="text-[9px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 mb-1">
                  ↺ [a-z]
                </div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                  currentEmailState === 'q4'
                    ? 'border-4 border-double border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-4 ring-emerald-500/25 shadow-md scale-105'
                    : 'border-3 border-double border-emerald-400 dark:border-emerald-700 bg-slate-50 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400'
                }`}>
                  q4
                  <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">Accept</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">Valid Email</div>
              </div>

              {/* Trap State */}
              <div className="border-l border-slate-200 dark:border-slate-800 pl-3 ml-2 flex flex-col items-center">
                <div className="text-[9px] font-mono text-rose-500 mb-1">↺ All</div>
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentEmailState === 'q_trap'
                    ? 'border-3 border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 ring-4 ring-rose-500/25 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
                }`}>
                  <span className="text-[9px] text-rose-500">Trap</span>
                  q_trap
                </div>
                <div className="text-[10px] text-rose-500 mt-1.5 font-medium">ไวยากรณ์ผิด</div>
              </div>
            </div>
          </div>

          {/* Tape / Input Stream Inspector */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              เทปอินพุต (Input Tape Scanning):
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {emailInput.split('').map((ch, i) => {
                const isCurrent = i === emailStepIndex - 1;
                const isPassed = i < emailStepIndex - 1;
                return (
                  <div
                    key={i}
                    className={`w-7 h-8 shrink-0 flex items-center justify-center font-mono text-xs rounded border transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-700 font-bold scale-110 shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>

            {/* Current Step Description */}
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                {emailStepIndex === 0 ? (
                  <span className="text-slate-500">สถานะเริ่มต้นที่ q0 (กด 'ก้าวทีละตัว' หรือ 'รันอัตโนมัติ')</span>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200">
                    ขั้นตอนที่ {emailStepIndex}: {currentEmailStep?.description}
                  </span>
                )}
              </div>

              {emailStepIndex >= emailResult.steps.length && (
                <div>
                  {emailResult.isAccepted ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> อีเมลถูกต้องตามกฎ Automata (ACCEPTED)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <XCircle className="w-4 h-4" /> อีเมลผิดกฎไวยากรณ์ (REJECTED AT STATE: {emailResult.finalState})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: NUMBER LEXER DFA */}
      {/* ========================================================= */}
      {activeTab === 'number' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                ตัวเลขทดสอบ:
              </span>
              <input
                type="text"
                value={numberInput}
                onChange={(e) => {
                  setNumberInput(e.target.value);
                  setNumStepIndex(0);
                  setIsNumPlaying(false);
                }}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="กรอกตัวเลข เช่น +12.45, -0.05, 1.5e-3"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNumStepIndex(0);
                  setIsNumPlaying(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ต
              </button>
              <button
                onClick={() => {
                  if (numStepIndex >= numResult.steps.length) {
                    setNumStepIndex(0);
                  }
                  setIsNumPlaying(!isNumPlaying);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {isNumPlaying ? 'หยุดชั่วคราว' : 'รันอัตโนมัติ'}
              </button>
              <button
                onClick={() => {
                  if (numStepIndex < numResult.steps.length) {
                    setNumStepIndex((prev) => prev + 1);
                  }
                }}
                disabled={numStepIndex >= numResult.steps.length}
                className="px-2.5 py-1.5 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                ก้าวทีละตัว ({numStepIndex}/{numResult.steps.length})
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 overflow-x-auto pb-1">
            <span className="font-medium text-slate-600 dark:text-slate-400">ตัวอย่างทดสอบด่วน:</span>
            <button
              onClick={() => { setNumberInput('+12.45'); setNumStepIndex(0); }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              +12.45 (Float ผ่าน)
            </button>
            <span>·</span>
            <button
              onClick={() => { setNumberInput('1.5e-3'); setNumStepIndex(0); }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              1.5e-3 (Scientific ผ่าน)
            </button>
            <span>·</span>
            <button
              onClick={() => { setNumberInput('42000'); setNumStepIndex(0); }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              42000 (Integer ผ่าน)
            </button>
            <span>·</span>
            <button
              onClick={() => { setNumberInput('12.34.56'); setNumStepIndex(0); }}
              className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              12.34.56 (จุดซ้อน ตก Trap)
            </button>
          </div>

          {/* Graphical Shape Flow for Number DFA */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>แผนภาพการวิเคราะห์ตัวเลข (Compiler Lexer DFA State Graph):</span>
              <span className="text-[11px] font-mono text-slate-500">
                สถานะ:{' '}
                <strong className={`px-2 py-0.5 rounded ${
                  numResult.isAccepted && numStepIndex >= numResult.steps.length
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : currentNumState === 's_trap'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {currentNumState}
                </strong>
              </span>
            </div>

            {/* Shape Pipeline */}
            <div className="min-w-[700px] py-3 flex items-center justify-between gap-1">
              {/* s0: Start */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's0'
                    ? 'border-3 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 ring-4 ring-indigo-500/20 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                }`}>
                  s0
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Start</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">+/-</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s1: Sign */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's1'
                    ? 'border-3 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 ring-4 ring-indigo-500/20 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                }`}>
                  s1
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Sign</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">[0-9]</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s2: Integer (Accept) */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's2'
                    ? 'border-3 border-double border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 ring-4 ring-emerald-500/20 shadow-md scale-105'
                    : 'border-2 border-emerald-300 dark:border-emerald-800 bg-slate-50 dark:bg-slate-900 text-emerald-600'
                }`}>
                  s2 ◎
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Integer</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">'.'</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s3: Dot */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's3'
                    ? 'border-3 border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-600 ring-4 ring-amber-500/20 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                }`}>
                  s3
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Dot</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">[0-9]</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s4: Fraction (Accept) */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's4'
                    ? 'border-3 border-double border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 ring-4 ring-emerald-500/20 shadow-md scale-105'
                    : 'border-2 border-emerald-300 dark:border-emerald-800 bg-slate-50 dark:bg-slate-900 text-emerald-600'
                }`}>
                  s4 ◎
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Float</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">e/E</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s5: Exponent */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's5' || currentNumState === 's6'
                    ? 'border-3 border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 ring-4 ring-indigo-500/20 shadow-md scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                }`}>
                  s5/s6
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Exp Sign</div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center px-0.5">
                <span className="text-[9px] font-mono text-slate-400">[0-9]</span>
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
                </div>
              </div>

              {/* s7: Exp Digits (Accept) */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentNumState === 's7'
                    ? 'border-3 border-double border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 ring-4 ring-emerald-500/20 shadow-md scale-105'
                    : 'border-2 border-emerald-300 dark:border-emerald-800 bg-slate-50 dark:bg-slate-900 text-emerald-600'
                }`}>
                  s7 ◎
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Scientific</div>
              </div>

              {/* s_trap */}
              <div className="border-l border-slate-200 dark:border-slate-800 pl-2 ml-1 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono text-[11px] font-bold transition-all ${
                  currentNumState === 's_trap'
                    ? 'border-3 border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-600 ring-4 ring-rose-500/20'
                    : 'border-2 border-slate-300 dark:border-slate-800 text-slate-400'
                }`}>
                  s_trap
                </div>
                <div className="text-[10px] text-rose-500 mt-1">Error</div>
              </div>
            </div>
          </div>

          {/* Tape / Input Stream Inspector */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              เทปอินพุต (Input Tape Scanning):
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {numberInput.split('').map((ch, i) => {
                const isCurrent = i === numStepIndex - 1;
                const isPassed = i < numStepIndex - 1;
                return (
                  <div
                    key={i}
                    className={`w-7 h-8 shrink-0 flex items-center justify-center font-mono text-xs rounded border transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-700 font-bold scale-110 shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                {numStepIndex === 0 ? (
                  <span className="text-slate-500">สถานะเริ่มต้น s0</span>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200">
                    ขั้นตอนที่ {numStepIndex}: {currentNumStep?.description}
                  </span>
                )}
              </div>

              {numStepIndex >= numResult.steps.length && (
                <div>
                  {numResult.isAccepted ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> ตัวเลขถูกต้องตามไวยากรณ์ (ACCEPTED)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <XCircle className="w-4 h-4" /> รูปแบบตัวเลขผิดหลักไวยากรณ์ (REJECTED)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ORDER LIFECYCLE FSM */}
      {/* ========================================================= */}
      {activeTab === 'order' && (
        <div className="mt-4 space-y-4">
          {/* Order Visual Flow Diagram */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span>แผนผังวงจรชีวิตคำสั่งซื้อ (Order State Machine Flow Chart):</span>
              <button
                onClick={() => {
                  setOrderState('PENDING_PAYMENT');
                  setOrderLogs(['รีเซ็ต Order กลับสู่สถานะเริ่มต้น PENDING_PAYMENT']);
                }}
                className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                รีเซ็ตออเดอร์
              </button>
            </div>

            {/* Shape-based Flow Map */}
            <div className="min-w-[650px] p-2 space-y-4">
              {/* Main pipeline */}
              <div className="flex items-center justify-between gap-2">
                {/* State 1 */}
                <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  orderState === 'PENDING_PAYMENT'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 scale-105 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-400 font-mono">STATE 1</div>
                  <div className="text-xs font-semibold">PENDING_PAYMENT</div>
                  <div className="text-[9px] text-slate-500">รอชำระเงิน</div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">PAY ➔</span>
                  <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
                </div>

                {/* State 2 */}
                <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  orderState === 'PAID'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 scale-105 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-400 font-mono">STATE 2</div>
                  <div className="text-xs font-semibold">PAID</div>
                  <div className="text-[9px] text-slate-500">ชำระแล้ว</div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">PACK ➔</span>
                  <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
                </div>

                {/* State 3 */}
                <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  orderState === 'PROCESSING'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 scale-105 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-400 font-mono">STATE 3</div>
                  <div className="text-xs font-semibold">PROCESSING</div>
                  <div className="text-[9px] text-slate-500">กำลังแพ็ก</div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono font-medium">SHIP ➔</span>
                  <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
                </div>

                {/* State 4 */}
                <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  orderState === 'SHIPPED'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 scale-105 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-400 font-mono">STATE 4</div>
                  <div className="text-xs font-semibold">SHIPPED</div>
                  <div className="text-[9px] text-slate-500">จัดส่งแล้ว</div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] text-teal-600 dark:text-teal-400 font-mono font-medium">DELIVER ➔</span>
                  <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-700" />
                </div>

                {/* State 5: Terminal */}
                <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  orderState === 'DELIVERED'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 scale-105 font-bold shadow-xs'
                    : 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                }`}>
                  <div className="text-[10px] text-emerald-500 font-mono font-bold">TERMINAL</div>
                  <div className="text-xs font-semibold">DELIVERED</div>
                  <div className="text-[9px]">ส่งมอบสำเร็จ</div>
                </div>
              </div>

              {/* Branching paths to Cancelled / Refunded */}
              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-xl border text-xs ${
                  orderState === 'CANCELLED'
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30 font-bold'
                    : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">CANCELLED (ยกเลิกคำสั่งซื้อ)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50">Terminal State</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    กติกา: อนุญาตให้ยกเลิกได้เฉพาะตอนอยู่ในสถานะ <strong>PENDING_PAYMENT</strong> เท่านั้น
                  </p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${
                  orderState === 'REFUNDED'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30 font-bold'
                    : 'border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">REFUNDED (คืนเงินลูกค้า)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50">Terminal State</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    กติกา: คืนเงินได้เมื่อ <strong>PAID, PROCESSING</strong> หรือ <strong>DELIVERED</strong> (ห้ามคืนเงินระหว่าง SHIPPED)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              เลือกกระทำ Action เพื่อทดสอบ Guarded Transition:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => transitionOrder('ชำระเงิน (PAY)', 'PAID')}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                1. ชำระเงิน (➔ PAID)
              </button>
              <button
                onClick={() => transitionOrder('แพ็กสินค้า (PACK)', 'PROCESSING')}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                2. จัดเตรียมสินค้า (➔ PROCESSING)
              </button>
              <button
                onClick={() => transitionOrder('ส่งของให้ขนส่ง (SHIP)', 'SHIPPED')}
                className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                3. ส่งของให้ขนส่ง (➔ SHIPPED)
              </button>
              <button
                onClick={() => transitionOrder('ยืนยันส่งมอบสำเร็จ (DELIVER)', 'DELIVERED')}
                className="px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                4. ส่งมอบสำเร็จ (➔ DELIVERED)
              </button>
              <button
                onClick={() => transitionOrder('ขอยกเลิกออเดอร์ (CANCEL)', 'CANCELLED')}
                className="px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                5. ลูกค้ายกเลิก (➔ CANCELLED)
              </button>
              <button
                onClick={() => transitionOrder('อนุมัติคืนเงิน (REFUND)', 'REFUNDED')}
                className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                6. คืนเงิน (➔ REFUNDED)
              </button>
            </div>
          </div>

          {/* Transition Audit Trail */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono text-xs">
            <div className="text-[11px] text-slate-400 mb-1.5 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>State Transition Audit Trail:</span>
              <span className="text-[10px] text-slate-500">ป้องกัน Race Condition & Illegal Transitions</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {orderLogs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed ${
                    log.includes('[SUCCESS]') ? 'text-emerald-400' :
                    log.includes('[BLOCKED]') ? 'text-rose-400 font-semibold' :
                    'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PASSWORD POLICY STATE MACHINE */}
      {/* ========================================================= */}
      {activeTab === 'password' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                รหัสผ่านทดสอบ:
              </span>
              <input
                type="text"
                value={pwdInput}
                onChange={(e) => setPwdInput(e.target.value)}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="กรอกรหัสผ่าน เช่น P@ssw0rd2026"
              />
            </div>
            <div className="text-xs font-mono">
              คะแนนความปลอดภัย: <strong className={pwdStatus.isAllPassed ? 'text-emerald-500' : 'text-amber-500'}>{pwdStatus.score}/5</strong>
            </div>
          </div>

          {/* Visual State Gates Flow */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              ประตูตรวจสอบความปลอดภัย 5 ด่าน (State Verification Gates):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {/* Gate 1 */}
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                pwdStatus.hasLen
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                <div className="text-xs font-bold mb-0.5">1. ความยาว</div>
                <div className="text-[10px] font-mono">≥ 8 ตัวอักษร</div>
                <div className="mt-1 text-[11px]">{pwdStatus.hasLen ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
              </div>

              {/* Gate 2 */}
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                pwdStatus.hasUpper
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                <div className="text-xs font-bold mb-0.5">2. ตัวพิมพ์ใหญ่</div>
                <div className="text-[10px] font-mono">[A-Z]</div>
                <div className="mt-1 text-[11px]">{pwdStatus.hasUpper ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
              </div>

              {/* Gate 3 */}
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                pwdStatus.hasLower
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                <div className="text-xs font-bold mb-0.5">3. ตัวพิมพ์เล็ก</div>
                <div className="text-[10px] font-mono">[a-z]</div>
                <div className="mt-1 text-[11px]">{pwdStatus.hasLower ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
              </div>

              {/* Gate 4 */}
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                pwdStatus.hasDigit
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                <div className="text-xs font-bold mb-0.5">4. ตัวเลข</div>
                <div className="text-[10px] font-mono">[0-9]</div>
                <div className="mt-1 text-[11px]">{pwdStatus.hasDigit ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
              </div>

              {/* Gate 5 */}
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                pwdStatus.hasSpecial
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                <div className="text-xs font-bold mb-0.5">5. สัญลักษณ์</div>
                <div className="text-[10px] font-mono">[@#$%^&*]</div>
                <div className="mt-1 text-[11px]">{pwdStatus.hasSpecial ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                สถานะสุดท้ายของรหัสผ่าน:
              </span>
              {pwdStatus.isAllPassed ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> ปลอดภัยระดับ Enterprise (PASSED)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <AlertTriangle className="w-4 h-4" /> ยังไม่ครบทุกเงื่อนไข (INCOMPLETE)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
