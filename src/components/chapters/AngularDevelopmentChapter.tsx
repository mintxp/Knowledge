import React, { useState } from 'react';
import { Copy, Check, Globe, Sparkles, Terminal, Code2, Layers, Cpu, ShieldCheck, Container } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';

interface AngularDevelopmentChapterProps {
  promptText: string;
}

export const AngularDevelopmentChapter: React.FC<AngularDevelopmentChapterProps> = ({ promptText }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCli, setCopiedCli] = useState<string | null>(null);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const handleCopyCli = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCli(cmd);
      setTimeout(() => setCopiedCli(null), 1800);
    } catch {}
  };

  const angularCliCommands = [
    {
      cmd: 'ng new my-enterprise-app --standalone --routing --style=scss',
      desc: 'สร้างโปรเจกต์ใหม่แบบ Standalone Architecture พร้อม Routing และ SCSS'
    },
    {
      cmd: 'ng serve --port 4200 --open',
      desc: 'รัน Dev Server ที่พอร์ต 4200 พร้อมเปิดเบราว์เซอร์อัตโนมัติ'
    },
    {
      cmd: 'ng build --configuration production',
      desc: 'คอมไพล์สำหรับ Production (AOT, Tree-shaking, และ Minification)'
    },
    {
      cmd: 'ng g c features/user-profile --skip-tests',
      desc: 'สร้าง Standalone Component ใหม่ในโฟลเดอร์ features'
    },
    {
      cmd: 'ng g s core/services/auth --skip-tests',
      desc: 'สร้าง Injectable Service สำหรับจัดการ Authentication'
    },
    {
      cmd: 'ng g guard core/guards/auth --functional',
      desc: 'สร้าง Functional Route Guard (canActivate) ยุคใหม่'
    },
    {
      cmd: 'ng g interceptor core/interceptors/jwt --functional',
      desc: 'สร้าง Functional HTTP Interceptor สำหรับดักจับและแนบ Token'
    }
  ];

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 mb-2">
          <span>สถาปัตยกรรม Frontend & Web Applications</span>
          <span aria-hidden="true">·</span>
          <span>Modern Angular Architecture (Signals & Standalone)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          คู่มือพัฒนา Software ด้วย Angular (Modern Architecture)
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือสร้างเว็บแอปพลิเคชันระดับ Enterprise ด้วย Angular ยุคใหม่: 
          ก้าวข้าม NgModule สู่ Standalone Components, การบริหารจัดการ State ด้วย Angular Signals, 
          การเขียน Functional HTTP Interceptor แนบ JWT, Route Guards และการแพ็กเกจด้วย Docker Nginx
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 14 นาที</span>
          <span aria-hidden="true">·</span>
          <span>Angular v18+ Modern</span>
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

      {/* 1. Angular CLI Table */}
      <section id="angular-cli" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-rose-500" />
          1. ตารางคำสั่ง Angular CLI ที่จำเป็น
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          คำสั่ง Command Line Interface สำหรับสร้างและพัฒนา Angular Application:
        </p>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <th className="p-3 font-semibold w-1/2">คำสั่ง (Command)</th>
                <th className="p-3 font-semibold w-1/2">คำอธิบายการทำงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {angularCliCommands.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                  <td className="p-3 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <code className="font-mono text-xs text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                        {item.cmd}
                      </code>
                      <button
                        onClick={() => handleCopyCli(item.cmd)}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                        title="คัดลอกคำสั่ง"
                      >
                        {copiedCli === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 align-top text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Clean Architecture */}
      <section id="clean-architecture" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          2. โครงสร้างโปรเจกต์ Modern Angular (Core, Features, Shared)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          การจัดโฟลเดอร์สำหรับโปรเจกต์สเกลใหญ่เพื่อความยืดหยุ่นและการทำ Code Splitting:
        </p>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-emerald-400">src/app/</div>
          <div className="pl-4 text-slate-300">├── core/              <span className="text-slate-500"># Singleton Services, Auth Interceptor, Guards (โหลดครั้งเดียว)</span></div>
          <div className="pl-8 text-slate-400">├── guards/         <span className="text-slate-500"># auth.guard.ts</span></div>
          <div className="pl-8 text-slate-400">├── interceptors/    <span className="text-slate-500"># jwt.interceptor.ts, error.interceptor.ts</span></div>
          <div className="pl-8 text-slate-400">└── services/        <span className="text-slate-500"># auth.service.ts, theme.service.ts</span></div>
          <div className="pl-4 text-slate-300">├── features/          <span className="text-slate-500"># Feature Modules (Lazy-loaded ทั้งหมด)</span></div>
          <div className="pl-8 text-slate-400">├── dashboard/      <span className="text-slate-500"># dashboard.component.ts</span></div>
          <div className="pl-8 text-slate-400">├── products/       <span className="text-slate-500"># product-list.component.ts, product-detail.component.ts</span></div>
          <div className="pl-8 text-slate-400">└── auth/           <span className="text-slate-500"># login.component.ts</span></div>
          <div className="pl-4 text-slate-300">├── shared/            <span className="text-slate-500"># Reusable UI Components, Pipes, Directives (UI Kit)</span></div>
          <div className="pl-8 text-slate-400">├── components/     <span className="text-slate-500"># button, modal, card, navbar</span></div>
          <div className="pl-8 text-slate-400">└── pipes/          <span className="text-slate-500"># thai-date.pipe.ts, currency.pipe.ts</span></div>
          <div className="pl-4 text-slate-300">├── app.routes.ts      <span className="text-slate-500"># ประกาศ Route แผนที่ระบบ</span></div>
          <div className="pl-4 text-slate-300">├── app.config.ts      <span className="text-slate-500"># Application Providers (HTTP, Router, Animations)</span></div>
          <div className="pl-4 text-slate-300">└── app.component.ts   <span className="text-slate-500"># Root Shell Component</span></div>
        </div>
      </section>

      {/* 3. Standalone Components */}
      <section id="standalone-components" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          3. สถาปัตยกรรม Standalone Components (ไร้ NgModule)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          ใน Angular เวอร์ชันปัจจุบัน เราไม่จำเป็นต้องประกาศโมดูล <code className="font-mono text-xs">@NgModule</code> อีกต่อไป 
          ทุก Component สามารถระบุ <code className="font-mono text-xs">standalone: true</code> และ import สิ่งที่ตัวเองต้องการใช้ได้โดยตรง:
        </p>

        <CodeBlock
          filename="src/app/features/products/product-card.component.ts"
          language="typescript"
          code={`import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="product-card border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900">
      <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ product().name }}</h3>
      <p class="text-emerald-600 font-semibold">{{ product().price | currency:'THB':'symbol':'1.0-0' }}</p>
      <button 
        (click)="addToCart.emit(product())" 
        class="mt-3 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded">
        เพิ่มลงตะกร้า
      </button>
    </div>
  \`
})
export class ProductCardComponent {
  // Angular Modern Signal Inputs & Outputs
  product = input.required<Product>();
  addToCart = output<Product>();
}`}
        />
      </section>

      {/* 4. Signals vs RxJS */}
      <section id="signals-state" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-500" />
          4. การจัดการ State ด้วย Angular Signals เทียบกับ RxJS
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          <strong>Signals</strong> คือโมเดล Reactive ล่าสุดที่ช่วยให้ Angular อัปเดต DOM แบบ Fine-grained 
          ไม่ต้องพึ่งพา <code className="font-mono text-xs">zone.js</code> เช็คทั้งต้นไม้ DOM เหมือนแต่ก่อน:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 text-xs sm:text-sm">
            <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">เมื่อไหร่ควรใช้ Signals?</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• UI State ในหน้าจอ (เช่น loading, isModalOpen, filter)</li>
              <li>• ค่าคำนวณที่อิงจาก State อื่นผ่าน <code className="font-mono text-xs">computed()</code></li>
              <li>• ส่งข้อมูลระหว่าง Parent กับ Child ผ่าน <code className="font-mono text-xs">input()</code> / <code className="font-mono text-xs">output()</code></li>
              <li>• Synchronous Data ภายใน Component</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 text-xs sm:text-sm">
            <h4 className="font-semibold text-rose-700 dark:text-rose-400 mb-2">เมื่อไหร่ยังต้องใช้ RxJS?</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• การจัดการคำขอ Asynchronous ที่ต้อง Cancelling ได้ (เช่น Search Typeahead ด้วย <code className="font-mono text-xs">switchMap</code>)</li>
              <li>• การดักจับ Event สตรีมที่มี Time-based operators (<code className="font-mono text-xs">debounceTime</code>, <code className="font-mono text-xs">throttle</code>)</li>
              <li>• WebSocket Streams และ Real-time push events</li>
            </ul>
          </div>
        </div>

        <CodeBlock
          filename="src/app/features/cart/cart.service.ts"
          language="typescript"
          code={`import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // 1. Writable Signal: จัดเก็บรายการสินค้าในตะกร้า
  private itemsSignal = signal<CartItem[]>([]);
  readonly items = this.itemsSignal.asReadonly();

  // 2. Computed Signal: คำนวณจำนวนชิ้นและราคารวมอัตโนมัติเมื่อ itemsSignal เปลี่ยนแปลง
  readonly totalItemsCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  addItem(newItem: Omit<CartItem, 'quantity'>) {
    this.itemsSignal.update((current) => {
      const existing = current.find((i) => i.id === newItem.id);
      if (existing) {
        return current.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  }
}`}
        />
      </section>

      {/* 5. HTTP Interceptors */}
      <section id="http-interceptors" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          5. Functional HTTP Interceptor (JWT & Error Handling)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          ใน Angular ยุคใหม่ ไม่ต้องสร้าง Class ที่ implement <code className="font-mono text-xs">HttpInterceptor</code> อีกแล้ว 
          แต่ใช้ <strong>Functional Interceptor</strong> ที่กะทัดรัดและ Type-safe:
        </p>

        <CodeBlock
          filename="src/app/core/interceptors/jwt.interceptor.ts"
          language="typescript"
          code={`import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  // แนบ Bearer Token เข้า Authorization Header
  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: \`Bearer \${token}\`
      }
    });
  }

  // ดักจับ Error ตอบกลับจากเซิร์ฟเวอร์
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token หมดอายุ นำทางไปหน้า Login
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};`}
        />
      </section>

      {/* 6. Routing Guards */}
      <section id="routing-guards" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
          6. Routing แบบ Lazy Loading & Functional Guards
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          การกำหนด Route ด้วย <code className="font-mono text-xs">loadComponent</code> เพื่อโหลดโค้ดเฉพาะเมื่อผู้ใช้เข้าหน้านั้นจริง 
          ช่วยลดขนาด Initial Bundle ได้มหาศาล:
        </p>

        <CodeBlock
          filename="src/app/app.routes.ts"
          language="typescript"
          code={`import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

// Functional Route Guard
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/auth/login');
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent)
  }
];`}
        />
      </section>

      {/* 7. Docker Multi-stage for Angular */}
      <section id="production-docker" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Container className="w-5 h-5 text-cyan-500" />
          7. Docker Multi-stage & Nginx Configuration สำหรับ Angular
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Angular เป็น Client-side SPA ดังนั้นใน Production จึงเสิร์ฟด้วย <strong>Nginx Alpine</strong> 
          ที่มีขนาดเพียง 25MB พร้อมแก้ปัญหา 404 เมื่อ User กดรีเฟรชหน้าเว็บ:
        </p>

        <CodeBlock
          filename="Dockerfile"
          language="dockerfile"
          code={`# Stage 1: Build Angular SPA
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/*/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
        />
      </section>

      {/* Prompt */}
      <section id="original-prompt" className="scroll-mt-24 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Prompt สำหรับสร้างหรือขยายโค้ดสถาปัตยกรรม Angular
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
