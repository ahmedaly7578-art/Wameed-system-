import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { WameedLogo, Avatar, ROLE_COLOR, ROLE_LABEL, COLORS } from '../components/ui'

const NAV = [
  { to: '/', icon: '⬡', label: 'الرئيسية', exact: true },
  { to: '/clients', icon: '👥', label: 'العملاء' },
  { to: '/capacity', icon: '⚡', label: 'Capacity' },
  { to: '/followup', icon: '📌', label: 'المتابعات' },
  { to: '/campaigns', icon: '📊', label: 'الحملات' },
  { to: '/ai', icon: '🤖', label: 'AI تحليل' },
  { to: '/tasks', icon: '✅', label: 'المهام' },
  { to: '/reports', icon: '📋', label: 'التقارير' },
  { to: '/churn', icon: '📉', label: 'Churn Tracker' },
  { to: '/targets', icon: '🎯', label: 'الأهداف' },
  { to: '/scorecard', icon: '🏆', label: 'Scorecard' },
  { to: '/satisfaction', icon: '⭐', label: 'رضا العملاء' },
  { to: '/payroll', icon: '💰', label: 'الرواتب', adminOnly: true },
  { to: '/team', icon: '🧑‍💼', label: 'إدارة الفريق', adminOnly: true },
]

export default function DashboardLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const visibleNav = NAV.filter(n => !n.adminOnly || profile?.role === 'admin')

  return (
    <div className="flex min-h-screen font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen flex flex-col overflow-y-auto z-50"
        style={{ width: 230, background: COLORS.bgCard, borderLeft: `1px solid ${COLORS.border}` }}>

        {/* Logo */}
        <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <WameedLogo size={24} />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {visibleNav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.exact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer w-full text-right
                ${isActive
                  ? 'font-semibold'
                  : 'font-normal hover:bg-white/5'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? `${COLORS.pink}18` : 'transparent',
                border: isActive ? `1px solid ${COLORS.pink}33` : '1px solid transparent',
                color: isActive ? COLORS.pink : COLORS.textS,
              })}
            >
              <span className="text-sm">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3.5 flex-shrink-0" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          {profile && (
            <div className="flex items-center gap-2.5 mb-2.5">
              <Avatar text={profile.avatar || profile.name?.slice(0, 2)} color={ROLE_COLOR[profile.role]} size={34} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: COLORS.text }}>{profile.name}</div>
                <div className="text-xs" style={{ color: ROLE_COLOR[profile.role] }}>{ROLE_LABEL[profile.role]}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full py-2 rounded-xl text-xs font-bold cursor-pointer font-cairo"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: COLORS.red }}>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-h-screen pb-10" style={{ marginRight: 230, background: COLORS.bg }}>
        <Outlet />
      </main>
    </div>
  )
}
