import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, Search, Monitor, Cpu, Network, FileText, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Callout } from '../Callout';
import { CodeBlock } from '../CodeBlock';

interface WindowsLinuxCommandsChapterProps {
  promptText: string;
}

interface CommandRow {
  name: string;
  syntax: string;
  description: string;
  scenario: string;
  os: 'windows' | 'linux';
  category: 'file' | 'network' | 'process' | 'system';
}

export const WindowsLinuxCommandsChapter: React.FC<WindowsLinuxCommandsChapterProps> = ({ promptText }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'windows' | 'linux' | 'compare'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCmd(text);
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

  const commandsList: CommandRow[] = [
    // Windows Commands
    {
      name: 'ตรวจจับ Process ที่จอง Port',
      syntax: 'netstat -ano | findstr :3000',
      description: 'ค้นหาว่า Process ID (PID) ใดกำลังใช้งาน Port 3000',
      scenario: 'ใช้ตอนรัน npm run dev แล้วติด Error EADDRINUSE: port already in use',
      os: 'windows',
      category: 'network'
    },
    {
      name: 'บังคับปิด Process ตาม PID',
      syntax: 'taskkill /PID <PID_NUMBER> /F',
      description: 'สั่งปิดโปรเซสแบบบังคับทันที (/F คือ Force)',
      scenario: 'ใช้ปิดโปรแกรมที่ค้าง หรือปิด Node.js Zombie ที่ค้าง port',
      os: 'windows',
      category: 'process'
    },
    {
      name: 'ปิด Process ทั้งหมดตามชื่อ Image',
      syntax: 'taskkill /IM node.exe /F',
      description: 'สั่งปิด process ทุกตัวที่มีชื่อ node.exe ในคลิกเดียว',
      scenario: 'เคลียร์โปรเซส Node.js ทั้งหมดที่ค้างในระบบ',
      os: 'windows',
      category: 'process'
    },
    {
      name: 'ดูรายการ Process ทั้งหมด',
      syntax: 'tasklist /v /fi "STATUS eq running"',
      description: 'แสดงรายชื่อโปรเซสที่กำลังรันอยู่ พร้อมหน่วยความจำและ User เจ้าของ',
      scenario: 'ตรวจสอบดูว่ามี process แอบแฝงกิน RAM หรือไม่',
      os: 'windows',
      category: 'process'
    },
    {
      name: 'ทดสอบการเชื่อมต่อ Network Port',
      syntax: 'Test-NetConnection -ComputerName db.example.com -Port 5432',
      description: 'PowerShell คำสั่งทดสอบว่า Port ปลายทางเปิดและเชื่อมต่อได้หรือไม่ (แทน telnet)',
      scenario: 'ตรวจสอบว่าเซิร์ฟเวอร์ต่อ Database PostgreSQL บน Cloud ติดหรือไม่',
      os: 'windows',
      category: 'network'
    },
    {
      name: 'ค้นหาข้อความภายในไฟล์',
      syntax: 'findstr /s /i /n "DATABASE_URL" *.env *.ts',
      description: 'ค้นหาคำว่า DATABASE_URL ในทุกโฟลเดอร์ย่อย (/s) ไม่สนตัวพิมพ์เล็กใหญ่ (/i)',
      scenario: 'ค้นหาตัวแปรหรือคำสั่งในโค้ดโดยไม่ต้องเปิด VSCode',
      os: 'windows',
      category: 'file'
    },
    {
      name: 'คัดลอกไฟล์และโฟลเดอร์แบบ Mirror',
      syntax: 'robocopy src backup /MIR /R:2 /W:5',
      description: 'เครื่องมือ Copy ไฟล์ความเร็วสูงพร้อมซิงค์โฟลเดอร์ให้เหมือนต้นฉบับเป๊ะ (/MIR)',
      scenario: 'ใช้ในสคริปต์ Backup หรือ Sync ไฟล์งานในโปรเจกต์',
      os: 'windows',
      category: 'file'
    },
    {
      name: 'ดูและตั้งค่า Environment Variable ถาวร',
      syntax: 'setx NODE_ENV "production" /M',
      description: 'กำหนดตัวแปรระดับ System Machine (/M) เก็บถาวรใน Windows Registry',
      scenario: 'เซ็ตอัป System Environment บน Windows Server',
      os: 'windows',
      category: 'system'
    },
    {
      name: 'ล้าง DNS Cache',
      syntax: 'ipconfig /flushdns',
      description: 'ล้างแคช Resolver DNS ในเครื่องทั้งหมด',
      scenario: 'ใช้เมื่อเพิ่งชี้โดเมนใหม่แล้วเครื่องยังจำ IP เก่าอยู่',
      os: 'windows',
      category: 'network'
    },

    // Linux Commands
    {
      name: 'ตรวจจับ Process ที่จอง Port',
      syntax: 'lsof -i :3000 หรือ ss -tulpn | grep :3000',
      description: 'แสดง PID และชื่อ Process ที่กำลัง Listen อยู่บน Port 3000',
      scenario: 'ใช้แก้ปัญหา Port ชนบน Ubuntu / Linux Server',
      os: 'linux',
      category: 'network'
    },
    {
      name: 'บังคับปิด Process ตาม PID',
      syntax: 'kill -9 <PID>',
      description: 'ส่งสัญญาณ SIGKILL ตัดการทำงานของโปรเซสทันที',
      scenario: 'หยุด Service หรือสคริปต์ที่ค้างแบบทันที',
      os: 'linux',
      category: 'process'
    },
    {
      name: 'ปิด Process ทั้งหมดตามชื่อ',
      syntax: 'pkill -9 -f "node"',
      description: 'สั่งปิดโปรเซสทุกตัวที่ในคำสั่งมีคำว่า "node"',
      scenario: 'ล้าง Zombie process ของ Node.js บน Server ทั้งหมด',
      os: 'linux',
      category: 'process'
    },
    {
      name: 'ดู CPU และ RAM แบบ Realtime',
      syntax: 'htop หรือ top -b -n 1 | head -n 20',
      description: 'แสดงสถานะการใช้งานทรัพยากรระบบของแต่ละโปรเซส',
      scenario: 'มอนิเตอร์ดูว่ามี container หรือ node process ตัวไหนกิน CPU 100%',
      os: 'linux',
      category: 'process'
    },
    {
      name: 'ค้นหาข้อความในโค้ดทั้งโปรเจกต์',
      syntax: 'grep -rnw "./src" -e "DATABASE_URL"',
      description: 'ค้นหาคำในโฟลเดอร์ย่อยแบบ Recursive พร้อมแสดงหมายเลขบรรทัด (-n)',
      scenario: 'ค้นหาจุดที่เรียกใช้ตัวแปรหรือฟังก์ชันบน Terminal',
      os: 'linux',
      category: 'file'
    },
    {
      name: 'ค้นหาไฟล์ตามชื่อและลบทิ้ง',
      syntax: 'find . -name "*.log" -type f -delete',
      description: 'ค้นหาไฟล์ที่ลงท้ายด้วย .log ทั้งหมดในโฟลเดอร์ย่อยแล้วลบทิ้งทันที',
      scenario: 'เคลียร์ไฟล์ Log ขนาดใหญ่ที่สะสมในเซิร์ฟเวอร์',
      os: 'linux',
      category: 'file'
    },
    {
      name: 'ตรวจสอบพื้นที่ Hard Disk',
      syntax: 'df -h',
      description: 'แสดงพื้นที่การใช้งาน Disk แต่ละ Partition ในหน่วยที่มนุษย์อ่านง่าย (-h: GB/MB)',
      scenario: 'ตรวจสอบว่า Disk บน Server เต็มหรือไม่เมื่อ Container สตาร์ตไม่ติด',
      os: 'linux',
      category: 'system'
    },
    {
      name: 'ตรวจสอบขนาดโฟลเดอร์',
      syntax: 'du -sh * | sort -h',
      description: 'สรุปขนาดพื้นที่ของแต่ละโฟลเดอร์พร้อมเรียงลำดับจากน้อยไปมาก',
      scenario: 'หาว่าโฟลเดอร์ไหนกินพื้นที่เยอะที่สุด เช่น /var/log หรือ node_modules',
      os: 'linux',
      category: 'file'
    },
    {
      name: 'ดู Live Log ของ Service ด้วย Systemd',
      syntax: 'journalctl -u my-app.service -f -n 100',
      description: 'ส่องดู Log แบบ Realtime (-f) ของ Systemd Service ย้อนหลัง 100 บรรทัด',
      scenario: 'ใช้ Debugging เซอร์วิส Backend บน Linux Production',
      os: 'linux',
      category: 'system'
    },
    {
      name: 'ปรับสิทธิ์ไฟล์และโฟลเดอร์',
      syntax: 'chmod -R 755 ./dist && chown -R www-data:www-data ./dist',
      description: 'กำหนดสิทธิ์ Read/Write/Execute และเปลี่ยนสิทธิ์เจ้าของเป็น user www-data',
      scenario: 'เซ็ตสิทธิ์โฟลเดอร์สำหรับ Nginx Web Server',
      os: 'linux',
      category: 'file'
    }
  ];

  const comparisonTable = [
    { purpose: 'แสดงรายการไฟล์ในโฟลเดอร์', windows: 'dir /a', linux: 'ls -la' },
    { purpose: 'ค้นหาข้อความในไฟล์', windows: 'findstr /s /i "text" *', linux: 'grep -rn "text" .' },
    { purpose: 'ดูเนื้อหาในไฟล์', windows: 'type file.txt', linux: 'cat file.txt' },
    { purpose: 'ลบโฟลเดอร์และไฟล์ย่อยทั้งหมด', windows: 'rmdir /s /q folder_name', linux: 'rm -rf folder_name' },
    { purpose: 'คัดลอกไฟล์', windows: 'copy file1 file2 หรือ robocopy', linux: 'cp file1 file2 หรือ rsync -av' },
    { purpose: 'ย้ายหรือเปลี่ยนชื่อไฟล์', windows: 'move old_name new_name', linux: 'mv old_name new_name' },
    { purpose: 'ดูเส้นทาง Path คำสั่งที่รัน', windows: 'where node', linux: 'which node' },
    { purpose: 'ดู IP Address ของเครื่อง', windows: 'ipconfig /all', linux: 'ip a หรือ ifconfig' },
    { purpose: 'ดู Process ที่จอง Port', windows: 'netstat -ano | findstr :3000', linux: 'lsof -i :3000 หรือ ss -tulpn' },
    { purpose: 'บังคับปิด Process (Kill)', windows: 'taskkill /PID <PID> /F', linux: 'kill -9 <PID>' },
    { purpose: 'ดูทรัพยากร CPU / RAM', windows: 'tasklist หรือ resmon', linux: 'top หรือ htop หรือ free -m' },
    { purpose: 'ดู Environment Variables', windows: 'set', linux: 'printenv หรือ env' },
    { purpose: 'ล้างหน้าจอ Terminal', windows: 'cls', linux: 'clear' },
  ];

  const filteredCommands = commandsList.filter((cmd) => {
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'windows' && cmd.os === 'windows') ||
      (activeTab === 'linux' && cmd.os === 'linux');

    const matchSearch =
      searchQuery === '' ||
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.scenario.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTab && matchSearch;
  });

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      {/* Title & Meta */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          <span>ระบบปฏิบัติการ & CLI Reference</span>
          <span aria-hidden="true">·</span>
          <span>Windows CMD / PowerShell & Linux Bash</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          รวมชุดคำสั่งของ Windows และ Linux สำหรับวิศวกรซอฟต์แวร์
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือสรุปคำสั่ง Command Line Interface (CLI) ที่ใช้งานจริงของทั้งฝั่ง Windows และ Linux 
          ครอบคลุมการจัดการ Process, เครือข่าย Network, สิทธิ์ไฟล์ Permissions ตลอดจนตารางเทียบเคียงคำสั่งข้าม OS 
          และเทคนิคปลดล็อกพอร์ตชน (Port Killing)
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>รวมคำสั่งประจำวัน {commandsList.length} รายการ</span>
          <span aria-hidden="true">·</span>
          <span>ตารางเทียบเคียง 13 รูปแบบ</span>
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

      {/* Filter Toolbar */}
      <div className="my-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาคำสั่ง เช่น netstat, lsof, taskkill, kill, chmod, port..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({commandsList.length})
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'windows'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-blue-500" /> Windows
            </button>
            <button
              onClick={() => setActiveTab('linux')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'linux'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-500" /> Linux Bash
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'compare'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" /> ตารางเปรียบเทียบ OS
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'compare' ? (
        /* Cross Platform Comparison Table */
        <section id="cross-platform" className="scroll-mt-24 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-500" />
            ตารางเปรียบเทียบคำสั่งคู่เหมือน: Windows vs Linux
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            ช่วยให้ Developer ที่ต้องทำงานข้ามระบบปฏิบัติการ ไม่ต้องสับสนกับไวยากรณ์คำสั่งที่แตกต่างกัน:
          </p>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <th className="p-3 font-semibold w-1/3">สิ่งที่ต้องการทำ (Task)</th>
                  <th className="p-3 font-semibold w-1/3 text-blue-600 dark:text-blue-400">Windows (CMD / PowerShell)</th>
                  <th className="p-3 font-semibold w-1/3 text-amber-600 dark:text-amber-400">Linux (Bash Shell)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-200">{row.purpose}</td>
                    <td className="p-3">
                      <code className="font-mono text-xs text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                        {row.windows}
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="font-mono text-xs text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                        {row.linux}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Standard Filtered Commands List */
        <div className="space-y-6 mb-12">
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <th className="p-3 font-semibold w-1/3">คำสั่ง (Syntax)</th>
                  <th className="p-3 font-semibold w-1/2">หน้าที่ & สถานการณ์ที่ควรใช้</th>
                  <th className="p-3 font-semibold w-1/6">OS & หมวดหมู่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {filteredCommands.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 break-all">
                          {item.syntax}
                        </code>
                        <button
                          onClick={() => handleCopy(item.syntax)}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                          title="คัดลอกคำสั่ง"
                        >
                          {copiedCmd === item.syntax ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3 align-top text-xs leading-relaxed">
                      <div className="font-semibold text-slate-900 dark:text-slate-200 mb-0.5">{item.name}</div>
                      <div className="text-slate-600 dark:text-slate-300 mb-1">{item.description}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400"><strong>สถานการณ์:</strong> {item.scenario}</div>
                    </td>
                    <td className="p-3 align-top text-xs">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase font-mono ${
                          item.os === 'windows'
                            ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900'
                            : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900'
                        }`}>
                          {item.os}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Practical Guide: Port Killing Technique */}
      <section id="port-kill" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          4. เทคนิคแก้ปัญหา Port ชน (Port Killing) ฉบับ 2 บรรทัดจบ
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          ปัญหาคลาสสิกที่เจอบ่อยที่สุด: รัน <code className="font-mono text-xs">npm run dev</code> แล้วติด 
          <code className="text-rose-500 font-mono text-xs"> Error: listen EADDRINUSE: address already in use :::3000</code>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20">
            <div className="font-semibold text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-1.5">
              <Monitor className="w-4 h-4" /> บน Windows (CMD / PowerShell)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              ขั้นตอนที่ 1: หา Process ID (PID) ที่ค้างอยู่
            </p>
            <CodeBlock
              filename="CMD / Terminal"
              language="bash"
              code={`# 1. หาเลข PID ที่คอลัมน์ขวาสุด
netstat -ano | findstr :3000

# สมมติได้ PID คือ 14520
# 2. บังคับปิดทันที
taskkill /PID 14520 /F`}
            />
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20">
            <div className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> บน Linux / macOS (Bash)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              คำสั่งลัดใน 1 บรรทัดจบ: ค้นหาและ Kill ทิ้งทันที
            </p>
            <CodeBlock
              filename="Bash Terminal"
              language="bash"
              code={`# วิธีที่ 1: ค้นหา PID และ Kill แบบรวดเร็วในคำสั่งเดียว
kill -9 $(lsof -t -i:3000)

# วิธีที่ 2: หากใช้คำสั่ง fuser
fuser -k 3000/tcp`}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Prompt */}
      <section id="original-prompt" className="scroll-mt-24 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Prompt สำหรับสร้างหรือขยายเนื้อหาคำสั่ง Windows & Linux
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
