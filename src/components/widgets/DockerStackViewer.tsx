import React, { useState } from 'react';
import { Layers, Check, Copy, Terminal, Server, Globe, Database } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export const DockerStackViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'node' | 'angular'>('compose');
  const [copied, setCopied] = useState(false);

  const snippets = {
    compose: {
      title: 'docker-compose.yml',
      lang: 'yaml',
      description: 'ประสานระบบ Fullstack: Angular Frontend + Node.js Backend + PostgreSQL พร้อม Healthcheck และ Persistent Volume',
      code: `version: '3.8'

services:
  # 1. Database Service: PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    container_name: app_postgres
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
      - internal_network

  # 2. Backend Service: Node.js / Express
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: app_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://dev_user:dev_secure_password_2026@postgres:5432/enterprise_db
      JWT_SECRET: super_jwt_secret_change_me_in_prod
    ports:
      - "4000:4000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - internal_network

  # 3. Frontend Service: Angular (Nginx Reverse Proxy)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: app_frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - internal_network

volumes:
  postgres_data:
    driver: local

networks:
  internal_network:
    driver: bridge`
    },
    node: {
      title: 'backend/Dockerfile (Node.js Multi-stage)',
      lang: 'dockerfile',
      description: 'Stage 1 (deps & build) แยกจาก Stage 2 (production runner) เพื่อขนาด Image ที่เล็ก < 120MB และความปลอดภัยสูงสุด',
      code: `# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# ติดตั้ง package files ก่อนเพื่อใช้ประโยชน์จาก Docker Layer Cache
COPY package*.json ./

# ติดตั้ง dependencies ทั้งหมดรวมถึง devDependencies
RUN npm ci

# Copy source code และทำ TypeScript Build
COPY . .
RUN npm run build

# ลบ devDependencies ออกเพื่อเตรียมพร้อมสำหรับ production
RUN npm prune --production

# ==========================================
# Stage 2: Production Distroless / Alpine Runner
# ==========================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# กำหนดสิทธิ์ Non-Root User เพื่อความปลอดภัยระดับ Enterprise
USER node

# Copy เฉพาะ node_modules ที่ถูกตัดทอน และ build output จาก Stage 1
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# ใช้ dumb-init หรือ node โดยตรงเพื่อจัดการ PID 1 signal handling
CMD ["node", "dist/main.js"]`
    },
    angular: {
      title: 'frontend/Dockerfile (Angular + Nginx)',
      lang: 'dockerfile',
      description: 'Stage 1 (Node.js Build Angular) -> Stage 2 (Nginx Alpine ขนาดจิ๋วเพียง 25MB พร้อม config SPA fallback)',
      code: `# ==========================================
# Stage 1: Build Angular SPA
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Build Angular ในโหมด Production (Tree-shaking, AOT, Minification)
RUN npm run build -- --configuration=production

# ==========================================
# Stage 2: Lightweight Nginx Web Server
# ==========================================
FROM nginx:alpine AS production

# ลบ default configuration ของ Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copy Custom Nginx Config สำหรับ Single Page Application (SPA Fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts จาก Stage 1 ไปยัง Nginx HTML directory
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# กำหนด Security Headers
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`
    }
  };

  const current = snippets[activeTab];

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Docker Interactive Multi-Stage & Compose Inspector
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สลับดูโครงสร้าง Multi-stage build แต่ละชั้นและการผูกเชื่อมโยงระบบ Fullstack
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-500" /> docker-compose.yml
          </button>
          <button
            onClick={() => setActiveTab('node')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'node'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-500" /> Node.js Backend
          </button>
          <button
            onClick={() => setActiveTab('angular')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'angular'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" /> Angular Frontend
          </button>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          {current.description}
        </p>
        <CodeBlock
          filename={current.title}
          language={current.lang}
          code={current.code}
        />
      </div>

      {/* Quick Terminal command block */}
      <div className="mt-3 p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-xs flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>$ docker compose up --build -d</span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          คำสั่งเดียวรันทั้ง 3 เซอร์วิสพร้อมเริ่มทำงานทันที
        </span>
      </div>
    </div>
  );
};
