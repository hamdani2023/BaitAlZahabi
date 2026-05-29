'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import useStore from '@/lib/store'
import { LANGS, RESTAURANT_NAME, RESTAURANT_NAME_AR } from '@/lib/i18n'
import LangSwitcher from '@/components/LangSwitcher'
import RestaurantLogo from '@/components/RestaurantLogo'
import RestaurantFooter from '@/components/RestaurantFooter'

const TABLES = Array.from({length:20},(_,i)=>i+1)

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85',
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=85',
]


// أيقونات SVG للخدمات
const ServiceIcons = {
  menu: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13z"/><circle cx="9" cy="19" r="1" fill="#C9A84C"/><circle cx="17" cy="19" r="1" fill="#C9A84C"/>
    </svg>
  ),
  waiter: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  bill: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  feedback: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
}

export default function HomePage() {
  const router      = useRouter()
  const tableNumber = useStore(s => s.tableNumber)
  const setTable    = useStore(s => s.setTableNumber)
  const showToast   = useStore(s => s.showToast)
  const lang        = useStore(s => s.lang)
  const t           = LANGS[lang]

  const [heroIdx,    setHeroIdx]    = useState(0)
  const [showTables, setShowTables] = useState(false)
  const [particles,  setParticles]  = useState([])

  useEffect(() => {
    const ti = setInterval(() => setHeroIdx(i => (i+1) % HERO_IMGS.length), 5000)
    return () => clearInterval(ti)
  }, [])

  function pickTable(num) {
    setTable(String(num))
    showToast(`✦ ${t.tableSelected} ${num}`, 'gold')
    setParticles(Array.from({length:8}, (_,i) => ({ id: Date.now()+i, x: Math.random()*80+10, delay: i*0.1 })))
    setTimeout(() => setParticles([]), 2500)
  }

  function goToMenu() {
    if (!tableNumber) { showToast(t.selectTableFirst, 'red'); return }
    router.push('/menu')
  }

  const SERVICES = [
    { href:'/menu',     icon: ServiceIcons.menu,     title: t.foodMenu,   sub: t.foodMenuSub },
    { href:'/waiter',   icon: ServiceIcons.waiter,   title: t.callWaiter, sub: t.callWaiterSub },
    { href:'/bill',     icon: ServiceIcons.bill,      title: t.payment,    sub: t.paymentSub },
    { href:'/feedback', icon: ServiceIcons.feedback,  title: t.rating,     sub: t.ratingSub },
  ]

  return (
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t.dir }}>

      {/* ══ HERO ══ */}
      <div style={{ position:'relative', height:'100vw', maxHeight:'520px', overflow:'hidden' }}>
        {HERO_IMGS.map((img, i) => (
          <div key={i} style={{
            position:'absolute', inset:0,
            backgroundImage:`url(${img})`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity: i === heroIdx ? 1 : 0,
            transition:'opacity 1.2s ease',
          }}/>
        ))}
        <div className="hero-bg-overlay" style={{ position:'absolute', inset:0, zIndex:1 }}/>

        {/* شريط اللغة أعلى */}
        <div style={{ position:'absolute', top:'12px', left:'16px', right:'16px', zIndex:10, display:'flex', justifyContent: t.dir === 'rtl' ? 'flex-start' : 'flex-end' }}>
          <LangSwitcher />
        </div>

        {/* محتوى Hero */}
        <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'0 20px 32px', textAlign:'center' }}>
          <div style={{ marginBottom:'16px' }}>
            <RestaurantLogo size="lg" />
          </div>
          <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
            {HERO_IMGS.map((_,i) => (
              <div key={i} onClick={() => setHeroIdx(i)} style={{
                width: i===heroIdx ? '20px' : '6px',
                height:'6px', borderRadius:'3px', cursor:'pointer',
                background: i===heroIdx ? 'var(--gold)' : 'rgba(201,168,76,0.35)',
                transition:'all 0.4s',
              }}/>
            ))}
          </div>
          <button onClick={goToMenu} className="btn-gold-luxury" style={{ padding:'14px 36px', borderRadius:'50px', fontSize:'15px', letterSpacing:'1px', boxShadow:'0 8px 32px rgba(201,168,76,0.4)' }}>
            {t.browseMenu}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'0 16px' }}>

        {/* ══ اختيار الطاولة ══ */}
        <div style={{ padding:'24px 0 0' }}>
          <div className="ornament-line" style={{ marginBottom:'16px' }}>{t.selectTable}</div>
          <div className="luxury-card" style={{ padding:'18px', marginBottom:'16px', textAlign:'center', position:'relative' }}>
            {particles.map(p => (
              <div key={p.id} className="particle" style={{ left:`${p.x}%`, bottom:'50%', animationDelay:`${p.delay}s`, background:`hsl(${40+Math.random()*20}, 70%, 60%)` }}/>
            ))}
            <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.5)', letterSpacing:'3px', marginBottom:'8px' }}>{t.selectedTable.toUpperCase()}</div>
            <div className="font-cairo" style={{ fontSize:'42px', fontWeight:'900', lineHeight:1 }}>
              <span style={{ background:'linear-gradient(135deg,var(--gold-pale),var(--gold))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {tableNumber || '—'}
              </span>
            </div>
            <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.4)', marginTop:'4px' }}>
              {tableNumber ? `${t.tableSelected} ${tableNumber} — ${t.tableReady}` : t.selectTable}
            </div>
          </div>

          <button onClick={() => setShowTables(!showTables)} style={{
            width:'100%', padding:'11px', borderRadius:'12px',
            background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)',
            color:'var(--gold)', fontSize:'13px', fontWeight:'600',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            marginBottom: showTables ? '12px' : '0', transition:'all 0.3s',
          }}>
            {showTables ? `▲ ${t.hideTables}` : `▼ ${t.showTables}`}
          </button>

          {showTables && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px', marginBottom:'16px', animation:'fadeUp 0.3s ease' }}>
              {TABLES.map(n => {
                const sel = String(n) === tableNumber
                return (
                  <button key={n} onClick={() => pickTable(n)} style={{
                    aspectRatio:'1', borderRadius:'12px',
                    fontFamily:'Cairo,sans-serif', fontSize:'16px', fontWeight:'800',
                    cursor:'pointer', transition:'all 0.22s',
                    background: sel ? 'linear-gradient(135deg,var(--gold-dark),var(--gold))' : 'var(--dark-3)',
                    border: sel ? '1px solid var(--gold-light)' : '1px solid rgba(201,168,76,0.12)',
                    color: sel ? 'var(--dark)' : 'rgba(245,237,214,0.55)',
                    boxShadow: sel ? '0 4px 20px rgba(201,168,76,0.4)' : 'none',
                  }}>
                    {n}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ══ الخدمات ══ */}
        <div className="ornament-line" style={{ margin:'8px 0 16px' }}>{t.ourServices}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px' }}>
          {SERVICES.map(s => (
            <button key={s.href} onClick={() => router.push(s.href)} style={{
              borderRadius:'16px', overflow:'hidden', position:'relative',
              height:'110px', cursor:'pointer', border:'1px solid rgba(201,168,76,0.15)',
              background:'linear-gradient(145deg, var(--dark-3), var(--dark-2))',
              transition:'all 0.3s',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px',
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.5)';e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.15)';e.currentTarget.style.transform='translateY(0)'}}
            >
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }}/>
              <div style={{ filter:'drop-shadow(0 2px 8px rgba(201,168,76,0.3))' }}>{s.icon}</div>
              <span className="font-cairo" style={{ fontSize:'13px', fontWeight:'700', color:'var(--cream)' }}>{s.title}</span>
              <span style={{ fontSize:'10px', color:'rgba(245,237,214,0.4)' }}>{s.sub}</span>
            </button>
          ))}
        </div>


        {/* ══ زر البدء ══ */}
        <button onClick={goToMenu} className="btn-gold-luxury" style={{ width:'100%', padding:'16px', borderRadius:'16px', fontSize:'16px', letterSpacing:'1px', marginBottom:'16px', boxShadow:'0 8px 32px rgba(201,168,76,0.35)' }}>
          {t.startOrder}
        </button>

        {/* حالة المطعم */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', borderRadius:'12px', marginBottom:'0', background:'rgba(45,90,39,0.12)', border:'1px solid rgba(45,90,39,0.3)' }}>
          <div className="pulse-live" style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#3FB950', flexShrink:0 }}/>
          <span style={{ fontSize:'12px', color:'#6ECF5C', fontWeight:'500' }}>{t.restaurantOpen}</span>
        </div>
      </div>

      {/* ══ Footer ══ */}
      <RestaurantFooter />
    </div>
  )
}
