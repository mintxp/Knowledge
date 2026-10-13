import React, { useState } from 'react';
import { Play, RotateCcw, ShieldCheck, Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthFlowVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. User Submits Credentials',
      actor: 'Frontend → Backend',
      action: 'POST /api/v1/auth/login',
      payload: {
        email: 'developer@enterprise.th',
        password: '••••••••••••••••'
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      explanation: 'User กรอก Email และ Password ส่งผ่าน HTTPS พร้อม Rate Limiting ป้องกัน Brute-force',
      storageState: { memory: 'None', cookies: 'None', localStorage: 'None' }
    },
    {
      title: '2. Backend Validates & Hashes',
      actor: 'Backend Internal',
      action: 'argon2.verify(hash, password) & generate tokens',
      payload: {
        userId: 'usr_98a72f10',
        role: 'SOFTWARE_ENGINEER',
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d'
      },
      headers: {
        'DB-Query': 'SELECT password_hash FROM users WHERE email = ?'
      },
      explanation: 'Backend ตรวจสอบความถูกต้องด้วย Argon2id/Bcrypt หากถูกต้องจะออก Access Token (15 นาที) และ Refresh Token (7 วัน)',
      storageState: { memory: 'None', cookies: 'None', localStorage: 'None' }
    },
    {
      title: '3. Set HttpOnly Cookie & Return Access Token',
      actor: 'Backend → Frontend Response',
      action: '200 OK + Set-Cookie Header',
      payload: {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOThhNzJm... (Short-lived)',
        user: { id: 'usr_98a72f10', name: 'Somchai Dev', role: 'ENGINEER' }
      },
      headers: {
        'Set-Cookie': 'refreshToken=rf_8b91a...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800'
      },
      explanation: 'สำคัญที่สุด! Refresh Token ถูกส่งเป็น HttpOnly Cookie เพื่อกัน JavaScript/XSS เข้าถึง ส่วน Access Token เก็บใน RAM (In-Memory)',
      storageState: {
        memory: 'AccessToken (Valid 15m)',
        cookies: 'refreshToken (HttpOnly, SameSite=Strict)',
        localStorage: 'ห้ามเก็บ Token เด็ดขาด! (ป้องกัน XSS)'
      }
    },
    {
      title: '4. Calling Protected API Endpoints',
      actor: 'Frontend → Resource API',
      action: 'GET /api/v1/projects/financial-reports',
      payload: {
        query: 'status=active'
      },
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1Ni... (AccessToken from Memory)'
      },
      explanation: 'Frontend ดึง Access Token จาก Memory แนบใน Authorization Header ทุกคำขอ Backend ตรวจสอบลายเซ็น Cryptographic ทันทีโดยไม่ต้อง query DB ซ้ำ',
      storageState: {
        memory: 'AccessToken (Valid)',
        cookies: 'refreshToken (Secured)',
        localStorage: 'Empty'
      }
    },
    {
      title: '5. Silent Token Refresh (เมื่อ Access Token หมดอายุ)',
      actor: 'Axios/Fetch Interceptor → Auth API',
      action: 'POST /api/v1/auth/refresh (Automatic 401 Catch)',
      payload: {
        status: 'Triggered on 401 Unauthorized'
      },
      headers: {
        'Cookie': 'refreshToken=rf_8b91a... (ส่งให้อัตโนมัติโดย Browser)',
        'credentials': 'include'
      },
      explanation: 'เมื่อ Access Token หมดอายุ Frontend ส่งคำขอต่ออายุโดย Browser แนบ HttpOnly Cookie ให้อัตโนมัติ พร้อมทำ Refresh Token Rotation สร้างคู่ Token ใหม่ทันที',
      storageState: {
        memory: 'New AccessToken (New 15m)',
        cookies: 'Rotated refreshToken (New)',
        localStorage: 'Empty'
      }
    }
  ];

  const active = steps[currentStep];

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              แบบจำลองการทำงาน: Production Auth & Token Refresh Flow
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            คลิกปุ่มขั้นตอนเพื่อดูการแลกเปลี่ยน Payload และสถานะความปลอดภัยในแต่ละสเต็ป
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer transition-colors"
          >
            {currentStep < steps.length - 1 ? (
              <>
                ขั้นตอนถัดไป <Play className="w-3 h-3 fill-white" />
              </>
            ) : (
              <>
                เริ่มใหม่ <RotateCcw className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stepper Dots */}
      <div className="grid grid-cols-5 gap-2 my-4">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
              currentStep === idx
                ? 'border-indigo-500/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span>Step {idx + 1}</span>
              {currentStep > idx ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : null}
            </div>
            <div className="line-clamp-1 text-[11px] font-medium">{s.title.split('. ')[1]}</div>
          </button>
        ))}
      </div>

      {/* Active Step Showcase */}
      <div className="space-y-4">
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-slate-100 dark:border-slate-900">
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-500" />
              {active.title}
            </span>
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
              {active.actor}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
            {active.explanation}
          </p>

          {/* Action & Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-indigo-400" /> Action / Headers
              </div>
              <div className="text-indigo-300 font-semibold mb-2">{active.action}</div>
              <div className="text-[11px] text-slate-400 space-y-1">
                {Object.entries(active.headers).map(([k, v]) => (
                  <div key={k} className="break-all">
                    <span className="text-slate-500">{k}:</span> {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Payload Data
              </div>
              <pre className="text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                {JSON.stringify(active.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* State in Frontend Storage */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-xs">
          <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] uppercase tracking-wider mb-2">
            สถานะการจัดเก็บในฝั่ง Client ณ จุดนี้
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50">
              <span className="text-slate-500 block text-[11px]">JavaScript Memory (RAM):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{active.storageState.memory}</span>
            </div>
            <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50">
              <span className="text-slate-500 block text-[11px]">Browser Cookies:</span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 break-all">{active.storageState.cookies}</span>
            </div>
            <div className="p-2 rounded bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/50">
              <span className="text-slate-500 block text-[11px]">LocalStorage / SessionStorage:</span>
              <span className="font-semibold text-rose-700 dark:text-rose-400">{active.storageState.localStorage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
