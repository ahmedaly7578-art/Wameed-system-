// ── Placeholder pages — each will be fully built next ──────────────────────
import { PageHeader, Card, COLORS } from '../components/ui'

function ComingSoon({ title, icon, desc }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="px-4 md:px-8">
        <Card className="text-center py-14 md:py-20">
          <div className="text-5xl mb-4">{icon}</div>
          <div className="text-base font-bold mb-2" style={{ color: COLORS.text }}>{title}</div>
          <div className="text-sm" style={{ color: COLORS.textS }}>{desc || 'هذه الصفحة جاهزة للبيانات الحقيقية من Supabase'}</div>
        </Card>
      </div>
    </div>
  )
}

export function Clients() { return <ComingSoon title="العملاء 👥" icon="👥" /> }
export function ClientDetail() { return <ComingSoon title="تفاصيل العميل" icon="🏪" /> }
export function Capacity() { return <ComingSoon title="Capacity الفريق ⚡" icon="⚡" /> }
export function FollowUp() { return <ComingSoon title="المتابعات اليومية 📌" icon="📌" /> }
export function Campaigns() { return <ComingSoon title="الحملات والأداء 📊" icon="📊" /> }
export function AIAnalysis() { return <ComingSoon title="AI تحليل 🤖" icon="🤖" /> }
export function Tasks() { return <ComingSoon title="المهام ✅" icon="✅" /> }
export function Reports() { return <ComingSoon title="التقارير 📋" icon="📋" /> }
export function ChurnTracker() { return <ComingSoon title="Churn Tracker 📉" icon="📉" /> }
export function Targets() { return <ComingSoon title="الأهداف 🎯" icon="🎯" /> }
export function Scorecard() { return <ComingSoon title="Scorecard 🏆" icon="🏆" /> }
export function Satisfaction() { return <ComingSoon title="رضا العملاء ⭐" icon="⭐" /> }
export function Payroll() { return <ComingSoon title="الرواتب 💰" icon="💰" /> }
export function TeamManagement() { return <ComingSoon title="إدارة الفريق 🧑‍💼" icon="🧑‍💼" /> }
export function ClientPortal() { return <ComingSoon title="بوابة العميل" icon="🔑" /> }
export function NotFound() { return <ComingSoon title="404 — الصفحة غير موجودة" icon="🔍" /> }
