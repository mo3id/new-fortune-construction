# Fortune Construction Constitution

## Core Principles

### I. Component-First UI
كل ميزة في الواجهة تبدأ كمكوّن مستقل قابل لإعادة الاستخدام. المكوّنات يجب أن تكون self-contained، موثقة، وقابلة للاختبار بشكل مستقل. استخدام نظام design tokens موحد عبر الموقع والداشبورد.

### II. API-Contract Driven
كل endpoint في الـ API يجب أن ي遵循 REST conventions واضحة مع validation عبر zod. الـ contracts (request/response schemas) تُعرّف قبل التنفيذ وتُستخدم في الواجهة عبر react-query.

### III. Type Safety (NON-NEGOTIABLE)
TypeScript إجباري في كل الملفات. لا يُسمح بـ `any`除非minutes ضرورة موثقة. الـ types تُعرّف في مكان مركزي وتُشارك بين الـ API والواجهة قدر الإمكان.

### IV. Test-First
الاختبارات إجبارية للـ API endpoints والـ utility functions. TDD مستحسن: اكتب test ← شوفه يفشل ← نفذ ← اجتياز. استخدام vitest للواجهة و jest/supertest للـ API.

### V. Performance & UX Consistency
- استخدام framer-motion للأنميشن بشكل متسق
- الصور يجب أن تكون محسّنة (lazy loading, proper formats)
- زمن الاستجابة الأول (FCP) أقل من 1.5s
- استخدام tailwind-merge لمنع تعارض classes

### VI. Monorepo Discipline
- الـ shared code يوضع في `packages/` أو `src/lib/`
- كل app في `apps/` مستقل وقابل للتشغيل منفرد
- dependencies مشتركة تُدار من الـ root
- الـ aliases تُعرّف في vite.config.ts و tsconfig.json

## Technology Stack

### Frontend (Main Site)
- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (radix-ui)
- React Router v7 للتنقل
- TanStack Query لإدارة server state
- Framer Motion للأنميشن

### Dashboard
- React 18 + Vite + TypeScript (port 5174)
- react-hook-form + zod للنماذج
- react-hot-toast للإشعارات
- axios للـ API calls

### API
- Express.js + TypeScript (port 3001)
- MongoDB via Mongoose
- JWT للمصادقة
- helmet + cors + rate-limiting للأمان
- multer لرفع الملفات
- mongodb-memory-server للبيئة التطويرية

## Development Workflow

1. **Spec** — اكتب مواصفات الميزة في `specs/` قبل التنفيذ
2. **Plan** — حدد التقنيات والبنية في `plan.md`
3. **Tasks** — قسّم العمل لمهام قابلة للتنفيذ في `tasks.md`
4. **Implement** — نفّذ المهام بالترتيب مع اختبارات
5. **Review** — تأكد من اجتياز typecheck و lint قبل الدمج

## Quality Gates

- `npm run typecheck` يجب أن ينجح بدون أخطاء
- `npm run build` يجب أن ينجح لكل apps
- لا commit بدون اختبارات للميزات الجديدة في الـ API
- مراجعة design consistency مع design tokens

## Governance

هذا الدستور يعلو على أي ممارسة أخرى. أي تعديل يتطلب توثيق، موافقة، وخطة ترحيل. أثناء التطوير، راجع هذا الملف كمرجع أساسي للقرارات التقنية.

**Version**: 1.0.0 | **Ratified**: 2026-07-16 | **Last Amended**: 2026-07-16