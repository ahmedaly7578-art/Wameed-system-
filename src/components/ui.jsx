// ─── COLORS ──────────────────────────────────────────────────────────────────
export const COLORS = {
  bg: '#070E1F',
  bgCard: '#0D1526',
  bgHover: '#111E35',
  border: 'rgba(255,255,255,0.07)',
  borderH: 'rgba(255,255,255,0.14)',
  text: '#F1F5FF',
  textS: 'rgba(255,255,255,0.5)',
  textM: 'rgba(255,255,255,0.25)',
  pink: '#E879A0',
  purple: '#7B6FE0',
  green: '#34D399',
  blue: '#60A5FA',
  orange: '#F59E0B',
  red: '#F87171',
  teal: '#2DD4BF',
  grad: 'linear-gradient(135deg, #E879A0 0%, #7B6FE0 100%)',
}

export const ROLE_COLOR = {
  admin: '#E879A0',
  media_buyer: '#7B6FE0',
  social_media: '#34D399',
  account_manager: '#60A5FA',
}

export const ROLE_LABEL = {
  admin: 'مدير النظام',
  media_buyer: 'Media Buyer',
  social_media: 'Social Media',
  account_manager: 'Account Manager',
}

export const STATUS_COLOR = { active: '#34D399', hold: '#F59E0B', cancelled: '#F87171' }
export const STATUS_LABEL = { active: 'نشط', hold: 'موقوف', cancelled: 'ملغي' }

export const PLATFORM_COLOR = {
  Meta: '#1877F2', TikTok: '#EE1D52', Snapchat: '#B8A000',
  Google: '#4285F4', YouTube: '#FF0000', X: '#1DA1F2',
}
export const PLATFORMS = ['Meta', 'Snapchat', 'TikTok', 'Google', 'YouTube', 'X']

// ─── WAMEED LOGO ─────────────────────────────────────────────────────────────
export function WameedLogo({ size = 24, showText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <defs>
          <linearGradient id="wl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E879A0" />
            <stop offset="100%" stopColor="#7B6FE0" />
          </linearGradient>
        </defs>
        <path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#wl)" />
      </svg>
      {showText && (
        <div>
          <div className="text-white font-black leading-tight" style={{ fontSize: size * 0.65 }}>وميض</div>
          <div className="font-bold tracking-widest"
            style={{ fontSize: size * 0.35, letterSpacing: '0.2em', background: COLORS.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WAMEED
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-white/15' : ''} ${className}`}
      style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, ...style }}
    >
      {children}
    </div>
  )
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ label, color, dot = true }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
      {dot && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />}
      {label}
    </span>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({ text, color, size = 36 }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, background: `${color}22`, border: `1.5px solid ${color}55`, color, fontSize: size * 0.3 }}>
      {text}
    </div>
  )
}

// ─── PLATFORM TAG ─────────────────────────────────────────────────────────────
export function PlatformTag({ name }) {
  const color = PLATFORM_COLOR[name] || COLORS.purple
  return (
    <span className="text-xs px-2 py-0.5 rounded-md font-semibold whitespace-nowrap"
      style={{ background: `${color}22`, color, border: `1px solid ${color}33` }}>
      {name}
    </span>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, color, trend }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}18` }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className="text-xs font-semibold" style={{ color: trend >= 0 ? COLORS.green : COLORS.red }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black mb-1" style={{ color: COLORS.text }}>{value}</div>
      <div className="text-xs" style={{ color: COLORS.textS }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: COLORS.textM }}>{sub}</div>}
    </Card>
  )
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = 'text', placeholder, required, className = '' }) {
  return (
    <div className={`mb-3.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textS }}>
          {label}{required && <span className="text-pink-400 mr-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all font-cairo"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}`, color: COLORS.text }}
        onFocus={e => e.target.style.borderColor = COLORS.pink}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
    </div>
  )
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, placeholder, required }) {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textS }}>
          {label}{required && <span className="text-pink-400 mr-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none cursor-pointer font-cairo"
        style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, color: value ? COLORS.text : COLORS.textM }}
      >
        <option value="">{placeholder || 'اختر...'}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) {
  const styles = {
    primary: { background: COLORS.grad, color: 'white', border: 'none' },
    secondary: { background: 'rgba(255,255,255,0.05)', color: COLORS.textS, border: `1px solid ${COLORS.border}` },
    danger: { background: 'rgba(248,113,113,0.1)', color: COLORS.red, border: '1px solid rgba(248,113,113,0.25)' },
    ghost: { background: 'transparent', color: COLORS.textS, border: `1px solid ${COLORS.border}` },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all font-cairo disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="rounded-2xl p-7 max-h-[90vh] overflow-y-auto"
        style={{ background: '#0A1220', border: `1px solid ${COLORS.border}`, width, maxWidth: '95vw', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="text-base font-black" style={{ color: COLORS.text }}>{title}</div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ background: 'none', border: 'none', color: COLORS.textM }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-6 px-8 pt-6">
      <div>
        <h1 className="text-xl font-black mb-1" style={{ color: COLORS.text }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: COLORS.textS }}>{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2.5 items-center">{children}</div>}
    </div>
  )
}

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <div className="animate-spin-slow rounded-full border-2 border-white/20 border-t-white inline-block"
      style={{ width: size, height: size }} />
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <Card className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-base font-bold mb-2" style={{ color: COLORS.text }}>{title}</div>
      {description && <div className="text-xs mb-5" style={{ color: COLORS.textS }}>{description}</div>}
      {action}
    </Card>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const daysLeft = (date) => Math.ceil((new Date(date) - new Date()) / 86400000)
export const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d); return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}` }
export const pct = (a, b) => Math.min(100, Math.round((a / b) * 100))
export const capColor = (p) => p >= 90 ? COLORS.red : p >= 70 ? COLORS.orange : COLORS.green
export const initials = (n) => n?.split(' ').map(w => w[0]).join('').slice(0, 2) || '؟'
export const todayStr = () => new Date().toISOString().split('T')[0]
