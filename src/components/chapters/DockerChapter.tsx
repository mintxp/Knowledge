import React, { useState } from 'react';
import { Copy, Check, Container, Sparkles, Terminal, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { DockerStackViewer } from '../widgets/DockerStackViewer';

interface DockerChapterProps {
  promptText: string;
}

export const DockerChapter: React.FC<DockerChapterProps> = ({ promptText }) => {
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
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-2">
          <span>DevOps & โครงสร้างพื้นฐานสำหรับทีม</span>
          <span aria-hidden="true">·</span>
          <span>Containers & Team Workflow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          การใช้งาน Docker สำหรับทีมพัฒนา
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือขจัดปัญหาคลาสสิก "มันรันได้ในเครื่องผม (Works on my machine)" ด้วย Docker มาตรฐานสำหรับทีม: 
          เจาะลึกแนวคิด Multi-stage build สำหรับ Node.js และ Angular ตลอดจนการเซ็ตอัป docker-compose.yml 
          เพื่อรัน Fullstack + PostgreSQL พร้อมเริ่มงานได้ด้วยคำสั่งเดียว
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 10 นาที</span>
          <span aria-hidden="true">·</span>
          <span>Docker 2026</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={handleCopyPrompt}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedPrompt ? <Check className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3" />}
            {copiedPrompt ? 'คัดลอก Master Prompt' : 'คัดลอก Master Prompt'}
          </button>
        </div>
      </div>

      {/* Section 1: Overview */}
      <section id="overview" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Container className="w-5 h-5 text-cyan-500" />
          ทำไมทีมวิศวกรซอฟต์แวร์ต้องใช้ Docker?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          เมื่อทีมพัฒนาขยายใหญ่ขึ้น ปัญหาที่พบบ่อยที่สุดคือความไม่เท่ากันของสภาพแวดล้อม (Environment Inconsistency): 
          โปรแกรมเมอร์คนหนึ่งใช้ macOS กับ Node v20, อีกคนใช้ Windows กับ Node v18, 
          ในขณะที่ Production Server รันบน Linux Ubuntu ที่มี Library C++ ไม่ตรงกัน 
          ผลลัพธ์คือข้อผิดพลาดประหลาดที่ยากต่อการแก้
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-3">
          <strong>Docker เข้ามาแก้ปัญหานี้ด้วยการแปลง Application และ Environment ทั้งหมด</strong> 
          (OS runtime, libraries, config, dependencies) ให้กลายเป็น <em>Immutable Container Image</em> 
          ทำให้สามารถการันตีได้ 100% ว่าสิ่งที่เราทดสอบในเครื่อง Local จะทำงานแบบเดียวกันทุกประการบน Cloud Server
        </p>
      </section>

      {/* Section 2: Environment Parity */}
      <section id="environment-parity" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          แนวคิด Environment Parity: Dev = Staging = Production
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
          ตามหลักการ The Twelve-Factor App ข้อที่ 10 (Dev/prod parity) การรักษาความเหมือนกันของระบบ 
          ลดเวลา Onboarding สมาชิกใหม่ในทีมจาก 3 วัน เหลือเพียง 10 นาที:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Time Gap ลดลง
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              โค้ดที่เขียนในวันนั้น สามารถนำไป Deploy สู่ Production ได้ภายในไม่กี่ชั่วโมง ไม่ต้องรอจัดเตรียมเซิร์ฟเวอร์
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Personnel Gap ลดลง
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              วิศวกรที่เขียนโค้ด เข้าใจโครงสร้าง Container Image เดียวกันกับที่ DevOps ดูแลบน Kubernetes
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Tools Gap ลดลง
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              ใช้ฐานข้อมูลเวอร์ชันจริง (เช่น PostgreSQL 16 Alpine ใน Docker) แทนการ Mock หรือใช้ SQLite คนละตัว
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Multi-Stage Concept */}
      <section id="multi-stage-concept" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          ความสำคัญของ Multi-stage Build ในระดับ Production
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          หากเราเขียน Dockerfile แบบขั้นตอนเดียว (Single Stage) ตัว Container Image จะต้องแบกทั้ง:
        </p>
        <ul className="list-disc pl-5 my-2 space-y-1 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          <li>เครื่องมือ Compiler (TypeScript, C++ build tools, Python)</li>
          <li>โฟลเดอร์ <code className="text-slate-800 dark:text-slate-200">node_modules</code> ขนาดมโหฬารที่มี DevDependencies เช่น ESLint, Vitest, Webpack</li>
          <li>ซอร์สโค้ดดิบและเอกสารต่างๆ</li>
        </ul>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-3">
          ส่งผลให้ขนาด Image ทะลุ 1.2 GB! ซึ่งดึงลง Server ช้าและมีช่องโหว่ความปลอดภัยสูง 
          การทำ <strong>Multi-stage Build</strong> จะแยกขั้นตอนออกเป็น 2 ช่วง:
          <strong>ช่วงที่ 1: Build Stage</strong> (มีเครื่องมือครบ) และ <strong>ช่วงที่ 2: Runner Stage</strong> 
          (หยิบเฉพาะไฟล์ dist สุดท้ายมาใส่ใน Image เล็กพิเศษ เช่น Alpine หรือ Distroless ขนาดเหลือเพียง 50-100 MB)
        </p>

        {/* Stack Viewer Widget */}
        <DockerStackViewer />
      </section>

      {/* Section 4: Node.js Multi-stage */}
      <section id="dockerfile-nodejs" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Dockerfile Multi-stage: Node.js (NestJS / Express Backend)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ตัวอย่าง Dockerfile สำหรับ Backend ที่ผ่านการปรับแต่งความเร็ว Layer Caching และความปลอดภัยระดับ Production:
        </p>

        <CodeBlock
          filename="backend/Dockerfile"
          language="dockerfile"
          code={`# ==========================================
# Stage 1: Build & TypeScript Compilation
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# เทคนิค Layer Caching: ก๊อปปี้ package files ก่อน
# Docker จะแคชขั้นตอนนี้ไว้ ไม่ต้องรัน npm ci ใหม่ถ้า dependencies ไม่เปลี่ยน
COPY package*.json ./

RUN npm ci

COPY . .

# คอมไพล์ TypeScript ออกเป็น JavaScript ในโฟลเดอร์ ./dist
RUN npm run build

# ลบ DevDependencies ออกเพื่อให้เหลือเฉพาะ Production dependencies
RUN npm prune --production

# ==========================================
# Stage 2: Production Minimal Image
# ==========================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# มาตรการความปลอดภัย: สลับเป็น Non-root user 'node' ที่ติดมากับ Alpine
USER node

# Copy ผลลัพธ์เฉพาะสิ่งที่จำเป็นจาก builder stage
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# รันด้วย node โดยตรง
CMD ["node", "dist/main.js"]`}
        />

        <Callout type="tip" title="เคล็ดลับ Layer Caching">
          อย่าใส่ <code className="text-slate-800 dark:text-slate-200">COPY . .</code> ไว้ก่อน <code className="text-slate-800 dark:text-slate-200">npm ci</code> 
          เพราะจะทำให้ทุกครั้งที่คุณแก้โค้ดเพียงบรรทัดเดียว Docker จะต้องดาวน์โหลด npm modules ใหม่ทั้งหมด 
          การแยก COPY package*.json ออกมาก่อนจะช่วยประหยัดเวลา build ไปได้มหาศาล!
        </Callout>
      </section>

      {/* Section 5: Angular Multi-stage */}
      <section id="dockerfile-angular" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Dockerfile Multi-stage: Angular (Frontend + Nginx Reverse Proxy)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          Angular เป็นแอปพลิเคชันฝั่ง Client ดังนั้นในระดับ Production เราไม่จำเป็นต้องใช้ Node.js รันเลย 
          แต่จะคอมไพล์ HTML/CSS/JS ออกมา แล้วส่งต่อให้ <strong>Nginx Alpine</strong> ซึ่งกิน RAM เพียง 15MB 
          และสามารถส่งไฟล์ Static ได้รวดเร็วที่สุด:
        </p>

        <CodeBlock
          filename="frontend/Dockerfile"
          language="dockerfile"
          code={`# ==========================================
# Stage 1: Angular Build Stage
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# รัน Production Build เพื่อทำ AOT, Tree-shaking, และ Minification
RUN npm run build -- --configuration=production

# ==========================================
# Stage 2: High Performance Nginx Web Server
# ==========================================
FROM nginx:alpine AS production

# ลบการตั้งค่าเดิมของ Nginx
RUN rm -rf /etc/nginx/conf.d/*

# ก๊อปปี้ nginx.conf ที่รองรับ SPA Routing Fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ก๊อปปี้ไฟล์ Static HTML/JS/CSS ที่ build เสร็จแล้ว
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# กำหนดสิทธิ์ความปลอดภัย
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`}
        />

        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-4 mb-2">
          ไฟล์ <code className="text-slate-800 dark:text-slate-200 font-mono">nginx.conf</code> สำหรับ Angular SPA 
          (สำคัญมาก เพื่อป้องกัน Error 404 เมื่อ User กด Refresh หน้าเว็บ):
        </p>

        <CodeBlock
          filename="frontend/nginx.conf"
          language="bash"
          code={`server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # SPA Routing Fallback: ส่งคำขอไปที่ index.html เพื่อให้ Angular Router จัดการ
    location / {
        try_files $uri $uri/ /index.html;
    }

    # เปิดใช้งาน Gzip Compression ลดขนาดไฟล์
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # แคช Static Assets ระยะยาว
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}`}
        />
      </section>

      {/* Section 6: docker-compose.yml */}
      <section id="docker-compose" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          docker-compose.yml เชื่อมโยง Fullstack + PostgreSQL พร้อม Healthcheck
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ไฟล์นี้ช่วยให้ Developer รันทั้ง Frontend, Backend, และ Database ได้ในคำสั่งเดียว 
          พร้อมกลไก <strong>Healthcheck</strong> ที่ป้องกันไม่ให้ Backend บูตก่อนที่ Database จะพร้อมรับ Connection:
        </p>

        <CodeBlock
          filename="docker-compose.yml"
          language="yaml"
          code={`version: '3.8'

services:
  # 1. Database: PostgreSQL 16 Alpine
  postgres:
    image: postgres:16-alpine
    container_name: dev_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_secure_password_2026
      POSTGRES_DB: enterprise_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev_user -d enterprise_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - dev_network

  # 2. Backend: Node.js API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: dev_backend
    restart: unless-stopped
    environment:
      PORT: 4000
      DATABASE_URL: postgresql://dev_user:dev_secure_password_2026@postgres:5432/enterprise_db
      NODE_ENV: production
    ports:
      - "4000:4000"
    depends_on:
      postgres:
        condition: service_healthy # รอให้ DB ตอบกลับว่าพร้อมทำงานก่อนเสมอ!
    networks:
      - dev_network

  # 3. Frontend: Angular Web Client
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: dev_frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - dev_network

volumes:
  postgres_data:
    driver: local

networks:
  dev_network:
    driver: bridge`}
        />
      </section>

      {/* Section 7: Team Workflow */}
      <section id="team-workflow" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Workflow และคำสั่งจำเป็นประจำวันสำหรับทีม
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono space-y-3">
            <div>
              <span className="text-slate-400 block text-[11px]"># เริ่มต้นรันทั้งระบบแบบ Background</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">$ docker compose up -d</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]"># บังคับ Build Image ใหม่เมื่อโค้ดเปลี่ยน</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">$ docker compose up --build -d</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]"># ดูสถานะและความสมบูรณ์ของทุก Container</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">$ docker compose ps</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm font-mono space-y-3">
            <div>
              <span className="text-slate-400 block text-[11px]"># ดู Live Log ของทุกเซอร์วิสแบบ Realtime</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">$ docker compose logs -f</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]"># สั่งหยุดการทำงานโดยยังรักษาข้อมูลใน Volume ไว้</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">$ docker compose down</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]"># ลบข้อมูลใน Database ทิ้งเพื่อเริ่มใหม่จากศูนย์</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">$ docker compose down -v</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Prompt */}
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
          สามารถคัดลอก Prompt ด้านล่างนี้ไปให้ AI ช่วยสร้าง Docker configurations หรือปรับใช้ในโปรเจกต์ของคุณ:
        </p>
        <pre className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
          {promptText}
        </pre>
      </section>
    </article>
  );
};
