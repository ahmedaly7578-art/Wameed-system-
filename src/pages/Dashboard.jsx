import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card, StatCard, Badge, Avatar, PageHeader, COLORS, ROLE_COLOR, daysLeft, fmtDate, PLATFORM_COLOR } from '../components/ui'

export default function Dashboard() {
  const { profile } = useAuth()
  const [clients, setClients] = useState([])
  const [tasks, setTasks] = useState([])
  const [followups, setFollowups] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [{ data: cl }, { data: tk }, { data: fu }, { data: ca }] = await Promise.all([
      supabase.from('clients').select('*, mb:users!clients_mb_id_fkey(name, avatar, role)'),
      supabase.from('tasks').select('*'),
      supabase.from('follow_ups').select('*').order('date', { ascending: false }),
      supabase.from('campaigns').select('*').order('week_start', { ascending: false }),
    ])
    setClients(cl || [])
    setTasks(tk || [])
    setFollowups(fu || [])
    setCampaigns(ca || [])
    setLoading(false)
  }

  const active = clients.filter(c => c.status === 'active')
  const renewing = active.filter(c => { const d = daysLeft(c.end_date); return d > 0 && d <= 14 })
  const totalRev = active.reduce((s, c) => s + (c.pkg_amount || 0), 0)
  const avgROAS = campaigns.length ? (campaigns.reduce((s, c) => s + (c.roas || 0), 0) / campaigns.length).toFixed(1) : '—'
  const lateTasks = tasks.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date())

  // Late followups
  const lateFollowup = active.filter(c => {
    const last = followups.filter(f => f.client_id === c.id)[0]
    if (!last) return true
    return Math.floor((new Date() - new Date(last.date)) / 86400000) > 1
  })

  const platforms = ['Meta', 'Snapchat', 'TikTok', 'Google']
  const platCounts = platforms.map(p => ({
    name: p,
    count: clients.filter(c => c.platforms?.includes(p)).length
  })).filter(p => p.count > 0)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin-slow" />
    </div>
  )

  return (
    <div>
      <PageHeader title="لوحة التحكم" subtitle="نظرة عامة على الأداء والفريق">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: `${COLORS.green}18`, border: `1px solid ${COLORS.green}33`, color: COLORS.green }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.green, boxShadow: `0 0 6px ${COLORS.green}` }} />
          النظام يعمل
        </div>
      </PageHeader>

      <div className="px-4 md:px-8 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard label="العملاء النشطين" value={active.length} icon="👥" color={COLORS.pink} trend={12} sub={`${clients.filter(c => c.status === 'hold').length} موقوف`} />
          <StatCard label="إجمالي الإيرادات" value={`${(totalRev / 1000).toFixed(0)}k SAR`} icon="💰" color={COLORS.green} trend={5} />
          <StatCard label="متوسط ROAS" value={avgROAS} icon="📈" color={COLORS.purple} trend={8} />
          <StatCard label="تجديد خلال 14 يوم" value={renewing.length} icon="🔔" color={COLORS.orange} />
        </div>

        {/* Alerts */}
        {(lateFollowup.length > 0 || lateTasks.length > 0) && (
          <div className={`grid gap-3 grid-cols-1 ${lateFollowup.length && lateTasks.length ? 'md:grid-cols-2' : ''}`}>
            {lateFollowup.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: COLORS.red }}>متأخرون في الفولو أب ({lateFollowup.length})</div>
                  <div className="text-xs" style={{ color: 'rgba(248,113,113,0.7)' }}>{lateFollowup.map(c => c.name).join(' · ')}</div>
                </div>
              </div>
            )}
            {lateTasks.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <span className="text-xl">📋</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: COLORS.orange }}>مهام متأخرة ({lateTasks.length})</div>
                  <div className="text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>{lateTasks.slice(0, 3).map(t => t.title).join(' · ')}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* Renewals */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-bold" style={{ color: COLORS.text }}>تجديدات قريبة</div>
              <Badge label={`${renewing.length} عملاء`} color={COLORS.orange} />
            </div>
            {renewing.length === 0
              ? <div className="text-center py-5 text-sm" style={{ color: COLORS.textM }}>لا توجد تجديدات قريبة</div>
              : renewing.map(c => {
                const d = daysLeft(c.end_date)
                return (
                  <div key={c.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${d <= 7 ? COLORS.red + '33' : COLORS.orange + '22'}` }}>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: COLORS.text }}>{c.name}</div>
                      <div className="text-xs" style={{ color: COLORS.textS }}>{c.mb?.name || '—'}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold" style={{ color: d <= 7 ? COLORS.red : COLORS.orange }}>{d} يوم</div>
                      <div className="text-xs" style={{ color: COLORS.textM }}>{(c.pkg_amount || 0).toLocaleString()} SAR</div>
                    </div>
                  </div>
                )
              })
            }
          </Card>

          {/* Platform distribution */}
          <Card>
            <div className="text-sm font-bold mb-4" style={{ color: COLORS.text }}>توزيع المنصات</div>
            {platCounts.map(p => (
              <div key={p.name} className="flex items-center gap-2.5 mb-3">
                <div className="w-16 text-xs font-bold text-right" style={{ color: PLATFORM_COLOR[p.name] }}>{p.name}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(p.count / clients.length) * 100}%`, background: PLATFORM_COLOR[p.name] }} />
                </div>
                <div className="text-xs w-4" style={{ color: COLORS.textS }}>{p.count}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
