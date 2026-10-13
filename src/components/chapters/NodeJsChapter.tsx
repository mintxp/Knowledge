import React, { useState } from 'react';
import { Copy, Check, Server, Sparkles, FolderTree, Shield, Database, AlertCircle, Key, FileText, CheckCircle2, Terminal } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { NodeResponseTester } from '../widgets/NodeResponseTester';

interface NodeJsChapterProps {
  promptText: string;
}

export const NodeJsChapter: React.FC<NodeJsChapterProps> = ({ promptText }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedErrorPrompt, setCopiedErrorPrompt] = useState(false);

  const errorHandlingPrompt = `ช่วยเขียนบทความคู่มือภาษาไทยรูปแบบไฟล์ MDX สำหรับ Node.js ในหัวข้อ 'การออกแบบ Global Error Handling และ Standard API Response' โดยใช้ Express.js และ TypeScript
มีเนื้อหาครอบคลุม:
1. การสร้าง Custom AppError Class
2. การสร้าง Global Error Middleware สำหรับดักจับ ทั้ง Synchronous และ Asynchronous Error (unhandledRejection)
3. ตัวอย่างการคืนค่า JSON Response ที่เป็นมาตรฐานเดียวกันทั้งโปรเจกต์
4. ข้อควรระวัง: การซ่อน Stack Trace เมื่ออยู่ในโหมด Production`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleCopyErrorPrompt = async () => {
    try {
      await navigator.clipboard.writeText(errorHandlingPrompt);
      setCopiedErrorPrompt(true);
      setTimeout(() => setCopiedErrorPrompt(false), 2000);
    } catch {}
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          <span>สถาปัตยกรรม Backend & API Engineering</span>
          <span aria-hidden="true">·</span>
          <span>Node.js / Express / TypeScript</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          คู่มือพัฒนา Node.js & Express ระดับ Production (Clean Architecture)
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือสถาปัตยกรรมฉบับสมบูรณ์ 8 หัวข้อหลักสำหรับการสร้าง Backend API ด้วย Node.js, Express และ TypeScript 
          ระดับ Enterprise ตั้งแต่การวางโครงสร้าง Clean Architecture, Security Middlewares, Database Connection Pooling, 
          Standardized Response, ระบบ JWT/RBAC ไปจนถึง Automated Testing และ Docker Deployment
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 15 นาที</span>
          <span aria-hidden="true">·</span>
          <span>Node.js 20+ LTS</span>
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

      {/* 1. Project Structure & Clean Architecture */}
      <section id="project-structure" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-indigo-500" />
          1. การวางโครงสร้างโปรเจกต์ (Project Structure & Clean Architecture)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          เมื่อโปรเจกต์ Node.js เติบโตขึ้น การใส่โค้ดทั้งหมดลงในโฟลเดอร์เดียวจะสร้างปัญหา Dependency Tangling 
          สถาปัตยกรรมระดับ Production นิยมแยกตามความรับผิดชอบ (Separation of Concerns) ด้วย <strong>Clean / Layered Architecture</strong>:
        </p>

        <div className="my-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-400 mb-2 uppercase tracking-wider text-[11px]">Recommended Enterprise Directory Layout:</div>
          <div className="text-emerald-400">├── src/</div>
          <div className="pl-4 text-slate-300">├── config/         <span className="text-slate-500"># ตรวจสอบ ENV ด้วย Zod, DB config, Logger config</span></div>
          <div className="pl-4 text-slate-300">├── controllers/    <span className="text-slate-500"># จัดการ HTTP Request/Response และแปลง Status Code</span></div>
          <div className="pl-4 text-slate-300">├── services/       <span className="text-slate-500"># แกนกลาง Business Logic บริสุทธิ์ (Pure Logic)</span></div>
          <div className="pl-4 text-slate-300">├── routes/         <span className="text-slate-500"># นิยาม Endpoint และผูก Middlewares</span></div>
          <div className="pl-4 text-slate-300">├── models/         <span className="text-slate-500"># ORM Schema / Database Entity (Prisma / Drizzle)</span></div>
          <div className="pl-4 text-slate-300">├── middlewares/    <span className="text-slate-500"># Auth, RateLimiter, ErrorHandler, ZodValidator</span></div>
          <div className="pl-4 text-slate-300">├── utils/          <span className="text-slate-500"># Helper functions, Custom Error classes</span></div>
          <div className="pl-4 text-slate-300">├── app.ts          <span className="text-slate-500"># สร้าง Express Application & Middlewares</span></div>
          <div className="pl-4 text-slate-300">└── server.ts       <span className="text-slate-500"># Start Server, Listen Port & Graceful Shutdown</span></div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          TypeScript Setup & Alias Paths (tsconfig.json)
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          หลีกเลี่ยง Relative import ที่ยาวเหยียดอย่าง <code className="text-rose-500 font-mono text-xs">../../../../services/user.service</code> 
          ด้วยการตั้งค่า Path Alias ใน <code className="text-slate-800 dark:text-slate-200 font-mono text-xs">tsconfig.json</code>:
        </p>

        <CodeBlock
          filename="tsconfig.json"
          language="json"
          code={`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": ".",
    "paths": {
      "@/config/*": ["src/config/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/services/*": ["src/services/*"],
      "@/middlewares/*": ["src/middlewares/*"],
      "@/utils/*": ["src/utils/*"],
      "@/models/*": ["src/models/*"]
    },
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}`}
        />

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          Environment Variables Validation ด้วย Zod (Fail-Fast Pattern)
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ข้อผิดพลาดร้ายแรงคือเซิร์ฟเวอร์รันขึ้นมาได้ แต่ล่มกลางคันเมื่อผู้ใช้เรียกฟังก์ชันที่ใช้ ENV ที่ลืมตั้งค่า 
          แนวทางปฏิบัติที่ดีที่สุดคือการทำ <strong>Fail-Fast</strong> โดยให้โปรเซสหยุดทำงานทันทีหาก ENV ไม่ผ่าน Zod Schema:
        </p>

        <CodeBlock
          filename="src/config/env.ts"
          language="typescript"
          code={`import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  DATABASE_URL: z.string().url('DATABASE_URL ต้องเป็นรูปแบบ Connection String ที่ถูกต้อง'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET ต้องมีความยาวอย่างน้อย 32 ตัวอักษร'),
  REDIS_URL: z.string().url().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ ข้อผิดพลาดในการตั้งค่า Environment Variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1); // สั่งปิดโปรเซสทันที (Fail-Fast)
}

export const env = _env.data;`}
        />
      </section>

      {/* 2. Web Server & Express.js */}
      <section id="web-server-express" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          2. การตั้งค่า Web Server & Express.js (Security & Graceful Shutdown)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          แยกการสร้าง Express App ออกจาก Server Listener เพื่อให้ง่ายต่อการเขียน Integration Test โดยไม่ต้องเปิด Port จริง:
        </p>

        <CodeBlock
          filename="src/app.ts"
          language="typescript"
          code={`import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { logger } from '@/utils/logger';
import { globalErrorHandler } from '@/middlewares/error.middleware';
import { userRouter } from '@/routes/user.routes';
import { authRouter } from '@/routes/auth.routes';

export const createApp = (): Application => {
  const app = express();

  // 1. Security Middlewares
  app.use(helmet()); // ตั้งค่า HTTP Security Headers ป้องกัน XSS, Clickjacking
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  }));

  // 2. Body Parser พร้อมจำกัดขนาด Payload ป้องกัน DoS
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 3. HTTP Request Logger
  app.use(pinoHttp({ logger }));

  // 4. Modular Resource Routing (API Versioning)
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);

  // 5. Global Error Handling Middleware (ต้องวางล่างสุดเสมอ)
  app.use(globalErrorHandler);

  return app;
};`}
        />

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          Graceful Shutdown (การปิด Server อย่างปลอดภัย)
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          เมื่อ Kubernetes หรือ Docker สั่งหยุด Container (SIGTERM) หากตัดโปรเซสทันที Request ของผู้ใช้ที่กำลังเขียนข้อมูลจะพัง 
          เราต้องรอให้คำขอที่ค้างอยู่ประมวลผลเสร็จ และตัดการเชื่อมต่อ Database อย่างนุ่มนวล:
        </p>

        <CodeBlock
          filename="src/server.ts"
          language="typescript"
          code={`import { createApp } from './app';
import { env } from '@/config/env';
import { db } from '@/config/db';
import { logger } from '@/utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(\`🚀 เซิร์ฟเวอร์พร้อมทำงานที่พอร์ต \${env.PORT} ในโหมด \${env.NODE_ENV}\`);
});

// ฟังก์ชันสำหรับปิดเซิร์ฟเวอร์แบบนุ่มนวล (Graceful Shutdown)
const handleShutdown = async (signal: string) => {
  logger.info(\`⚠️ ได้รับสัญญาณ \${signal} กำลังเริ่มปิดระบบอย่างปลอดภัย...\`);

  // หยุดรับ Request ใหม่ แต่ให้ Request ที่ประมวลผลอยู่ทำงานต่อจนเสร็จ
  server.close(async () => {
    logger.info('🛑 HTTP Server ปิดการรับคำขอเรียบร้อยแล้ว');
    try {
      await db.$disconnect(); // ปิด Connection Pool ของ Database
      logger.info('📦 ตัดการเชื่อมต่อ Database เรียบร้อย');
      process.exit(0);
    } catch (err) {
      logger.error('❌ เกิดข้อผิดพลาดขณะปิดการเชื่อมต่อ DB:', err);
      process.exit(1);
    }
  });

  // กำหนด Timeout บังคับปิด หาก Request ค้างเกิน 10 วินาที
  setTimeout(() => {
    logger.error('⏰ บังคับปิดระบบเนื่องจากหมดเวลา Graceful Shutdown (10s)');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));`}
        />
      </section>

      {/* 3. Database & ORM */}
      <section id="database-orm" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          3. การเชื่อมต่อฐานข้อมูลและการทำ ORM (Connection Pool & Migrations)
        </h2>

        {/* ORM Comparison */}
        <div className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <th className="p-3 font-semibold">เครื่องมือ</th>
                <th className="p-3 font-semibold">ข้อดีหลัก</th>
                <th className="p-3 font-semibold">ข้อจำกัด / ข้อควรพิจารณา</th>
                <th className="p-3 font-semibold">การใช้งานที่เหมาะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">Prisma</td>
                <td className="p-3">Type-safe สูงสุด, Auto-completion ยอดเยี่ยม, Prisma Studio สวยงาม</td>
                <td className="p-3">ใช้ Rust Binary ในเบื้องหลัง, Query ซับซ้อนอาจมี Overhead</td>
                <td className="p-3">CRUD Apps ทั่วไป, Fast Prototyping, ทีมที่เน้น DX</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Kysely / Drizzle</td>
                <td className="p-3">Zero-overhead, SQL-like syntax, Type-safe 100%, น้ำหนักเบามาก</td>
                <td className="p-3">ต้องเข้าใจ SQL อย่างดี, Ecosystem ยังใหม่กว่า</td>
                <td className="p-3">High-throughput APIs, Serverless, Microservices ขนาดเล็ก</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">TypeORM</td>
                <td className="p-3">รองรับ Active Record & Data Mapper, เหมาะกับ NestJS</td>
                <td className="p-3">มีประเด็นเรื่อง Maintenance และ Bug เก่าใน GitHub Issues</td>
                <td className="p-3">Enterprise Java/Spring style architecture</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Connection Pooling Best Practices">
          อย่าปล่อยให้ขนาด Pool ใหญ่เกินไปโดยไม่จำเป็น (เช่น ตั้ง Max 100 ต่อ Container):
          <ul className="mt-2 space-y-1">
            <li><strong>สูตรคำนวณ Connection Pool แนะนำ:</strong> <code className="text-slate-800 dark:text-slate-200 font-mono text-xs">pool_size = (CPU_cores * 2) + effective_spindle_count</code></li>
            <li>สำหรับ Container ทั่วไป กำหนด Connection Pool อยู่ที่ 5 - 15 connections ต่ออินสแตนซ์ก็เพียงพอสำหรับรองรับคำขอระดับพัน QPS แล้ว</li>
            <li>ใน Production แนะนำให้รัน Migration ด้วยคำสั่ง <code className="text-slate-800 dark:text-slate-200 font-mono text-xs">npx prisma migrate deploy</code> ใน CI/CD Pipeline ก่อนปล่อยแอป ห้ามใช้ <code className="text-slate-800 dark:text-slate-200 font-mono text-xs">migrate dev</code> บน Production เด็ดขาด!</li>
          </ul>
        </Callout>
      </section>

      {/* 4. Error Handling & Standardized Response */}
      <section id="error-handling" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-500" />
          4. การจัดการ Error และ Standardized API Response
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          การคืนค่า Error ในรูปแบบที่แตกต่างกัน (เช่น บางครั้งเป็น string บางครั้งเป็น object) จะสร้างปัญหาให้ Frontend อย่างมาก 
          ระบบควรสร้าง Custom Error Hierarchy และกำหนด Envelope Response มาตรฐานเดียว:
        </p>

        {/* Simulator */}
        <NodeResponseTester />

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          Custom Error Hierarchy & Global Middleware
        </h3>

        <CodeBlock
          filename="src/utils/appError.ts"
          language="typescript"
          code={`// 1. Base Application Error Class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 2. Concrete Specialized Errors
export class BadRequestError extends AppError {
  constructor(message: string = 'ข้อมูลที่ส่งมาไม่ถูกต้อง') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'ไม่มีสิทธิ์เข้าถึง กรุณายืนยันตัวตน') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'ไม่พบข้อมูลที่ต้องการ') {
    super(message, 404);
  }
}`}
        />

        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-4 mb-2">
          Global Error Handler Middleware พร้อมระบบ <strong>ซ่อน Stack Trace เมื่อ NODE_ENV=production</strong>:
        </p>

        <CodeBlock
          filename="src/middlewares/error.middleware.ts"
          language="typescript"
          code={`import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/appError';
import { logger } from '@/utils/logger';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  // บันทึก Log ลงระบบ Observability
  logger.error({
    err,
    url: req.originalUrl,
    method: req.method,
    statusCode,
    traceId: req.headers['x-correlation-id']
  }, '💥 ตรวจพบ Error ผ่าน Global Error Handler');

  // ข้อความที่ปลอดภัยสำหรับแสดงให้ผู้ใช้
  const message = (isAppError || !isProd)
    ? err.message
    : 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง';

  // ส่งคืน Standardized Envelope Response
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: isAppError ? err.constructor.name : 'INTERNAL_SERVER_ERROR',
      message,
      // ซ่อน Stack Trace เด็ดขาดเมื่ออยู่ใน Production เพื่อป้องกันการรั่วไหลของข้อมูลระบบ
      ...((!isProd && err.stack) ? { stack: err.stack } : {})
    },
    timestamp: new Date().toISOString()
  });
};`}
        />
      </section>

      {/* 5. Authentication & Authorization (JWT & RBAC) */}
      <section id="auth-rbac" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-500" />
          5. การจัดการ Authentication & Authorization (JWT & RBAC)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          การตรวจสอบสิทธิ์ผ่าน Middleware โดยถอดรหัส JWT และสร้าง Role-Based Access Control (RBAC) 
          แบบ Type-safe:
        </p>

        <CodeBlock
          filename="src/middlewares/auth.middleware.ts"
          language="typescript"
          code={`import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/utils/appError';

interface UserPayload {
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// 1. ตรวจสอบความถูกต้องของ JWT Token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('ไม่พบ Authorization Token');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded; // ฝังข้อมูล User เข้า Request Context
    next();
  } catch (error) {
    throw new UnauthorizedError('Token ไม่ถูกต้องหรือหมดอายุแล้ว');
  }
};

// 2. ตรวจสอบสิทธิ์ตามบทบาท (Role-Based Access Control)
export const checkRole = (allowedRoles: ('admin' | 'editor' | 'viewer')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN_ACCESS',
          message: 'คุณไม่มีสิทธิ์ในการกระทำคำขอนี้'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    next();
  };
};`}
        />
      </section>

      {/* 6. Logging & Observability */}
      <section id="logging-observability" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          6. ระบบบันทึก Log และ Correlation ID
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ใช้ <strong>Pino</strong> เพื่อประสิทธิภาพความเร็วสูงกว่า Winston ถึง 5 เท่า 
          พร้อมใช้ <strong>AsyncLocalStorage</strong> หรือ Middleware ในการส่งต่อ <code className="text-slate-800 dark:text-slate-200 font-mono text-xs">x-request-id</code>:
        </p>

        <CodeBlock
          filename="src/middlewares/correlation.middleware.ts"
          language="typescript"
          code={`import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = correlationId;
  res.setHeader('x-request-id', correlationId);
  next();
};`}
        />
      </section>

      {/* 7. Input Validation with Zod */}
      <section id="validation-sanitization" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          7. การทำ Input Validation & Sanitization ด้วย Zod
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          สกัดกั้นข้อมูลที่ไม่ถูกต้องตั้งแต่ด่านหน้า (Middleware Boundary) ก่อนที่จะหลุดเข้าไปใน Controller หรือ Service:
        </p>

        <CodeBlock
          filename="src/middlewares/validate.middleware.ts"
          language="typescript"
          code={`import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate ทั้ง Body, Query, และ Params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'ข้อมูลที่ส่งมาไม่ผ่านการตรวจสอบ',
            details: error.errors.map((e) => ({
              field: e.path.join('.').replace('body.', ''),
              message: e.message
            }))
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      next(error);
    }
  };
};`}
        />
      </section>

      {/* 8. Testing & Deployment */}
      <section id="testing-deployment" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          8. Automated Testing & Docker Deployment (/health endpoints)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          Health Check Endpoints ที่แยก <strong>Liveness</strong> (แอปยังทำงาน) ออกจาก <strong>Readiness</strong> (DB พร้อมรับงาน):
        </p>

        <CodeBlock
          filename="src/routes/health.routes.ts"
          language="typescript"
          code={`import { Router } from 'express';
import { db } from '@/config/db';

export const healthRouter = Router();

// Liveness Probe: ตรวจสอบว่าโปรเซส Node.js ไม่แฮงค์
healthRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Readiness Probe: ตรวจสอบการเชื่อมต่อ Database และ External Dependencies
healthRouter.get('/readiness', async (req, res) => {
  try {
    await db.$queryRaw\`SELECT 1\`; // Ping database
    res.status(200).json({
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'NOT_READY',
      database: 'DISCONNECTED',
      error: 'ฐานข้อมูลไม่พร้อมรับการเชื่อมต่อ'
    });
  }
});`}
        />
      </section>

      {/* Prompts Section */}
      <section id="original-prompt" className="scroll-mt-24 mb-12 space-y-6">
        <div className="p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                ตัวอย่าง Prompt สั่งเขียนเรื่อง Error Handling (Cursor / Claude)
              </h3>
            </div>
            <button
              onClick={handleCopyErrorPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              {copiedErrorPrompt ? (
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
            {errorHandlingPrompt}
          </pre>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Master Prompt ฉบับเต็ม 8 หัวข้อสำหรับ Node.js Architecture
              </h3>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> คัดลอก Master Prompt
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
            {promptText}
          </pre>
        </div>
      </section>
    </article>
  );
};
