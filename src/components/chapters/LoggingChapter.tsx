import React, { useState } from 'react';
import { Copy, Check, FileText, ShieldAlert, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { LogSanitizerSandbox } from '../widgets/LogSanitizerSandbox';

interface LoggingChapterProps {
  promptText: string;
}

export const LoggingChapter: React.FC<LoggingChapterProps> = ({ promptText }) => {
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
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
          <span>ความสามารถในการตรวจสอบ & ข้อกำหนดกฎหมาย</span>
          <span aria-hidden="true">·</span>
          <span>Observability & Audit Trail</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          การออกแบบระบบการเก็บบันทึกข้อมูล (Logging & Audit Trail)
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          คู่มือสถาปัตยกรรมระบบ Log สำหรับทีมวิศวกรซอฟต์แวร์: แยกแยะความแตกต่างระหว่าง Error Log, Access Log, 
          และ Audit Log พร้อมกำหนดมาตรฐาน JSON Schema แบบเป็นเอกภาพ และมาตรการ Data Masking ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
          <span>เวลาอ่านประมาณ 11 นาที</span>
          <span aria-hidden="true">·</span>
          <span>มาตรฐาน Enterprise</span>
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
          <FileText className="w-5 h-5 text-emerald-500" />
          บทนำ: ทำไม Log ที่มีคุณภาพจึงตัดสินความอยู่รอดของระบบ
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          เมื่อเกิด Incident บนระบบ Production สิ่งเดียวที่บอกได้ว่าเกิดอะไรขึ้นกับระบบคือ <strong>Log</strong> 
          ทว่าทีมพัฒนาจำนวนมากมักใช้เพียง <code className="text-slate-800 dark:text-slate-200">console.log("error here")</code> 
          ซึ่งทำให้ไม่สามารถค้นหา (Search), วิเคราะห์ปัญหาตาม Timeline (Root Cause Analysis), หรือปฏิบัติตามมาตรฐานการตรวจสอบ (Compliance) ได้
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-3">
          ระบบ Logging ที่ดีต้องตอบคำถาม 5W1H ได้อย่างชัดเจน: <strong>ใคร (Who)</strong> ทำ <strong>อะไร (What)</strong> 
          ที่ <strong>ไหน (Where)</strong> เมื่อ <strong>ไหร่ (When)</strong> ด้วย <strong>สถานะใด (Status)</strong> และมี <strong>บริบทแวดล้อมอย่างไร (Context)</strong>
        </p>
      </section>

      {/* Section 2: Log Types */}
      <section id="log-types" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          3 ประเภทของ Log ที่จำเป็นในระบบ Enterprise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {/* Error Log */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 text-xs sm:text-sm">
            <div className="font-semibold text-rose-700 dark:text-rose-400 text-sm mb-1">
              1. Error Log
            </div>
            <div className="text-slate-500 text-[11px] mb-2 font-mono">สำหรับวิศวกร (Developers & SRE)</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              เก็บบันทึกข้อผิดพลาด (Exceptions), Unhandled Rejections, และ Stack Trace อย่างละเอียด
            </p>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
              <strong>ตัวอย่าง:</strong> Database connection timeout, NullPointerException, 500 Internal Error
            </div>
          </div>

          {/* Access Log */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 text-xs sm:text-sm">
            <div className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">
              2. Access Log (HTTP / API)
            </div>
            <div className="text-slate-500 text-[11px] mb-2 font-mono">สำหรับมอนิเตอร์ Traffic & Latency</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              บันทึกทุก HTTP Request ที่วิ่งผ่าน Gateway: URL, Method, Status Code, Response Time, User-Agent
            </p>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
              <strong>ตัวอย่าง:</strong> GET /api/v1/orders 200 OK (latency: 42ms, bytes: 1420)
            </div>
          </div>

          {/* Audit Log */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 text-xs sm:text-sm">
            <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm mb-1">
              3. Audit Trail Log (ธุรกรรมสำคัญ)
            </div>
            <div className="text-slate-500 text-[11px] mb-2 font-mono">สำหรับ Compliance, ผู้ตรวจสอบ & กฎหมาย</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              บันทึกการกระทำสำคัญ เช่น การโอนเงิน, การเปลี่ยนสิทธิ์ Admin, การลบข้อมูล, การส่งออกข้อมูลลูกค้า
            </p>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
              <strong>ตัวอย่าง:</strong> Admin user_42 เปลี่ยนสิทธิ์ user_99 เป็น ROLE_SUPERADMIN
            </div>
          </div>
        </div>

        <Callout type="warning" title="Audit Log ต้องเป็น Immutable (แก้ไขหรือลบไม่ได้เด็ดขาด)">
          Audit Trail ต้องเก็บลงใน Storage ที่มีคุณสมบัติ <strong>WORM (Write Once, Read Many)</strong> 
          เช่น AWS S3 Object Lock หรือ Dedicated Audit Database ที่ไม่มีสิทธิ์ DELETE/UPDATE แม้กระทั่ง Root Admin 
          เพื่อใช้เป็นหลักฐานทางกฎหมายเมื่อเกิดการฟ้องร้องหรือตรวจสอบภายใน
        </Callout>
      </section>

      {/* Section 3: Unified JSON Schema */}
      <section id="json-schema" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          โครงสร้างข้อมูลมาตรฐาน (Unified JSON Log Schema)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
          การส่ง Log เป็น Plain Text ไร้โครงสร้าง (<code className="text-slate-800 dark:text-slate-200">"user 123 logged in from 1.1.1.1"</code>) 
          ทำให้ Parser ของ Elastic/Loki ทำงานหนักและค้นหาได้ช้า ทุกเซอร์วิสควรส่งออกเป็น Structured JSON Schema เดียวกัน:
        </p>

        <CodeBlock
          filename="schemas/audit-log-schema.json"
          language="json"
          code={`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UnifiedEnterpriseLog",
  "type": "object",
  "required": [
    "timestamp",
    "level",
    "trace_id",
    "service_name",
    "environment",
    "action",
    "status"
  ],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "เวลามาตรฐานสากล ISO-8601 UTC เช่น 2026-10-12T14:32:00.120Z"
    },
    "level": {
      "type": "string",
      "enum": ["DEBUG", "INFO", "WARN", "ERROR", "FATAL", "AUDIT"]
    },
    "trace_id": {
      "type": "string",
      "description": "Correlation / Distributed Trace ID สำหรับติดตามคำขอข้าม Microservices"
    },
    "service_name": {
      "type": "string",
      "description": "ชื่อเซอร์วิส เช่น payment-service, auth-service"
    },
    "environment": {
      "type": "string",
      "enum": ["development", "staging", "production"]
    },
    "actor": {
      "type": "object",
      "properties": {
        "user_id": { "type": "string" },
        "role": { "type": "string" },
        "ip_address": { "type": "string" },
        "user_agent": { "type": "string" }
      }
    },
    "action": {
      "type": "string",
      "description": "ชื่อเหตุการณ์แบบ SNAKE_CASE เช่น USER_PASSWORD_CHANGED, REFUND_ISSUED"
    },
    "status": {
      "type": "string",
      "enum": ["SUCCESS", "FAILED", "PENDING"]
    },
    "target_resource": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "example": "ACCOUNT_TRANSACTION" },
        "id": { "type": "string", "example": "txn_884920" }
      }
    },
    "details": {
      "type": "object",
      "description": "รายละเอียดบริบทเพิ่มเติม โดยต้องผ่านการ Mask ข้อมูล PDPA แล้ว"
    }
  }
}`}
        />
      </section>

      {/* Section 4: PDPA & Data Masking */}
      <section id="pdpa-masking" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Best Practices & การ Masking ข้อมูลส่วนบุคคล (PDPA/GDPR)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ข้อมูลใน Log ถือเป็นการประมวลผลข้อมูลส่วนบุคคลเช่นกัน 
          หากระบบบันทึกรหัสผ่าน หรือหมายเลขบัตรประชาชนแบบ Plaintext เมื่อระบบ Log รั่วไหล 
          องค์กรจะต้องรับผิดทั้งทางแพ่งและอาญา
        </p>

        {/* Sandbox */}
        <LogSanitizerSandbox />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> ข้อมูลที่ต้อง "ห้ามเก็บ" เด็ดขาด (Strictly Prohibited)
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• Plaintext Passwords / Hash Salt</li>
              <li>• หมายเลข CVV / CVC หลังบัตรเครดิต (ผิดกฎ PCI-DSS ร้ายแรง)</li>
              <li>• Secret Key / Private Key / OTP Code</li>
              <li>• ข้อมูลสุขภาพ / ประวัติการรักษา (Sensitive Data ตาม PDPA ม.26)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm">
            <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> ข้อมูลที่ต้อง "Masking" ก่อนเก็บ (Masked PII)
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>• เลขบัตรประจำตัวประชาชน 13 หลัก (เช่น <code className="text-slate-800 dark:text-slate-200 font-mono">1-XXXX-XXXXX-98-4</code>)</li>
              <li>• หมายเลขบัตรเครดิต 16 หลัก (เช่น <code className="text-slate-800 dark:text-slate-200 font-mono">4111-XXXX-XXXX-4444</code>)</li>
              <li>• เบอร์โทรศัพท์ (เช่น <code className="text-slate-800 dark:text-slate-200 font-mono">089-XXX-4567</code>)</li>
              <li>• Bearer Authorization Token (ตัดทอนให้เหลือเฉพาะส่วน Prefix)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Architecture Pipeline */}
      <section id="architecture-pipeline" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          สถาปัตยกรรม Log Shipping & Aggregation
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
          ในระบบ Cloud-Native แอปพลิเคชัน<strong>ไม่ควรเขียนไฟล์ Log ลง Hard Disk เอง</strong> 
          แต่ควรเขียนออก <code className="text-slate-800 dark:text-slate-200 font-mono">stdout / stderr</code> 
          เพื่อให้ Container Runtime จัดการตามหลัก The Twelve-Factor App:
        </p>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 text-xs sm:text-sm font-mono overflow-x-auto">
          <div className="text-slate-400 mb-2 text-[11px] uppercase tracking-wider">Log Pipeline Topology:</div>
          <div className="text-indigo-400 font-semibold">[App Container] (JSON to stdout)</div>
          <div className="text-slate-500 pl-4">↳ Docker / K8s Log Driver (/var/log/pods)</div>
          <div className="text-emerald-400 pl-8">↳ FluentBit / Promtail DaemonSet (Scrapes, Enriches & Buffers)</div>
          <div className="text-amber-400 pl-12">↳ Kafka / SQS (Buffer Queue ป้องกัน Log Spike ล่ม)</div>
          <div className="text-rose-400 pl-16">↳ Log Central: OpenSearch / Grafana Loki / ClickHouse</div>
          <div className="text-cyan-400 pl-20">↳ Visualization & Alerting: Grafana / Kibana dashboards</div>
        </div>
      </section>

      {/* Section 6: Code Implementation */}
      <section id="code-implementation" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          ตัวอย่างโค้ด Logger Middleware พร้อมระบบ Masking อัตโนมัติ (Pino/Winston)
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
          ตัวอย่างการสร้าง Logger ด้วย Pino (High-performance JSON Logger) ที่ดัก Mask ข้อมูลอ่อนไหวอัตโนมัติ 
          พร้อมผูก Distributed Trace ID:
        </p>

        <CodeBlock
          filename="src/utils/logger.ts"
          language="typescript"
          code={`import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// 1. สร้าง Pino Logger พร้อม Built-in Redaction ป้องกัน PII หลุด
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.passwordConfirmation',
      '*.token',
      '*.creditCard',
      '*.cvv',
      '*.pin'
    ],
    censor: '[REDACTED]'
  },
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// 2. Correlation ID & Audit Middleware
export const auditLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // ดึง Trace ID จาก Header หรือสร้างใหม่หากไม่มี
  const traceId = (req.headers['x-correlation-id'] as string) || randomUUID();
  req.headers['x-correlation-id'] = traceId;
  res.setHeader('x-correlation-id', traceId);

  const startTime = Date.now();

  // ดักจับเมื่อ Request ประมวลผลเสร็จสิ้น
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const isError = res.statusCode >= 400;

    const logPayload = {
      trace_id: traceId,
      service_name: 'core-api',
      environment: process.env.NODE_ENV || 'development',
      method: req.method,
      url: req.originalUrl,
      status_code: res.statusCode,
      duration_ms: durationMs,
      actor: {
        user_id: (req as any).user?.id || 'anonymous',
        ip: req.ip || req.socket.remoteAddress,
      }
    };

    if (isError) {
      logger.warn(logPayload, \`HTTP Request Failed: \${req.method} \${req.originalUrl}\`);
    } else {
      logger.info(logPayload, \`HTTP Request Completed: \${req.method} \${req.originalUrl}\`);
    }
  });

  next();
};

// 3. ฟังก์ชันสำหรับบันทึก Audit Trail ของธุรกรรมสำคัญ
export const logAuditTrail = (params: {
  action: string;
  userId: string;
  resourceId: string;
  details: Record<string, any>;
}) => {
  logger.info({
    type: 'AUDIT_TRAIL',
    action: params.action,
    user_id: params.userId,
    target_id: params.resourceId,
    details: params.details,
    timestamp: new Date().toISOString()
  }, \`[AUDIT] Action \${params.action} performed by \${params.userId}\`);
};`}
        />
      </section>

      {/* Section 7: Summary Rules */}
      <section id="summary-rules" className="scroll-mt-24 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          กฎเหล็ก 6 ข้อสำหรับการทำ Logging ในระดับ Enterprise
        </h2>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">01.</span>
            <span><strong>ใช้ JSON เท่านั้น:</strong> ห้ามส่ง Unstructured Text เพราะ Parse ยากและทำ Dashboard สถิติไม่ได้</span>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">02.</span>
            <span><strong>มี Trace ID เสมอ:</strong> ทุกคำขอที่วิ่งเข้ามาต้องมี Unique ID ติดตามไปตั้งแต่ Frontend ถึงทุก Microservice</span>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">03.</span>
            <span><strong>ห้ามเก็บข้อมูลความลับ:</strong> กำหนด Auto-masking ใน Logger Level ไม่พึ่งพาเพียงความระมัดระวังของคน</span>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">04.</span>
            <span><strong>เลือก Log Level ให้ตรงจุด:</strong> ห้ามใช้ ERROR กับ Business Validation (เช่น กรอกรหัสผิดให้ใช้ WARN หรือ INFO)</span>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">05.</span>
            <span><strong>กำหนด Retention Policy:</strong> Log ทั่วไปเก็บ 30-90 วัน ส่วน Audit Trail เก็บตามกฎหมาย 1-5 ปี</span>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-start gap-3">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">06.</span>
            <span><strong>ห้ามพิมพ์ลงไฟล์ใน Container:</strong> ปล่อยให้เขียนออก stdout แล้วให้ Agent ภายนอกดูดไปเก็บ</span>
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
          สามารถคัดลอก Prompt ด้านล่างนี้ไปใช้กับ AI เพื่อสร้างคู่มือหรือแนวทางสถาปัตยกรรมสำหรับทีม:
        </p>
        <pre className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
          {promptText}
        </pre>
      </section>
    </article>
  );
};
