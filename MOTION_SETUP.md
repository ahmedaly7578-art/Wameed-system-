# الموشن 🎬 — دليل التركيب (نفس فكرة الكريتيف بالظبط)

## اللي اتضاف
1. **صفحة "الموشن 🎬"** جديدة في النظام — تاسك لكل موشن، بنفس أعمدة شيت "Motion" بتاعك
   (Task Owner, Agency, Department, Strategy Link, Client, Website Link, Task Date,
   Notes/Data, Dead Line, N.O, Member, Forum, Size, Status, Upload Folder, Done,
   Director, Time).
2. **Task Owner** بيتاخد من قايمة منسدلة فيها كل حد عنده حساب/إيميل على النظام
   (نفس جدول `users`) — مش تكست فري زي الكريتيف.
3. **باقي الحقول اللي كانت Dropdown في الشيت** (Agency, Department, Forum, Size,
   Status) بقت Dropdown في النظام بنفس القيم بالظبط.
4. **الديدلاين تلقائي** = تاريخ نزول التاسك + 4 أيام (تقدر تعدّله يدوي لو حبيت).
5. **تنبيه تلقائي** في جرس الإشعارات لما أي تاسك يتأخر عن الديدلاين — لصاحب الـ Task
   Owner نفسه وللأدمن.

## ⚠️ مهم — الفرق عن اللي مكتوب في CREATIVE_SETUP.md
الكريتيف فعليًا **مش شغالة بطريقة الـ webhooks/Apps Script** المكتوبة في
`CREATIVE_SETUP.md`. لو تتبعت الكود في `src/App.jsx` هتلاقي إنها شغالة بطريقة
أبسط: **الشيت نفسه هو قاعدة البيانات** — أي إضافة/تعديل/حذف في النظام بيتبعت
للشيت على طول عن طريق `creative-sheet-api`، وأي مرة تفتح صفحة الكريتيف النظام
بيقرا أحدث نسخة من الشيت مباشرة. معنى كده إنك لو عدّلت في الشيت نفسه يدوي،
هيظهر في النظام أول ما حد يفتح الصفحة تاني.

الموشن اتعملت بنفس الطريقة بالظبط (عن طريق `motion-sheet-api`) — أبسط وأسرع،
ومحتاجة خطوة تركيب واحدة بس، من غير Database Webhooks ولا Google Apps Script.

## خطوات التركيب (مرة واحدة بس)

### 1) رتّب أعمدة شيت "Motion"
لازم تكون بالترتيب ده بالظبط (من A لـ R)، وده فعلاً نفس ترتيب الشيت الحالي عندك:
```
A: Task Owner   B: Agency       C: Department   D: Strategy Link
E: Client       F: Website Link G: Task Date    H: Notes// Data
I: Dead Line    J: N.O          K: Member       L: Forum
M: Size         N: Status       O: Upload Folder P: Done
Q: Director     R: Time         S: System ID (عمود مخفي — منظومة، متلمسوش)
```
عمود S هيتملى تلقائي من النظام أول ما تضيف تاسك من داخل التطبيق. لو عندك صفوف
قديمة في الشيت اتضافت يدوي قبل كده، النظام مش هيقدر "يمسكها" في التعديل/الحذف
لحد ما تحط لها ID في عمود S (أو تعيد إضافتها من داخل النظام).

### 2) استخدم نفس Google Service Account اللي شغال مع الكريتيف
مفيش داعي تعمل واحد جديد — بس لازم:
1. افتح شيت "Motion" بتاعك → شير (Share) على نفس إيميل الـ Service Account
   اللي شيرته على شيت الكريتيف (موجود جوه ملف الـ JSON بتاعه في `client_email`)
   بصلاحية **Editor**.

### 3) انشر الـ Edge Function
```bash
supabase functions deploy motion-sheet-api

supabase secrets set MOTION_SHEET_ID='<آي دي شيت الموشن من اللينك>'
supabase secrets set MOTION_SHEET_TAB='Motion'
supabase secrets set MOTION_API_SECRET='<اي نص عشوائي طويل، مثال: openssl rand -hex 24>'
```
لاحظ: `GOOGLE_SERVICE_ACCOUNT_JSON` مش محتاج تحطه تاني — هو موجود أصلاً من
تركيب الكريتيف ونفس الـ function بتستخدمه.

### 4) حدّث الـ Secret في الفرونت إند
في `src/App.jsx` دور على السطر ده:
```js
const MOTION_API_SECRET = "wameed-motion-7c2e9a4f1b6d8e3a";
```
وغيّره لنفس القيمة اللي حطيتها في الخطوة اللي فاتت (`MOTION_API_SECRET`)، عشان
النظام يقدر يعدي من الـ auth check.

### 5) Deploy عادي على Vercel
زي أي تعديل تاني — push للـ GitHub، Vercel هيعمل Deploy تلقائي.

## ملاحظات مهمة
- **باج أمني لاحظته في `creative-sheet-api` الحالية**: فيه سطر `if (incomingSecret
  !== API_SECRET) {` من غير `return` بعده — يعني الـ check ده فعليًا **مش بيعمل
  حاجة** وأي حد يقدر يوصل للـ API بيتاعت الكريتيف من غير الـ secret خالص.
  صلّحتها في `motion-sheet-api` من الأول، بس تحب أصلّحها في الكريتيف كمان؟
- `Task Owner` بياخد الاسم من `users` (كل المستخدمين، مش بس role معين) — لو عايز
  تقصرها على أدوار معينة بس (زي الكريتيف اللي بتاخد الـ designers بس)، قولي.
- `Member` سيبته حقل تكست حر دلوقتي (مش لينكد بالـ users) — لو عايزها Dropdown
  من المستخدمين كمان زي Task Owner، قولّي أظبطها.
- لو حصل خطأ في المزامنة، مفيش جدول `sync_log` هنا لأن مفيش قاعدة بيانات وسيطة —
  الأخطاء بتظهر في الـ Console بس (`console.error`) ومفيش تخزين ليها.
