import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { COLORS } from '../components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('أدخل البريد الإلكتروني وكلمة المرور')
      triggerShake()
      return
    }
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError('البريد أو كلمة المرور غير صحيحة')
      triggerShake()
    }
    setLoading(false)
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-cairo relative overflow-hidden" dir="rtl"
      style={{ background: COLORS.bg }}>

      {/* Glow blobs */}
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,111,224,0.10) 0%, transparent 70%)', top: -200, right: -100 }} />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,160,0.08) 0%, transparent 70%)', bottom: -150, left: 0 }} />

      <div className="flex w-full max-w-[900px] min-h-screen">
        {/* Left: Brand */}
        <div className="flex-1 flex flex-col items-center justify-center px-16"
          style={{ borderLeft: `1px solid ${COLORS.border}`, background: 'rgba(13,21,38,0.5)' }}>

          <div className="text-center mb-12">
            <svg width={64} height={64} viewBox="0 0 60 60" fill="none" className="mx-auto mb-5"
              style={{ filter: 'drop-shadow(0 0 20px rgba(232,121,160,0.4))' }}>
              <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E879A0" /><stop offset="100%" stopColor="#7B6FE0" />
                </linearGradient>
              </defs>
              <path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#lg)" />
            </svg>
            <div className="text-white font-black leading-none mb-2" style={{ fontSize: 44 }}>وميض</div>
            <div className="font-bold" style={{ fontSize: 13, letterSpacing: '0.5em', background: COLORS.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WAMEED
            </div>
          </div>

          {[
            ['📌', 'متابعات يومية لكل عميل'],
            ['📊', 'تحليل الحملات عبر المنصات'],
            ['🤖', 'AI تحليل ذكي وتوصيات'],
            ['🏆', 'Scorecard وتقييم الأداء'],
            ['🔔', 'إشعارات فورية'],
            ['📉', 'Churn Tracker'],
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-center gap-3.5 mb-3 w-full max-w-xs">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}` }}>
                {icon}
              </div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</div>
            </div>
          ))}

          <div className="mt-auto pt-10 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2025 وميض · بُني بواسطة أحمد علي
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-[420px] flex flex-col items-center justify-center px-12">
          <div className={`w-full ${shake ? 'animate-shake' : ''}`}
            style={{ animation: shake ? 'shake 0.5s ease' : 'none' }}>

            <div className="mb-8">
              <div className="font-black mb-1.5 text-white" style={{ fontSize: 24 }}>تسجيل الدخول</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>أدخل بياناتك للوصول إلى النظام</div>
            </div>

            {/* Email */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>البريد الإلكتروني</label>
              <div className="relative">
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="example@wameed.sa"
                  className="w-full py-3 pr-4 pl-10 rounded-xl text-sm outline-none font-cairo"
                  dir="ltr"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(248,113,113,0.4)' : COLORS.border}`, color: 'white' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,121,160,0.5)'}
                  onBlur={e => e.target.style.borderColor = error ? 'rgba(248,113,113,0.4)' : COLORS.border}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base" style={{ color: 'rgba(255,255,255,0.25)' }}>✉</span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full py-3 px-10 rounded-xl text-sm outline-none font-cairo"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(248,113,113,0.4)' : COLORS.border}`, color: 'white', letterSpacing: showPass ? 'normal' : '2px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(123,111,224,0.5)'}
                  onBlur={e => e.target.style.borderColor = error ? 'rgba(248,113,113,0.4)' : COLORS.border}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base" style={{ color: 'rgba(255,255,255,0.25)' }}>🔒</span>
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3.5 text-xs"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#FCA5A5' }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer font-cairo disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? 'rgba(255,255,255,0.08)' : COLORS.grad, border: 'none', color: 'white', boxShadow: loading ? 'none' : '0 8px 28px rgba(232,121,160,0.25)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2.5">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow inline-block" />
                  جاري التحقق...
                </span>
                : 'دخول إلى النظام →'
              }
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
        }
      `}</style>
    </div>
  )
}
