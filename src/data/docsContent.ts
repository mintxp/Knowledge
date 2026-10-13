export interface NavItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  iconName: string;
  readingTime: string;
  lastUpdated: string;
  promptText: string;
  description: string;
  headings: { id: string; title: string; level: number }[];
}

export const DOCS_SECTIONS: NavItem[] = [
  {
    id: 'login-session-architecture',
    title: 'การออกแบบระบบ Login และ Session Management',
    shortTitle: 'Login & Session Management',
    category: 'Security & Architecture',
    iconName: 'ShieldCheck',
    readingTime: '9 นาที',
    lastUpdated: 'ตุลาคม 2026',
    promptText: `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับหัวข้อ 'การออกแบบระบบ Login และ Session Management' โดยให้อธิบาย:

ความแตกต่างระหว่าง JWT (JSON Web Token) และ Session-Cookie ว่าควรเลือกใช้อย่างไรในระบบยุคใหม่

Flow การทำงานตั้งแต่ User กรอกรหัสผ่าน จนถึงการเก็บ Token ในฝั่ง Frontend อย่างปลอดภัย (HttpOnly Cookie vs LocalStorage)

แนวทางการป้องกันเบื้องต้น (เช่น CSRF, XSS, Rate Limiting) พร้อมตัวอย่างโค้ดจำลอง`,
    description: 'เจาะลึกสถาปัตยกรรมการยืนยันตัวตน (Authentication) และการจัดการ Session ในระบบสมัยใหม่ เปรียบเทียบ JWT vs Session Cookie และแนวทางความปลอดภัยสูงสุดระดับ Production',
    headings: [
      { id: 'overview', title: 'บทนำ & ปัญหาที่พบบ่อย', level: 2 },
      { id: 'jwt-vs-session', title: 'เปรียบเทียบเชิงลึก: JWT vs Session-Cookie', level: 2 },
      { id: 'auth-flow', title: 'Flow การทำงานตั้งแต่ Login จนถึง Frontend Storage', level: 2 },
      { id: 'httponly-vs-localstorage', title: 'HttpOnly Cookie vs LocalStorage: เลือกใช้อย่างไร?', level: 3 },
      { id: 'security-defenses', title: 'แนวทางการป้องกันภัยคุกคาม (CSRF, XSS, Brute-force)', level: 2 },
      { id: 'implementation-code', title: 'ตัวอย่างโค้ดสถาปัตยกรรมระดับ Production (Node.js/Express)', level: 2 },
      { id: 'best-practices-checklist', title: 'Checklist สรุปข้อพึงปฏิบัติสำหรับทีม', level: 2 },
      { id: 'original-prompt', title: 'Prompt ต้นฉบับสำหรับ AI Generation', level: 2 }
    ]
  },
  {
    id: 'logging-audit-trail',
    title: 'การออกแบบระบบการเก็บบันทึกข้อมูล (Logging & Audit Trail)',
    shortTitle: 'Logging & Audit Trail',
    category: 'Observability & Compliance',
    iconName: 'FileText',
    readingTime: '11 นาที',
    lastUpdated: 'ตุลาคม 2026',
    promptText: `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับหัวข้อ 'การออกแบบระบบการเก็บบันทึกข้อมูล (Logging & Audit Trail)' โดยให้อธิบาย:

ประเภทของ Log ที่จำเป็นในระบบ (Error Log, Access Log, Audit Log สำหรับการทำธุรกรรมสำคัญ)

โครงสร้างข้อมูล (Data Structure / JSON Schema) ที่ควรเก็บ เช่น timestamp, user_id, action, ip_address, details

แนวปฏิบัติที่ดี (Best Practices) เช่น การไม่เก็บ Password หรือข้อมูลส่วนบุคคล (PDPA) ไว้ใน Log`,
    description: 'คู่มือออกแบบสถาปัตยกรรม Log และ Audit Trail มาตรฐานสากล รองรับการ Debug, Performance Monitoring และการปฏิบัติตามกฎหมาย PDPA/GDPR อย่างเคร่งครัด',
    headings: [
      { id: 'overview', title: 'บทนำ: ทำไม Log ที่มีคุณภาพจึงตัดสินความอยู่รอดของระบบ', level: 2 },
      { id: 'log-types', title: '3 ประเภทของ Log ที่จำเป็นในระบบ Enterprise', level: 2 },
      { id: 'json-schema', title: 'โครงสร้างข้อมูลมาตรฐาน (Unified JSON Log Schema)', level: 2 },
      { id: 'pdpa-masking', title: 'Best Practices & การ Masking ข้อมูลส่วนบุคคล (PDPA/GDPR)', level: 2 },
      { id: 'architecture-pipeline', title: 'สถาปัตยกรรม Log Shipping & Aggregation', level: 2 },
      { id: 'code-implementation', title: 'ตัวอย่างโค้ด Logger Middleware พร้อมระบบ Masking อัตโนมัติ', level: 2 },
      { id: 'summary-rules', title: 'กฎเหล็ก 6 ข้อสำหรับการทำ Logging', level: 2 },
      { id: 'original-prompt', title: 'Prompt ต้นฉบับสำหรับ AI Generation', level: 2 }
    ]
  },
  {
    id: 'docker-for-teams',
    title: 'การใช้งาน Docker สำหรับทีมพัฒนา',
    shortTitle: 'Docker สำหรับทีมพัฒนา',
    category: 'DevOps & Infrastructure',
    iconName: 'Container',
    readingTime: '10 นาที',
    lastUpdated: 'ตุลาคม 2026',
    promptText: `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับหัวข้อ 'การใช้งาน Docker สำหรับทีมพัฒนา' โดยมีเนื้อหา:

ประโยชน์ของการใช้ Docker เพื่อให้สภาพแวดล้อม (Environment) ของทุกคนในทีมเหมือนกัน (Dev = Staging = Production)

ตัวอย่าง Dockerfile แบบ Multi-stage build สำหรับ Node.js (Backend) และ Angular (Frontend)

ตัวอย่างการใช้ docker-compose.yml เพื่อรันแอปพลิเคชันร่วมกับฐานข้อมูล (เช่น PostgreSQL) พร้อมกันด้วยคำสั่งเดียว`,
    description: 'คู่มือขจัดปัญหา "Works on my machine" ด้วย Docker มาตรฐานสำหรับทีม พร้อมตัวอย่าง Multi-stage build สำหรับ Node.js และ Angular ตลอดจน docker-compose.yml ระดับ Production',
    headings: [
      { id: 'overview', title: 'ทำไมทีมวิศวกรซอฟต์แวร์ต้องใช้ Docker?', level: 2 },
      { id: 'environment-parity', title: 'แนวคิด Environment Parity: Dev = Staging = Production', level: 2 },
      { id: 'multi-stage-concept', title: 'ความสำคัญของ Multi-stage Build ในระดับ Production', level: 2 },
      { id: 'dockerfile-nodejs', title: 'Dockerfile Multi-stage: Node.js (NestJS / Express Backend)', level: 2 },
      { id: 'dockerfile-angular', title: 'Dockerfile Multi-stage: Angular (Frontend + Nginx)', level: 2 },
      { id: 'docker-compose', title: 'docker-compose.yml เชื่อมโยง Fullstack + PostgreSQL', level: 2 },
      { id: 'team-workflow', title: 'Workflow และคำสั่งจำเป็นประจำวันสำหรับทีม', level: 2 },
      { id: 'original-prompt', title: 'Prompt ต้นฉบับสำหรับ AI Generation', level: 2 }
    ]
  },
  {
    id: 'nodejs-production-guide',
    title: 'คู่มือพัฒนา Node.js & Express ระดับ Production (Clean Architecture)',
    shortTitle: 'Node.js Production Guide',
    category: 'Backend & Node.js',
    iconName: 'Server',
    readingTime: '15 นาที',
    lastUpdated: 'ตุลาคม 2026',
    promptText: `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับ Node.js ในหัวข้อ 'การออกแบบและพัฒนา Node.js & Express ระดับ Production' โดยครอบคลุม:
1. การวางโครงสร้างโปรเจกต์ (Clean Architecture, Folder Structure, TypeScript & tsconfig alias, Zod ENV Validation)
2. การตั้งค่า Web Server & Express.js (Security Middlewares: cors, helmet, Modular Routing, Graceful Shutdown)
3. การเชื่อมต่อฐานข้อมูลและ ORM (Prisma vs TypeORM vs Kysely, Connection Pooling, DB Migrations)
4. การจัดการ Error และ Standardized API Response (Custom AppError, Global Error Middleware, Production Stack Trace Hiding)
5. การจัดการ Authentication & Authorization (JWT Sign/Verify, Auth Middleware, RBAC checkRole)
6. ระบบบันทึก Log (Pino/Winston JSON Structured Logging, Log Levels, Correlation ID Tracking)
7. การทำ Input Validation & Sanitization (Zod Schema Validation, XSS & SQL Injection Defense)
8. การทำ Automated Testing & Docker Deployment (Vitest/Jest Testing, Multi-stage Dockerfile, /health & /readiness Endpoints)`,
    description: 'คู่มือฉบับสมบูรณ์ 8 หัวข้อหลักสำหรับการสร้าง Backend ด้วย Node.js, Express และ TypeScript ระดับ Production ตั้งแต่โครงสร้าง Clean Architecture, Security, Error Handling, ไปจนถึง Testing และ Deployment',
    headings: [
      { id: 'project-structure', title: '1. การวางโครงสร้างโปรเจกต์ (Clean Architecture & TypeScript)', level: 2 },
      { id: 'web-server-express', title: '2. การตั้งค่า Web Server & Express.js (Security & Graceful Shutdown)', level: 2 },
      { id: 'database-orm', title: '3. การเชื่อมต่อฐานข้อมูลและการทำ ORM (Connection Pool & Migrations)', level: 2 },
      { id: 'error-handling', title: '4. การจัดการ Error และ Standardized API Response', level: 2 },
      { id: 'auth-rbac', title: '5. การจัดการ Authentication & Authorization (JWT & RBAC)', level: 2 },
      { id: 'logging-observability', title: '6. ระบบบันทึก Log และ Correlation ID', level: 2 },
      { id: 'validation-sanitization', title: '7. การทำ Input Validation & Sanitization ด้วย Zod', level: 2 },
      { id: 'testing-deployment', title: '8. Automated Testing & Docker Deployment (/health endpoints)', level: 2 },
      { id: 'original-prompt', title: 'ตัวอย่าง Prompt สำหรับสั่งการ AI (Cursor / Claude)', level: 2 }
    ]
  },
  {
    id: 'cli-cheat-sheet',
    title: 'สรุปคำสั่งจำเป็นสำหรับ Docker และ Node.js (CLI Cheat Sheet)',
    shortTitle: 'สรุปคำสั่ง Docker & Node.js',
    category: 'Cheatsheet & Commands',
    iconName: 'Terminal',
    readingTime: '8 นาที',
    lastUpdated: 'ตุลาคม 2026',
    promptText: `ช่วยเขียนบทความคู่มือภาษาไทยในรูปแบบไฟล์ MDX สำหรับหัวข้อ 'สรุปคำสั่งจำเป็นสำหรับ Docker และ Node.js' โดยจัดทำเป็นตารางคำสั่งพร้อมคำอธิบายการใช้งาน:
1. ตารางคำสั่ง Docker: Container Management, Image, Docker Compose ประจำวัน, Debugging & Logs, Cleanup
2. ตารางคำสั่ง Node.js & NPM: Dependencies Management, Script Execution, Debugging, Prisma/DB Migration, Process Management
3. ตัวอย่างการใช้งานและข้อควรระวังในระดับ Production`,
    description: 'ตารางสรุปคำสั่งใช้งานจริงสำหรับ Docker และ Node.js รวบรวมคำสั่งประจำวันของทีมวิศวกรซอฟต์แวร์ พร้อมคำอธิบาย พารามิเตอร์ และปุ่มคัดลอกคำสั่งในคลิกเดียว',
    headings: [
      { id: 'docker-commands', title: '1. ตารางคำสั่ง Docker & Container Management', level: 2 },
      { id: 'docker-compose-commands', title: '2. ตารางคำสั่ง Docker Compose สำหรับทีม', level: 2 },
      { id: 'docker-troubleshooting', title: '3. ตารางคำสั่ง Debugging & System Cleanup ใน Docker', level: 2 },
      { id: 'nodejs-npm-commands', title: '4. ตารางคำสั่ง Node.js, NPM & Package Management', level: 2 },
      { id: 'nodejs-build-runtime', title: '5. ตารางคำสั่ง Build, Script Execution & Runtime', level: 2 },
      { id: 'prisma-db-commands', title: '6. ตารางคำสั่ง Database Migrations (Prisma/DB)', level: 2 },
      { id: 'production-tips', title: '7. ข้อควรระวังและ Best Practices ในการใช้ CLI บน Production', level: 2 },
      { id: 'original-prompt', title: 'ตัวอย่าง Prompt สำหรับ AI Generation', level: 2 }
    ]
  }
];
