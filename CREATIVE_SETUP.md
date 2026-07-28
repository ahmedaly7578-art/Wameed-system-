# الكريتيف — دليل التركيب (مزامنة ثنائية مع Google Sheet)

## اللي اتضاف
1. **صفحة "الكريتيف 🎨"** جديدة في النظام — تاسك لكل تصميم، بنفس أعمدة الشيت بتاعك
   (Agency, Department, Strategy Link, Client, Website Link, Task Date, Notes/Data,
   Dead Line, Designer, Forum, No of Sizes, Size, Status, Upload Folder, Upload Date,
   Done, Director, Time).
2. **الديدلاين تلقائي** = تاريخ نزول التاسك + 4 أيام (تقدر تعدّله يدوي لو حبيت).
3. **تنبيه تلقائي** في جرس الإشعارات لما أي تاسك يتأخر عن الديدلاين — للمصمم نفسه وللأدمن.
4. **مزامنة ثنائية مع Google Sheet**: أي تاسك يتضاف/يتعدّل في النظام يظهر في الشيت،
   وأي صف يتعدّل في الشيت يوصل للنظام تلقائي.

## خطوات التركيب (مرة واحدة بس)

### 1) شغّل الميجريشن الجديدة
في Supabase → SQL Editor → شغّل محتوى `supabase/migrations/002_creative.sql`
(بيضيف جدول `creative_tasks` + دور "designer" للموظفين).

### 2) جهّز Google Service Account
1. روح [console.cloud.google.com](https://console.cloud.google.com) → أنشئ مشروع (أو استخدم موجود).
2. فعّل **Google Sheets API**.
3. IAM & Admin → Service Accounts → أنشئ Service Account جديد → أنشئله مفتاح JSON وحمّله.
4. افتح الجوجل شيت بتاعك → شير (Share) على إيميل الـ Service Account
   (موجود جوه الـ JSON في `client_email`) بصلاحية **Editor**.

### 3) رتّب أعمدة الشيت
الأعمدة لازم تكون بالترتيب ده بالظبط (من A لـ T):
```
A: N.O  B: Agency  C: Department  D: Strategy Link  E: Client  F: Website Link
G: Task Date  H: Notes/Data  I: Designer  J: Forum  K: No of Sizes  L: Size
M: Status  N: Upload Folder  O: Upload Date  P: Dead Line  Q: Done  R: Director
S: Time  T: System ID (عمود مخفي — منظومة، متلمسوش)
```
لو عندك شيت جاهز بترتيب مختلف زي اللي في الصورة، ظبّط الأعمدة أو ظبّط
`COLUMNS` جوه `supabase/functions/creative-sync-to-sheet/index.ts` بنفس ترتيبك.

### 4) انشر الـ Edge Functions
```bash
supabase functions deploy creative-sync-to-sheet
supabase functions deploy creative-sync-from-sheet

supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON='<محتوى ملف JSON كامل>'
supabase secrets set CREATIVE_SHEET_ID='<آي دي الشيت من اللينك>'
supabase secrets set CREATIVE_SHEET_TAB='Creative'
supabase secrets set CREATIVE_SYNC_SECRET='<اي نص عشوائي طويل، مثال: openssl rand -hex 24>'
```

### 5) اربط Database Webhook (اتجاه: النظام → الشيت)
Supabase Dashboard → Database → Webhooks → Create a new webhook:
- Table: `creative_tasks`
- Events: `INSERT`, `UPDATE`
- Type: HTTP Request → URL: `https://<project-ref>.functions.supabase.co/creative-sync-to-sheet`
- Headers: `X-Sync-Secret: <نفس القيمة اللي حطيتها فوق>`

### 6) ركّب Google Apps Script (اتجاه: الشيت → النظام)
1. افتح الشيت → Extensions → Apps Script.
2. الصق محتوى `google-apps-script/Code.gs`.
3. عدّل في أول الملف: `ENDPOINT` (لينك دالة `creative-sync-from-sheet`) و `SECRET`
   (نفس `CREATIVE_SYNC_SECRET`).
4. من التوولبار شغّل `setup()` مرة واحدة (هيطلب صلاحيات، وافق عليها).
   الدالة دي بترتب الهيدر وتخبي عمود الـ System ID وتركّب الـ Trigger تلقائي.

كده أي تعديل في الشيت هيوصل للنظام خلال ثانية، وأي إضافة من داخل النظام هتظهر
في الشيت تلقائي.

## ملاحظات مهمة
- التنبيهات دلوقتي جوه النظام بس (جرس الإشعارات) — لو عايز إيميل/واتساب بعدين
  سهل نضيفه فوق نفس النقطة اللي بيتولد فيها التنبيه.
- لو حصل خطأ في المزامنة، تقدر تتابعه في جدول `creative_sync_log`.
- المصممين لازم يتضافوا كموظفين بدور "Designer" من صفحة "إدارة الفريق" الأول
  عشان يظهروا في قايمة اختيار المصمم بالتاسك.
