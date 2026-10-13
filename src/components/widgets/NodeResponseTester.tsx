import React, { useState } from 'react';
import { Terminal, Check, Copy, Shield, AlertCircle, Play, Server, Layers } from 'lucide-react';

export const NodeResponseTester: React.FC = () => {
  const [scenario, setScenario] = useState<'success' | 'validation' | 'unauthorized' | 'internal'>('success');
  const [isProdEnv, setIsProdEnv] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const getResponse = () => {
    const timestamp = '2026-10-13T12:00:00.120Z';
    switch (scenario) {
      case 'success':
        return {
          status: 200,
          payload: {
            success: true,
            data: {
              id: 'usr_891024',
              email: 'engineer@production.io',
              name: 'Somchai SeniorDev',
              role: 'TEAM_LEAD',
              createdAt: '2026-01-15T08:30:00.000Z'
            },
            error: null,
            timestamp
          }
        };
      case 'validation':
        return {
          status: 400,
          payload: {
            success: false,
            data: null,
            error: {
              code: 'VALIDATION_FAILED',
              message: 'ข้อมูล Input ไม่ถูกต้องตาม Zod Schema',
              details: [
                { field: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                { field: 'password', message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' }
              ]
            },
            timestamp
          }
        };
      case 'unauthorized':
        return {
          status: 401,
          payload: {
            success: false,
            data: null,
            error: {
              code: 'UNAUTHORIZED_ACCESS',
              message: 'Access Token หมดอายุหรือไม่ถูกต้อง กรุณาต่ออายุ Session'
            },
            timestamp
          }
        };
      case 'internal':
        const prodPayload: any = {
          success: false,
          data: null,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแลระบบ'
          },
          timestamp
        };
        if (!isProdEnv) {
          prodPayload.error.stack = "Error: Database connection pool exhausted at PostgreSQL.connect (/src/db/pool.ts:42:15) at UserService.findAll (/src/services/user.service.ts:18:22)";
        }
        return {
          status: 500,
          payload: prodPayload
        };
    }
  };

  const current = getResponse();
  const jsonString = JSON.stringify(current.payload, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              แบบจำลองผลลัพธ์: Standardized API Response & Error Handling
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ทดลองจำลอง HTTP Status ต่างๆ และดูความแตกต่างระหว่าง Production vs Development Mode
          </p>
        </div>

        {/* Environment toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">โหมดรัน:</span>
          <button
            onClick={() => setIsProdEnv(!isProdEnv)}
            className={`px-2.5 py-1 text-xs rounded-md border font-mono transition-colors cursor-pointer ${
              isProdEnv
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold'
            }`}
          >
            {isProdEnv ? 'NODE_ENV=production (ซ่อน Stack)' : 'NODE_ENV=development (แสดง Stack)'}
          </button>
        </div>
      </div>

      {/* Scenario buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        <button
          onClick={() => setScenario('success')}
          className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
            scenario === 'success'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-medium'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">200 OK</div>
          <div className="truncate text-[11px] mt-0.5">Success Response</div>
        </button>

        <button
          onClick={() => setScenario('validation')}
          className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
            scenario === 'validation'
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 font-medium'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          <div className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">400 Bad Request</div>
          <div className="truncate text-[11px] mt-0.5">Zod Validation Error</div>
        </button>

        <button
          onClick={() => setScenario('unauthorized')}
          className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
            scenario === 'unauthorized'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 font-medium'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">401 Unauthorized</div>
          <div className="truncate text-[11px] mt-0.5">JWT Token Expired</div>
        </button>

        <button
          onClick={() => setScenario('internal')}
          className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
            scenario === 'internal'
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 font-medium'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          <div className="font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">500 Server Error</div>
          <div className="truncate text-[11px] mt-0.5">DB Crash / Unhandled</div>
        </button>
      </div>

      {/* Output Console */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden text-xs font-mono">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              current.status === 200 ? 'bg-emerald-500/20 text-emerald-400' :
              current.status === 400 ? 'bg-amber-500/20 text-amber-400' :
              current.status === 401 ? 'bg-indigo-500/20 text-indigo-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              HTTP {current.status}
            </span>
            <span className="text-slate-400 text-[11px]">Content-Type: application/json</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}</span>
          </button>
        </div>

        <pre className="p-4 leading-relaxed overflow-x-auto text-emerald-300 dark:text-emerald-300/90 text-xs">
          {jsonString}
        </pre>
      </div>

      <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
        โครงสร้าง Response มาตรฐานแบบ Unified Envelope ช่วยให้ Frontend (เช่น Angular หรือ React) สามารถเขียน Axios Interceptor ตรวจสอบ <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">response.data.success</code> ได้อย่างสม่ำเสมอทุกจุด
      </div>
    </div>
  );
};
