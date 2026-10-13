import React, { useState } from 'react';
import { ShieldCheck, Play, RotateCcw, Copy, Check, EyeOff } from 'lucide-react';

export const LogSanitizerSandbox: React.FC = () => {
  const sampleRawLog = `{
  "timestamp": "2026-10-12T14:32:00.120Z",
  "level": "INFO",
  "trace_id": "c8f2a1b9-8e71-4a11-8931-e19ad9821041",
  "action": "PAYMENT_TRANSACTION_SUBMITTED",
  "user_id": "usr_99182",
  "ip_address": "203.150.10.42",
  "request_payload": {
    "account_holder": "นายสมชาย เจริญกิจ",
    "thai_national_id": "1-1002-00341-98-4",
    "phone_number": "089-123-4567",
    "password": "SuperSecretPassword123!",
    "credit_card": "4111 2222 3333 4444",
    "cvv": "982",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...",
    "amount_thb": 15000.00
  }
}`;

  const [inputLog, setInputLog] = useState(sampleRawLog);
  const [sanitizedOutput, setSanitizedOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [maskedCount, setMaskedCount] = useState(0);

  const sanitizeLog = (rawText: string) => {
    try {
      const parsed = JSON.parse(rawText);
      let count = 0;

      const maskDeep = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
          return obj.map(maskDeep);
        }

        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const lowerKey = key.toLowerCase();

          // 1. Password / Secret / CVV / PIN
          if (['password', 'passwd', 'secret', 'cvv', 'cvc', 'pin', 'token'].includes(lowerKey)) {
            newObj[key] = '[REDACTED_SECRET]';
            count++;
            continue;
          }

          // 2. Authorization header
          if (lowerKey === 'authorization' && typeof value === 'string') {
            newObj[key] = value.startsWith('Bearer ')
              ? 'Bearer [REDACTED_JWT_TOKEN]'
              : '[REDACTED_CREDENTIAL]';
            count++;
            continue;
          }

          // 3. String values pattern matching
          if (typeof value === 'string') {
            let str = value;

            // Credit Card (13-16 digits)
            if (/\b(?:\d[ -]*?){13,16}\b/.test(str)) {
              str = str.replace(/\b(?:\d[ -]*?){13,16}\b/g, (cc) => {
                const digits = cc.replace(/\D/g, '');
                return `${digits.slice(0, 4)}-XXXX-XXXX-${digits.slice(-4)}`;
              });
              count++;
            }

            // Thai Citizen ID (13 digits like 1-1002-00341-98-4)
            if (/\b\d-?\d{4}-?\d{5}-?\d{2}-?\d\b/.test(str)) {
              str = str.replace(/\b(\d)-?(\d{4})-?(\d{5})-?(\d{2})-?(\d)\b/g, '$1-XXXX-XXXXX-$4-$5');
              count++;
            }

            // Phone numbers (08x-xxx-xxxx)
            if (/\b0[689]\d{1}[- ]?\d{3}[- ]?\d{4}\b/.test(str)) {
              str = str.replace(/\b(0[689]\d{1})[- ]?(\d{3})[- ]?(\d{4})\b/g, '$1-XXX-$3');
              count++;
            }

            newObj[key] = str;
          } else if (typeof value === 'object') {
            newObj[key] = maskDeep(value);
          } else {
            newObj[key] = value;
          }
        }
        return newObj;
      };

      const result = maskDeep(parsed);
      setMaskedCount(count);
      return JSON.stringify(result, null, 2);
    } catch {
      return '// ผิดพลาด: รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบ Syntax';
    }
  };

  const handleRunSanitizer = () => {
    const res = sanitizeLog(inputLog);
    setSanitizedOutput(res);
  };

  React.useEffect(() => {
    setSanitizedOutput(sanitizeLog(sampleRawLog));
  }, []);

  const handleCopy = async () => {
    if (!sanitizedOutput) return;
    await navigator.clipboard.writeText(sanitizedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              ห้องทดลองจำลอง: PDPA Data Sanitizer & Masking Sandbox
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ทดสอบการตัดข้อมูลอ่อนไหว (Sensitive PII) ก่อนถูกส่งต่อไปยังศูนย์กลาง Log (ELK / CloudWatch)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInputLog(sampleRawLog);
              setSanitizedOutput(sanitizeLog(sampleRawLog));
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> คืนค่าตัวอย่าง
          </button>
          <button
            onClick={handleRunSanitizer}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer transition-colors"
          >
            <Play className="w-3 h-3 fill-white" /> ทดสอบ Masking
          </button>
        </div>
      </div>

      {/* Side-by-side or stacked editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              Raw Payload (ก่อน Masking)
            </span>
            <span className="text-[11px] text-rose-500 font-mono">มีข้อมูลอ่อนไหว 5 จุด</span>
          </div>
          <textarea
            value={inputLog}
            onChange={(e) => setInputLog(e.target.value)}
            rows={15}
            className="w-full font-mono text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            placeholder="วาง JSON raw log ที่นี่..."
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Sanitized Output (พร้อมส่ง Log Hub)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-500 font-mono">
                Masked: {maskedCount} จุด
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
            </div>
          </div>
          <pre className="w-full font-mono text-xs p-3 rounded-lg border border-emerald-500/30 dark:border-emerald-500/20 bg-slate-950 text-emerald-300/90 overflow-auto h-[312px] leading-relaxed">
            {sanitizedOutput}
          </pre>
        </div>
      </div>

      {/* Rules summary banner */}
      <div className="mt-4 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300">
        <strong className="text-slate-900 dark:text-slate-100 font-semibold block mb-1">
          เกณฑ์การ Mask ข้อมูลตามมาตรา 26 พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA):
        </strong>
        <p className="text-[12px] leading-relaxed">
          1. รหัสผ่าน/CVV/Token ถูกแทนที่ด้วย <code className="text-rose-500 bg-rose-50 dark:bg-rose-950 px-1 rounded">[REDACTED]</code> เสมอ ·
          2. บัตรประชาชนไทย 13 หลักคงเหลือเพียงหลักแรกและหลักตรวจสอบท้ายสุด ·
          3. หมายเลขบัตรเครดิตแสดงเฉพาะ 4 ตัวหน้าและ 4 ตัวท้ายเพื่อใช้ในการกระทบยอด (Reconciliation) เท่านั้น
        </p>
      </div>
    </div>
  );
};
