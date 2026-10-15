import React, { useState } from 'react';
import { Copy, Check, FileCode, Sparkles, Terminal, Play, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';

interface BatchScriptingChapterProps {
  promptText: string;
}

export const BatchScriptingChapter: React.FC<BatchScriptingChapterProps> = ({ promptText }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'dev' | 'backup' | 'clean'>('dev');

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {}
  };

  const sampleScripts = {
    dev: {
      name: 'start-dev-environment.bat',
      description: 'สคริปต์ 1 คลิก: ตรวจสอบ Dependency, ล้างพอร์ตที่ค้าง และสตาร์ต Docker + Node.js Backend',
      code: `@echo off
setlocal enabledelayedexpansion

title [Dev Launcher] Fullstack Automation
color 0A

echo ========================================================
echo   [1/4] Checking Prerequisites...
echo ========================================================

:: 1. ตรวจสอบว่าติดตั้ง Node.js หรือยัง
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

:: 2. ตรวจสอบว่าติดตั้ง Docker หรือยัง
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0E
    echo [WARNING] Docker is not detected. Proceeding without Docker...
) else (
    echo [OK] Docker found. Starting PostgreSQL container...
    docker compose up -d postgres
)

echo.
echo ========================================================
echo   [2/4] Clearing Stuck Port 3000 / 4000...
echo ========================================================

:: ค้นหา PID ที่ใช้พอร์ต 4000 แล้วปิดทิ้ง
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do (
    echo Found zombie process on port 4000 with PID: %%a. Killing...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo ========================================================
echo   [3/4] Installing dependencies if needed...
echo ========================================================
cd /d "%~dp0"
if not exist "node_modules\\" (
    echo node_modules not found. Running npm install...
    call npm install
)

echo.
echo ========================================================
echo   [4/4] Starting Development Server...
echo ========================================================
call npm run dev

pause`
    },
    backup: {
      name: 'backup-database-and-code.bat',
      description: 'สคริปต์สำรองข้อมูลอัตโนมัติ พร้อมตั้งชื่อโฟลเดอร์ตามวันที่และเวลา (Timestamp)',
      code: `@echo off
setlocal

:: ดึงวันที่และเวลาในฟอร์แมต YYYYMMDD_HHMMSS
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set dt=%%I
set TIMESTAMP=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%

set "SOURCE_DIR=%~dp0src"
set "BACKUP_DIR=%~dp0backups\\backup_%TIMESTAMP%"

echo ========================================================
echo   Automated Project Backup: %TIMESTAMP%
echo ========================================================
echo Source : %SOURCE_DIR%
echo Target : %BACKUP_DIR%
echo.

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: ใช้ robocopy ซึ่งมีความเร็วและความปลอดภัยสูงกว่า copy ธรรมดา
robocopy "%SOURCE_DIR%" "%BACKUP_DIR%" /MIR /R:2 /W:2 /XD node_modules .git dist

if %ERRORLEVEL% leq 3 (
    echo.
    echo [SUCCESS] Backup completed successfully!
) else (
    echo.
    echo [ERROR] Backup failed with error code: %ERRORLEVEL%
)

echo.
pause`
    },
    clean: {
      name: 'clean-deep-reset.bat',
      description: 'สคริปต์ล้างแคชและโฟลเดอร์ขยะ (node_modules, dist, .turbo) แบบความเร็วสูงพิเศษ',
      code: `@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Deep Project Cleanup & Reset Script
echo ========================================================
echo.
echo WARNING: This will delete node_modules, dist, and package-lock.json!
set /p CONFIRM=Do you want to proceed? (Y/N): 

if /i "%CONFIRM%" neq "Y" (
    echo Operation cancelled by user.
    exit /b 0
)

echo.
echo [1/3] Deleting node_modules folder (Fast Removal)...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo Done.
)

echo [2/3] Deleting build output directories...
if exist "dist" rmdir /s /q "dist"
if exist ".angular" rmdir /s /q ".angular"
if exist ".next" rmdir /s /q ".next"
echo Done.

echo [3/3] Clearing npm cache...
call npm cache clean --force

echo.
echo ========================================================
echo   Project clean complete! Ready for fresh npm install.
echo ========================================================
pause`
    }
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
          <span>ระบบอัตโนมัติบน Windows & Scripting</span>
          <span aria-hidden="true">·</span>
          <span>Batch File (.bat / .cmd) Automation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          วิธีเขียนสคริปต์ Batch File (.bat) สำหรับ Windows
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือเรียนรู้การเขียนสคริปต์ Batch (.bat / .cmd) เพื่อสร้างระบบ Automation ในชีวิตประจำวันของ Software Engineer: 
          ตั้งแต่โครงสร้างพื้นฐาน การจัดการตัวแปร เงื่อนไข IF/ELSE การวนลูป ไปจนถึงสคริปต์รันระบบแบบ 1 คลิก
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 10 นาที</span>
          <span aria-hidden="true">·</span>
          <span>พร้อมสคริปต์นำไปใช้ได้ทันที 3 ชุด</span>
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

      {/* 1. Basics */}
      <section id="batch-basics" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-emerald-500" />
          1. ไวยากรณ์และโครงสร้างพื้นฐานของไฟล์ Batch
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          ไฟล์ Batch คือไฟล์ Text ธรรมดาที่มีนามสกุล <code className="font-mono text-xs">.bat</code> หรือ <code className="font-mono text-xs">.cmd</code> 
          ที่รวบรวมคำสั่งของ Windows Command Prompt ให้ทำงานตามลำดับโดยอัตโนมัติ:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">คำสั่งบังคับในส่วนหัวของไฟล์</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">@echo off:</strong> สั่งซ่อนการพิมพ์บรรทัดคำสั่งซ้ำ ทำให้หน้าจอแสดงเฉพาะผลลัพธ์ที่พิมพ์ออกมาจริง
              </li>
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">setlocal:</strong> ป้องกันไม่ให้ตัวแปรในสคริปต์หลุดออกไปปนกับตัวแปรของ Windows นอกสคริปต์
              </li>
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">%~dp0:</strong> ตัวแปรพิเศษที่แทนค่า <em>Full Directory Path</em> ของที่ตั้งไฟล์ .bat ตัวนั้นเอง (สำคัญมาก!)
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">การประกาศและเรียกใช้ตัวแปร</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>การประกาศ:</strong> ใช้ <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">set "MY_VAR=hello"</code> (ห้ามเว้นวรรคหน้าหลังเครื่องหมายเท่ากับ)
              </li>
              <li>
                <strong>การเรียกใช้:</strong> ล้อมรอบด้วยเครื่องหมายเปอร์เซ็นต์ <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">%MY_VAR%</code>
              </li>
              <li>
                <strong>การรับ Input จากผู้ใช้:</strong> ใช้คำสั่ง <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">set /p USER_INPUT=กรอกชื่อ: </code>
              </li>
            </ul>
          </div>
        </div>

        <CodeBlock
          filename="hello-world.bat"
          language="bash"
          code={`@echo off
setlocal

:: สั่งย้าย Current Directory ไปที่โฟลเดอร์ของไฟล์สคริปต์เสมอ ป้องกันรันผิดที่
cd /d "%~dp0"

set "APP_NAME=Express-API"
set "PORT=4000"

echo ==========================================
echo Starting %APP_NAME% on Port %PORT%
echo Script location: %~dp0
echo ==========================================

pause`}
        />
      </section>

      {/* 2. Control Flow */}
      <section id="control-flow" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          2. การควบคุมเงื่อนไข IF / ELSE, GOTO และการวนลูป FOR
        </h2>

        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              การตรวจสอบเงื่อนไข (IF / ELSE และ IF EXIST)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              ตรวจสอบว่าไฟล์หรือโฟลเดอร์มีอยู่จริงหรือไม่ด้วย <code className="font-mono">if exist</code>:
            </p>
            <CodeBlock
              filename="check-env.bat"
              language="bash"
              code={`:: ตรวจสอบว่ามีไฟล์ .env หรือไม่ ถ้าไม่มีให้ copy จาก .env.example
if not exist ".env" (
    echo [WARNING] .env file not found! Copying from .env.example...
    copy .env.example .env
) else (
    echo [OK] .env file already exists.
)`}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              การกระโดดข้ามขั้นตอนด้วย GOTO และ Labels
            </h3>
            <CodeBlock
              filename="menu.bat"
              language="bash"
              code={`@echo off
echo 1. Start Server
echo 2. Run Tests
echo 3. Exit

set /p CHOICE="Enter choice (1-3): "

if "%CHOICE%"=="1" goto :start_server
if "%CHOICE%"=="2" goto :run_tests
if "%CHOICE%"=="3" goto :exit_app
goto :invalid

:start_server
echo Starting Web Server...
call npm run dev
goto :exit_app

:run_tests
echo Running Vitest...
call npm test
goto :exit_app

:invalid
echo Invalid choice!
pause

:exit_app
echo Bye!` }
            />
          </div>
        </div>
      </section>

      {/* 3. Error Handling */}
      <section id="error-handling" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          3. การดักจับ Error และรหัส %ERRORLEVEL%
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
          ใน Windows ทุกคำสั่งที่รันเสร็จสิ้นจะคืนค่าสถานะเป็นรหัสตัวเลขลงในตัวแปร <strong>%ERRORLEVEL%</strong>:
          <strong>0 คือ สำเร็จ (Success)</strong> ส่วนค่ามากกว่า 0 คือเกิดข้อผิดพลาด:
        </p>

        <CodeBlock
          filename="error-check.bat"
          language="bash"
          code={`:: รันคำสั่ง npm run build
call npm run build

:: ตรวจสอบสถานะการคอมไพล์
if %ERRORLEVEL% neq 0 (
    color 0C
    echo ==============================================
    echo [ERROR] Build failed with exit code: %ERRORLEVEL%
    echo ==============================================
    pause
    exit /b %ERRORLEVEL%
)

echo [SUCCESS] Build completed cleanly!`}
        />

        <Callout type="tip" title="คำแนะนำ: ทำไมต้องใช้คำสั่ง 'call'">
          เมื่อคุณสั่งรันโปรแกรมภายนอกอย่าง <code className="font-mono">npm</code> หรือสคริปต์ bat ตัวอื่น 
          <strong>ต้องนำหน้าด้วยคำสั่ง <code className="font-mono">call</code> เสมอ</strong> (เช่น <code className="font-mono">call npm install</code>) 
          หากไม่ใส่คำสั่ง call ตัว Command Prompt จะจบการทำงานทันทีหลังจาก npm รันเสร็จ และจะไม่กลับมาทำคำสั่งบรรทัดถัดไปในสคริปต์เราอีก!
        </Callout>
      </section>

      {/* 4. Practical Automation Scripts */}
      <section id="automation-scripts" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
          4. 3 ตัวอย่างสคริปต์ Batch ใช้งานจริงสำหรับ Developer
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          สลับดูสคริปต์ที่พร้อมคัดลอกไปวางในโปรเจกต์ของคุณเพื่อใช้งานได้ทันที:
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dev')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dev'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            1. สคริปต์เปิดเครื่อง Dev (Start Dev)
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2. สคริปต์สำรองข้อมูล (Auto Backup)
          </button>
          <button
            onClick={() => setActiveTab('clean')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'clean'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3. สคริปต์ล้างขยะโปรเจกต์ (Deep Clean)
          </button>
        </div>

        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {sampleScripts[activeTab].description}
          </p>
          <CodeBlock
            filename={sampleScripts[activeTab].name}
            language="bash"
            code={sampleScripts[activeTab].code}
          />
        </div>
      </section>

      {/* 5. UAC Elevation */}
      <section id="script-run-as-admin" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          5. เทคนิคการขอสิทธิ์ Administrator (UAC Elevation) ในสคริปต์
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          บางงาน เช่น การแก้ไฟล์ <code className="font-mono text-xs">C:\Windows\System32\drivers\etc\hosts</code> 
          หรือการติดตั้ง Service ต้องใช้สิทธิ์แอดมิน ใส่โค้ดชุดนี้ไว้บนสุดของไฟล์ .bat สคริปต์จะเด้งหน้าต่าง UAC ขอสิทธิ์ทันที:
        </p>

        <CodeBlock
          filename="run-as-admin.bat"
          language="bash"
          code={`@echo off

:: ตรวจสอบสิทธิ์ Admin ผ่านคำสั่ง net session
net session >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Running with Administrator privileges!
) else (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: คำสั่งที่ต้องใช้สิทธิ์ Admin รันต่อตรงนี้
echo Performing system maintenance...
pause`}
        />
      </section>

      {/* Prompt */}
      <section id="original-prompt" className="scroll-mt-24 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Prompt สำหรับสร้างหรือขยายสคริปต์ Batch เพิ่มเติม
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
