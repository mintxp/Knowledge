import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, Search, Filter, AlertTriangle, ShieldCheck, Container, Server, Database } from 'lucide-react';
import { Callout } from '../Callout';

interface CliCheatSheetChapterProps {
  promptText: string;
}

interface CommandItem {
  command: string;
  category: 'docker' | 'compose' | 'node' | 'db';
  description: string;
  exampleScenario: string;
  badge?: 'safe' | 'caution' | 'danger' | 'prod';
}

export const CliCheatSheetChapter: React.FC<CliCheatSheetChapterProps> = ({ promptText }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'docker' | 'compose' | 'node' | 'db'>('all');

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd(null), 1800);
    } catch {}
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  // 1. Docker Core Commands
  const dockerCommands: CommandItem[] = [
    {
      command: 'docker run -d -p 3000:3000 --name web_app node_img',
      category: 'docker',
      description: 'รัน Container ในโหมด Background (-d) พร้อม Forward Port และตั้งชื่อ',
      exampleScenario: 'เริ่มต้นรัน Container เดี่ยวสำหรับทดสอบแอปพลิเคชัน',
      badge: 'safe'
    },
    {
      command: 'docker ps',
      category: 'docker',
      description: 'แสดงรายการ Container ที่กำลังรันอยู่ ณ ปัจจุบัน (Running containers)',
      exampleScenario: 'ตรวจสอบว่า Container ตัวไหนทำงานอยู่บ้างและใช้ Port อะไร',
      badge: 'safe'
    },
    {
      command: 'docker ps -a',
      category: 'docker',
      description: 'แสดงรายการ Container ทั้งหมดรวมถึงตัวที่หยุดทำงานแล้ว (Exited/Stopped)',
      exampleScenario: 'ใช้ตรวจสอบ Container ที่อาจจะแครช (Crash) หรือหยุดทำงานผิดปกติ',
      badge: 'safe'
    },
    {
      command: 'docker stop <container_id_or_name>',
      category: 'docker',
      description: 'สั่งหยุด Container แบบปลอดภัย โดยส่งสัญญาณ SIGTERM ก่อนตัดการทำงาน',
      exampleScenario: 'ใช้หยุดการทำงานของเซิร์ฟเวอร์โดยไม่ทำให้ข้อมูลใน process เสียหาย',
      badge: 'safe'
    },
    {
      command: 'docker build -t my_app:1.0.0 .',
      category: 'docker',
      description: 'สร้าง (Build) Docker Image จาก Dockerfile ในโฟลเดอร์ปัจจุบัน พร้อมตั้งชื่อ Tag',
      exampleScenario: 'ใช้ตอนพัฒนาเสร็จและต้องการแพ็กเกจเป็น Image เพื่อ Deploy',
      badge: 'safe'
    },
    {
      command: 'docker images',
      category: 'docker',
      description: 'แสดงรายการ Docker Images ทั้งหมดที่มีอยู่ในเครื่อง Local พร้อมขนาดพื้นที่',
      exampleScenario: 'ตรวจสอบขนาด Image และ Image ID ที่มีอยู่',
      badge: 'safe'
    },
    {
      command: 'docker exec -it <container> sh',
      category: 'docker',
      description: 'เปิด Interactive Terminal เข้าไปภายใน Container (ใช้ sh หรือ bash)',
      exampleScenario: 'ใช้ Debugging ภายใน Container เช่น ตรวจสอบไฟล์ config หรือ ping หา DB',
      badge: 'safe'
    },
    {
      command: 'docker logs -f --tail 100 <container>',
      category: 'docker',
      description: 'ดู Log สดแบบเรียลไทม์ (-f) โดยดึง 100 บรรทัดล่าสุดออกมาแสดง',
      exampleScenario: 'ใช้ส่องดู Error หรือ Request ล่าสุดขณะกำลังทดสอบระบบ',
      badge: 'safe'
    },
    {
      command: 'docker rm -f <container>',
      category: 'docker',
      description: 'บังคับลบ Container แม้กำลังรันอยู่ (Force remove)',
      exampleScenario: 'ลบ Container เก่าที่ไม่ได้ใช้งานทิ้งเพื่อคืนชื่อหรือ Port',
      badge: 'caution'
    },
    {
      command: 'docker rmi <image_id_or_name>',
      category: 'docker',
      description: 'ลบ Docker Image ออกจากเครื่อง Local',
      exampleScenario: 'เคลียร์พื้นที่ฮาร์ดดิสก์เมื่อมี Image เก่าที่ไม่ได้ใช้สะสมมากเกินไป',
      badge: 'caution'
    }
  ];

  // 2. Docker Compose Commands
  const composeCommands: CommandItem[] = [
    {
      command: 'docker compose up -d',
      category: 'compose',
      description: 'สั่งสตาร์ตทุกเซอร์วิสใน docker-compose.yml ในโหมด Background',
      exampleScenario: 'เริ่มต้นวันทำงาน: สั่งรัน Fullstack + DB ในคำสั่งเดียว',
      badge: 'safe'
    },
    {
      command: 'docker compose up --build -d',
      category: 'compose',
      description: 'บังคับคอมไพล์ Build Docker Image ใหม่ทั้งหมดก่อนรัน Background',
      exampleScenario: 'ใช้เมื่อมีการแก้ไขโค้ดหรือ dependencies และต้องการทดสอบเวอร์ชันล่าสุด',
      badge: 'safe'
    },
    {
      command: 'docker compose down',
      category: 'compose',
      description: 'หยุดและลบ Container, Network ที่สร้างขึ้นโดย compose (ยังเก็บ Volume ไว้)',
      exampleScenario: 'เลิกงาน หรือต้องการรีเซ็ตสถานะเครือข่าย Container ให้สะอาด',
      badge: 'safe'
    },
    {
      command: 'docker compose down -v',
      category: 'compose',
      description: 'หยุด Container พร้อมลบ Persistent Volumes ทั้งหมดทิ้ง (ข้อมูลหาย)',
      exampleScenario: 'ต้องการรีเซ็ต Database ใหม่หมดจดจากศูนย์ (ห้ามรันบน Production เด็ดขาด!)',
      badge: 'danger'
    },
    {
      command: 'docker compose logs -f <service_name>',
      category: 'compose',
      description: 'ส่องดู Log แบบ Realtime เฉพาะเซอร์วิสที่ระบุ เช่น backend หรือ postgres',
      exampleScenario: 'ใช้ตอนกำลังพัฒนา API เพื่อดู Error เฉพาะฝั่ง Backend',
      badge: 'safe'
    },
    {
      command: 'docker compose ps',
      category: 'compose',
      description: 'ดูสถานะ (State) และ Healthcheck ของทุกเซอร์วิสในโปรเจกต์',
      exampleScenario: 'ตรวจสอบว่า DB ขึ้นสถานะ healthy หรือยัง และ Backend พร้อมหรือยัง',
      badge: 'safe'
    },
    {
      command: 'docker compose restart <service_name>',
      category: 'compose',
      description: 'สั่งรีสตาร์ตเซอร์วิสที่ระบุตัวเดียวโดยไม่ต้องรันทั้งสแต็กใหม่',
      exampleScenario: 'รีสตาร์ตเฉพาะ Backend หลังจากแก้การตั้งค่า ENV',
      badge: 'safe'
    },
    {
      command: 'docker compose exec <service> sh',
      category: 'compose',
      description: 'เปิด Shell เข้าไปยังเซอร์วิสที่ระบุใน compose สภาพแวดล้อมเครือข่ายเดียวกัน',
      exampleScenario: 'เข้าไปรันคำสั่ง DB Migration หรือเข้า psql CLI ภายใน DB Container',
      badge: 'safe'
    }
  ];

  // 3. Docker Troubleshooting & Clean
  const dockerCleanupCommands: CommandItem[] = [
    {
      command: 'docker system prune -a --volumes',
      category: 'docker',
      description: 'ล้างแคชระบบแบบหมดจด: ลบ Image ที่ไม่ได้ใช้, Container ที่หยุด, และ Volume',
      exampleScenario: 'ฮาร์ดดิสก์เต็ม ต้องการคืนพื้นที่นับสิบ GB (ควรสำรองข้อมูล DB ก่อน)',
      badge: 'danger'
    },
    {
      command: 'docker stats',
      category: 'docker',
      description: 'แสดงสถานะการใช้งาน CPU, RAM, Network I/O ของแต่ละ Container แบบเรียลไทม์',
      exampleScenario: 'ตรวจสอบว่า Container ตัวไหนกิน RAM ผิดปกติจนระบบหน่วง',
      badge: 'safe'
    },
    {
      command: 'docker inspect <container>',
      category: 'docker',
      description: 'แสดงข้อมูลเชิงลึกแบบละเอียด (JSON) เช่น IP Address, Mounted Volumes, Env',
      exampleScenario: 'ตรวจสอบ IP ภายใน Container เพื่อดูการเชื่อมต่อ Network',
      badge: 'safe'
    }
  ];

  // 4. Node.js & NPM Commands
  const nodeCommands: CommandItem[] = [
    {
      command: 'npm init -y',
      category: 'node',
      description: 'สร้างไฟล์ package.json เริ่มต้นพร้อมค่า default ทันที',
      exampleScenario: 'เริ่มต้นโปรเจกต์ Node.js ใหม่จากโฟลเดอร์ว่าง',
      badge: 'safe'
    },
    {
      command: 'npm install <package_name>',
      category: 'node',
      description: 'ติดตั้งแพ็กเกจลง dependencies และบันทึกเข้า package.json',
      exampleScenario: 'ติดตั้ง library สำหรับใช้งานใน runtime เช่น express, dotenv, cors',
      badge: 'safe'
    },
    {
      command: 'npm install -D <package_name>',
      category: 'node',
      description: 'ติดตั้งแพ็กเกจเป็น DevDependencies (ใช้เฉพาะตอน Develop & Build)',
      exampleScenario: 'ติดตั้งเครื่องมือช่วยเขียนโค้ด เช่น typescript, vitest, @types/node',
      badge: 'safe'
    },
    {
      command: 'npm ci',
      category: 'node',
      description: 'Clean Install ติดตั้ง dependencies ตรงตาม package-lock.json 100%',
      exampleScenario: 'จำเป็นต้องใช้ใน CI/CD Pipeline และ Production Dockerfile เสมอ ห้ามใช้ npm install',
      badge: 'prod'
    },
    {
      command: 'npm outdated',
      category: 'node',
      description: 'ตรวจสอบเวอร์ชันของแพ็กเกจทั้งหมดเทียบกับเวอร์ชันล่าสุดใน npm registry',
      exampleScenario: 'เตรียมแผนอัปเกรด dependencies ประจำสปรินต์',
      badge: 'safe'
    },
    {
      command: 'npm update',
      category: 'node',
      description: 'อัปเดตแพ็กเกจให้เป็นเวอร์ชันล่าสุดตามขอบเขต SemVer ที่กำหนดใน package.json',
      exampleScenario: 'อัปเดต patch หรือ minor fixes สำหรับความปลอดภัย',
      badge: 'safe'
    },
    {
      command: 'npm audit fix',
      category: 'node',
      description: 'สแกนและแก้ไขช่องโหว่ความปลอดภัย (Vulnerabilities) ใน dependencies อัตโนมัติ',
      exampleScenario: 'เมื่อระบบเตือนว่ามีช่องโหว่ระดับ High หรือ Critical ใน dependency',
      badge: 'caution'
    },
    {
      command: 'npm run dev',
      category: 'node',
      description: 'รันสคริปต์ในโหมดพัฒนา (มักผูกกับ tsx watch หรือ nodemon)',
      exampleScenario: 'เริ่มเขียนโค้ดประจำวัน เซิร์ฟเวอร์จะ reload อัตโนมัติเมื่อแก้ไฟล์',
      badge: 'safe'
    },
    {
      command: 'npm run build',
      category: 'node',
      description: 'คอมไพล์ TypeScript เป็น JavaScript ลงโฟลเดอร์ dist ก่อน deploy',
      exampleScenario: 'เตรียม Artifact ก่อนส่งขึ้น Docker หรือ Staging',
      badge: 'safe'
    },
    {
      command: 'npm run lint',
      category: 'node',
      description: 'ตรวจสอบ Syntax, Type Checking (tsc --noEmit) และ Code Quality',
      exampleScenario: 'รันก่อนทำการ Git Commit หรือใน Pre-commit Git Hook',
      badge: 'safe'
    },
    {
      command: 'npx tsx watch src/server.ts',
      category: 'node',
      description: 'รันไฟล์ TypeScript ทันทีโดยไม่ต้อง compile พร้อม Auto-restart เมื่อไฟล์เปลี่ยน',
      exampleScenario: 'ทางเลือกที่ดีที่สุดและเร็วกว่า ts-node สำหรับการ Develop ยุคใหม่',
      badge: 'safe'
    },
    {
      command: 'node --inspect dist/main.js',
      category: 'node',
      description: 'เปิดโหมด Node.js Inspector เพื่อเชื่อมต่อกับ Chrome DevTools สำหรับ Debugging',
      exampleScenario: 'ไล่หาสาเหตุ Memory Leak หรือดักจับ Breakpoint ในโปรเจกต์',
      badge: 'safe'
    }
  ];

  // 5. Database & Migration Commands (Prisma)
  const dbCommands: CommandItem[] = [
    {
      command: 'npx prisma migrate dev --name <migration_name>',
      category: 'db',
      description: 'สร้าง Migration File ใหม่ตาม schema.prisma และรันอัปเดต DB (โหมด Dev)',
      exampleScenario: 'เมื่อแก้ไขตาราง เพิ่มฟิลด์ใหม่ใน Local Environment',
      badge: 'safe'
    },
    {
      command: 'npx prisma migrate deploy',
      category: 'db',
      description: 'รันเฉพาะ Migration ที่ยังไม่ได้ Apply โดยไม่สร้างไฟล์ใหม่และไม่ถามยืนยัน',
      exampleScenario: 'คำสั่งเดียวที่อนุญาตให้ใช้บน Production & Staging ใน CI/CD Pipeline',
      badge: 'prod'
    },
    {
      command: 'npx prisma generate',
      category: 'db',
      description: 'สร้าง Type Definition และ Prisma Client อัตโนมัติจากไฟล์ Schema',
      exampleScenario: 'รันหลังการแก้ schema หรือหลังรัน npm install เพื่อให้ได้ Type-safe',
      badge: 'safe'
    },
    {
      command: 'npx prisma studio',
      category: 'db',
      description: 'เปิดเว็บ UI สำหรับดูและแก้ไขข้อมูลในฐานข้อมูลผ่านเบราว์เซอร์ที่พอร์ต 5555',
      exampleScenario: 'ใช้ตรวจสอบข้อมูลใน DB สะดวกสบายโดยไม่ต้องเปิดโปรแกรมภายนอกอย่าง DBeaver',
      badge: 'safe'
    },
    {
      command: 'npx prisma db push',
      category: 'db',
      description: 'ซิงค์ schema.prisma เข้าสู่ฐานข้อมูลโดยตรงโดยไม่สร้างไฟล์ประวัติ Migration',
      exampleScenario: 'ใช้สำหรับการ Prototype เร็วๆ ในระยะเริ่มต้น (ห้ามใช้บน Production)',
      badge: 'caution'
    }
  ];

  const allCommands = [
    ...dockerCommands,
    ...composeCommands,
    ...dockerCleanupCommands,
    ...nodeCommands,
    ...dbCommands
  ];

  const filteredCommands = allCommands.filter((item) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'docker' && item.category === 'docker') ||
      (activeFilter === 'compose' && item.category === 'compose') ||
      (activeFilter === 'node' && item.category === 'node') ||
      (activeFilter === 'db' && item.category === 'db');

    const matchesSearch =
      searchTerm.trim() === '' ||
      item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleScenario.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'danger':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900';
      case 'caution':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900';
      case 'prod':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900';
      case 'safe':
      default:
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900';
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'danger':
        return 'เสี่ยงสูง (ระวังข้อมูลหาย)';
      case 'caution':
        return 'ต้องระวัง';
      case 'prod':
        return 'ใช้บน Production';
      case 'safe':
      default:
        return 'ปลอดภัย';
    }
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-2">
          <span>คู่มืออ้างอิงคำสั่ง & คีย์เวิร์ด</span>
          <span aria-hidden="true">·</span>
          <span>Docker & Node.js CLI Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          สรุปคำสั่งจำเป็นสำหรับ Docker และ Node.js (CLI Cheat Sheet)
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          ตารางสรุปคำสั่งที่ใช้งานจริงและพบบ่อยที่สุดของทีมวิศวกรซอฟต์แวร์ รวบรวมตั้งแต่การจัดการ Container, 
          Docker Compose, การบริหาร Node.js/NPM Packages, สคริปต์ Build/Runtime ไปจนถึงคำสั่ง Database Migrations 
          พร้อมคำอธิบายบริบทและปุ่มคัดลอกในคลิกเดียว
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>คำสั่งทั้งหมด {allCommands.length} คำสั่ง</span>
          <span aria-hidden="true">·</span>
          <span>ค้นหาและกรองข้อมูลได้ทันที</span>
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

      {/* Interactive Search & Filter Bar */}
      <div className="my-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="พิมพ์ค้นหาคำสั่ง เช่น prune, compose, migrate, ci, logs..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({allCommands.length})
            </button>
            <button
              onClick={() => setActiveFilter('docker')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'docker'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Docker Core ({dockerCommands.length + dockerCleanupCommands.length})
            </button>
            <button
              onClick={() => setActiveFilter('compose')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'compose'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Docker Compose ({composeCommands.length})
            </button>
            <button
              onClick={() => setActiveFilter('node')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'node'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Node.js & NPM ({nodeCommands.length})
            </button>
            <button
              onClick={() => setActiveFilter('db')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'db'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              DB Migrations ({dbCommands.length})
            </button>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>พบ {filteredCommands.length} คำสั่งที่ตรงกับการค้นหา</span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}
      </div>

      {/* Render Command Table Function */}
      {searchTerm || activeFilter !== 'all' ? (
        /* Filtered View */
        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                <th className="p-3 font-semibold w-1/5">สถานการณ์ / ความปลอดภัย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {filteredCommands.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                        {item.command}
                      </code>
                      <button
                        onClick={() => handleCopyCommand(item.command)}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                        title="คัดลอกคำสั่ง"
                      >
                        {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 align-top text-xs leading-relaxed">
                    <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                  </td>
                  <td className="p-3 align-top text-xs">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                      {getBadgeLabel(item.badge)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Categorized Full Views */
        <div className="space-y-12">
          {/* Section 1: Docker Core */}
          <section id="docker-commands" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Container className="w-5 h-5 text-cyan-500" />
              1. ตารางคำสั่ง Docker & Container Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              คำสั่งพื้นฐานสำหรับการจัดการ Container และ Image ในเครื่อง Local
            </p>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                    <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                    <th className="p-3 font-semibold w-1/5">ระดับความปลอดภัย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {dockerCommands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-xs text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                            {item.command}
                          </code>
                          <button
                            onClick={() => handleCopyCommand(item.command)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            title="คัดลอกคำสั่ง"
                          >
                            {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 align-top text-xs leading-relaxed">
                        <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                      </td>
                      <td className="p-3 align-top text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                          {getBadgeLabel(item.badge)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Docker Compose */}
          <section id="docker-compose-commands" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              2. ตารางคำสั่ง Docker Compose สำหรับทีมพัฒนา
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              คำสั่งที่ทีมวิศวกรซอฟต์แวร์ต้องใช้เป็นประจำทุกวันสำหรับรัน Fullstack สแต็ก
            </p>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                    <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                    <th className="p-3 font-semibold w-1/5">ระดับความปลอดภัย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {composeCommands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                            {item.command}
                          </code>
                          <button
                            onClick={() => handleCopyCommand(item.command)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            title="คัดลอกคำสั่ง"
                          >
                            {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 align-top text-xs leading-relaxed">
                        <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                      </td>
                      <td className="p-3 align-top text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                          {getBadgeLabel(item.badge)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Docker Troubleshooting */}
          <section id="docker-troubleshooting" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              3. ตารางคำสั่ง Debugging & System Cleanup ใน Docker
            </h2>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                    <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                    <th className="p-3 font-semibold w-1/5">ระดับความปลอดภัย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {dockerCleanupCommands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-xs text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                            {item.command}
                          </code>
                          <button
                            onClick={() => handleCopyCommand(item.command)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            title="คัดลอกคำสั่ง"
                          >
                            {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 align-top text-xs leading-relaxed">
                        <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                      </td>
                      <td className="p-3 align-top text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                          {getBadgeLabel(item.badge)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Node.js & NPM */}
          <section id="nodejs-npm-commands" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-500" />
              4. ตารางคำสั่ง Node.js, NPM & Package Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              คำสั่งบริหารจัดการ Dependencies, แพ็กเกจ และการตรวจสอบความปลอดภัยของโปรเจกต์
            </p>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                    <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                    <th className="p-3 font-semibold w-1/5">ประเภท</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {nodeCommands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-xs text-emerald-700 dark:text-emerald-300 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                            {item.command}
                          </code>
                          <button
                            onClick={() => handleCopyCommand(item.command)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            title="คัดลอกคำสั่ง"
                          >
                            {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 align-top text-xs leading-relaxed">
                        <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                      </td>
                      <td className="p-3 align-top text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                          {getBadgeLabel(item.badge)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: DB Migrations (Prisma) */}
          <section id="prisma-db-commands" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-violet-500" />
              5. ตารางคำสั่ง Database Migrations (Prisma / ORM)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              คำสั่งควบคุม Schema และการรัน Migration ที่ปลอดภัยทั้งใน Local และ Production
            </p>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <th className="p-3 font-semibold w-2/5">คำสั่ง (Command)</th>
                    <th className="p-3 font-semibold w-2/5">คำอธิบายการใช้งาน</th>
                    <th className="p-3 font-semibold w-1/5">ประเภท</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {dbCommands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <code className="font-mono text-xs text-violet-700 dark:text-violet-300 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                            {item.command}
                          </code>
                          <button
                            onClick={() => handleCopyCommand(item.command)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            title="คัดลอกคำสั่ง"
                          >
                            {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 align-top text-xs leading-relaxed">
                        <div className="font-medium text-slate-900 dark:text-slate-200 mb-1">{item.description}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>บริบท:</strong> {item.exampleScenario}</div>
                      </td>
                      <td className="p-3 align-top text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getBadgeStyle(item.badge)}`}>
                          {getBadgeLabel(item.badge)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Production Tips */}
          <section id="production-tips" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              6. ข้อควรระวังและ Best Practices ในการใช้ CLI บน Production
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Callout type="danger" title="คำสั่งต้องห้ามบน Production">
                <ul className="space-y-1">
                  <li><strong>ห้ามรัน <code className="font-mono">docker compose down -v</code> บน Production:</strong> เพราะแฟลก <code className="font-mono">-v</code> จะลบ Volume ถาวร ส่งผลให้ข้อมูลในฐานข้อมูลสูญหายทันที</li>
                  <li><strong>ห้ามใช้ <code className="font-mono">prisma db push</code> บน Production:</strong> เสี่ยงต่อการเกิด Data Loss เพราะคำสั่งนี้บังคับแก้ Schema โดยไม่ผ่านประวัติ Migration</li>
                  <li><strong>ห้ามใช้ <code className="font-mono">npm install</code> ใน Dockerfile:</strong> ต้องใช้ <code className="font-mono">npm ci</code> เสมอ เพื่อการันตีว่า dependencies ตรงกับ lockfile 100%</li>
                </ul>
              </Callout>

              <Callout type="tip" title="คำสั่งแนะนำสำหรับ CI/CD & Deploy">
                <ul className="space-y-1">
                  <li><strong>การรัน Migration ใน Pipeline:</strong> ใช้ <code className="font-mono">npx prisma migrate deploy</code> ก่อนที่ Container แอปพลิเคชันจะเริ่มบูต</li>
                  <li><strong>การล้างแคชอย่างปลอดภัย:</strong> ใช้ <code className="font-mono">docker image prune</code> (ไม่ใส่ -a และไม่ใส่ --volumes) เพื่อลบเฉพาะ dangling images ที่ไม่มีชื่อ</li>
                  <li><strong>การ Build ด้วย Cache:</strong> ใช้ <code className="font-mono">docker compose build --pull</code> เพื่อดึง Base image ตัวล่าสุดที่มี security patch</li>
                </ul>
              </Callout>
            </div>
          </section>

          {/* Section 7: Prompt Box */}
          <section id="original-prompt" className="scroll-mt-24 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Prompt สำหรับสั่ง AI สร้าง Cheat Sheet ในหัวข้ออื่นๆ
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
        </div>
      )}
    </article>
  );
};
