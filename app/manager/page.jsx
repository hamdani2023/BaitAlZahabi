'use client'
import LangSwitcher from '@/components/LangSwitcher'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/lib/api'
import { LANGS } from '@/lib/i18n'
import useStore from '@/lib/store'

const Icons = {
  orders:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13z"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="17" cy="19" r="1" fill="currentColor"/></svg>,
  revenue: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  tables:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  chart:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  review:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
}

const DAILY_ORDERS = [
  { hour:'08:00', orders:4  }, { hour:'09:00', orders:7  }, { hour:'10:00', orders:12 },
  { hour:'11:00', orders:18 }, { hour:'12:00', orders:35 }, { hour:'13:00', orders:42 },
  { hour:'14:00', orders:38 }, { hour:'15:00', orders:22 }, { hour:'16:00', orders:15 },
  { hour:'17:00', orders:20 }, { hour:'18:00', orders:45 }, { hour:'19:00', orders:62 },
  { hour:'20:00', orders:70 }, { hour:'21:00', orders:55 }, { hour:'22:00', orders:30 },
]
// أيام وشهور بـ index ليتم ترجمتها من i18n
const WEEKLY_ORDERS  = [280,245,310,290,355,410,520].map((orders,i) => ({ dayIdx:i, orders }))
const MONTHLY_ORDERS = [8200,7800,9100,8600,9800,10200,11500,10800,9400,9900,8700,12000].map((orders,i) => ({ monthIdx:i, orders }))

const REVIEWS = [
  { table:5,  rating:5, commentKey:'r1', time:'20min', avatar:'👨' },
  { table:12, rating:4, commentKey:'r2', time:'45min', avatar:'👩' },
  { table:8,  rating:5, commentKey:'r3', time:'1h',    avatar:'👨‍💼' },
  { table:3,  rating:3, commentKey:'r4', time:'2h',    avatar:'👩‍💼' },
  { table:17, rating:5, commentKey:'r5', time:'3h',    avatar:'🧑' },
]

function MiniBar({ value, max, color }) {
  return (
    <div style={{ flex:1, height:'28px', borderRadius:'6px', background:'rgba(255,255,255,0.04)', position:'relative', overflow:'hidden' }}>
      <div style={{ width:`${(value/max)*100}%`, height:'100%', background:`linear-gradient(90deg,${color}60,${color})`, borderRadius:'6px', transition:'width 0.8s ease', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'6px' }}>
        <span style={{ fontSize:'10px', fontWeight:'700', color:'rgba(255,255,255,0.9)', fontFamily:'Cairo,sans-serif' }}>{value}</span>
      </div>
    </div>
  )
}

export default function ManagerPage() {
  const lang = useStore(s => s.lang)
  const t    = LANGS[lang] || LANGS.ar

  const [tab,    setTab]    = useState('stats')
  const [period, setPeriod] = useState('daily')
  const [clock,  setClock]  = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  const { data: stats = { todayOrders:0, revenue:0, occupiedTables:0, pendingCalls:0 } } = useQuery({
    queryKey: ['dashboard'],
    queryFn:  getDashboard,
    staleTime: 60_000,
  })

  // ترجمة بيانات الرسم البياني
  const periodData = period === 'daily'
    ? DAILY_ORDERS.map(d => ({ label: d.hour, orders: d.orders }))
    : period === 'weekly'
    ? WEEKLY_ORDERS.map(d => ({ label: (t.weekDays || [])[d.dayIdx] || d.dayIdx, orders: d.orders }))
    : MONTHLY_ORDERS.map(d => ({ label: (t.months || [])[d.monthIdx] || d.monthIdx, orders: d.orders }))

  const maxOrders   = Math.max(...periodData.map(d => d.orders))
  const totalOrders = periodData.reduce((a,b) => a + b.orders, 0)
  const avgRating   = (REVIEWS.reduce((a,b) => a + b.rating, 0) / REVIEWS.length).toFixed(1)

  // تعليقات التقييمات مترجمة
  const reviewComments = {
    ar: { r1:'طعام رائع وخدمة ممتازة! سنعود حتماً', r2:'تجربة جميلة، الأكل لذيذ والجو هادئ', r3:'أفضل مطعم في المدينة، الكنافة ممتازة', r4:'الطعام جيد لكن الانتظار كان طويلاً', r5:'خدمة راقية وطعام من أعلى المستويات' },
    fr: { r1:'Nourriture excellente et service impeccable!', r2:'Belle expérience, cuisine délicieuse et ambiance calme', r3:'Meilleur restaurant de la ville, le knafeh est incroyable', r4:'Bonne nourriture mais l\'attente était longue', r5:'Service raffiné et cuisine de très haute qualité' },
    en: { r1:'Amazing food and excellent service! We\'ll definitely return', r2:'Lovely experience, delicious food and relaxing atmosphere', r3:'Best restaurant in the city, the knafeh is incredible', r4:'Good food but the wait was long', r5:'Refined service and top-quality cuisine' },
  }

  // وقت التقييمات مترجم
  const reviewTimes = {
    ar: { '20min':'منذ 20 دقيقة', '45min':'منذ 45 دقيقة', '1h':'منذ ساعة', '2h':'منذ ساعتين', '3h':'منذ 3 ساعات' },
    fr: { '20min':'Il y a 20 min', '45min':'Il y a 45 min', '1h':'Il y a 1h', '2h':'Il y a 2h', '3h':'Il y a 3h' },
    en: { '20min':'20 min ago', '45min':'45 min ago', '1h':'1 hour ago', '2h':'2 hours ago', '3h':'3 hours ago' },
  }

  const TABS = [
    { key:'stats',   label: t.mg_tabStats,   icon: Icons.chart  },
    { key:'reviews', label: t.mg_tabReviews, icon: Icons.review },
  ]

  const SUMMARY_CARDS = [
    { icon: Icons.orders,  value: stats.todayOrders,                             label: t.mg_ordersToday,    color:'#C9A84C', delta:'+12%' },
    { icon: Icons.revenue, value: `${stats.revenue.toLocaleString()} ${t.mg_currency}`, label: t.mg_revenueToday, color:'#10B981', delta:'+8%'  },
    { icon: Icons.tables,  value: `${stats.occupiedTables}/20`,                  label: t.mg_occupiedTables, color:'#3B82F6', delta:'70%'  },
    { icon: Icons.star,    value: avgRating,                                      label: t.mg_avgRating,      color:'#F59E0B', delta:'⭐⭐⭐⭐⭐' },
  ]

  const chartPeriodLabel = period === 'daily' ? t.mg_chartDay : period === 'weekly' ? t.mg_chartWeek : t.mg_chartYear

  return (
    <div style={{ height:'100vh', overflowY:'auto', background:'#070504', direction: t.dir }}>

      {/* ══ Header ══ */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(7,5,4,0.97)', borderBottom:'1px solid rgba(201,168,76,0.15)', backdropFilter:'blur(20px)', padding:'14px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.05))', border:'1px solid rgba(201,168,76,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)' }}>
              {Icons.chart}
            </div>
            <div>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'17px', fontWeight:'900', background:'linear-gradient(135deg,#F5E6B8,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {t.mg_title}
              </div>
              <div style={{ fontSize:'10px', color:'rgba(201,168,76,0.55)', letterSpacing:'2px' }}>Maison d'or — {clock}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <LangSwitcher />
            <a href="/" style={{ padding:'6px 14px', borderRadius:'8px', textDecoration:'none', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', color:'var(--gold)', fontSize:'12px', fontWeight:'700', fontFamily:'Cairo,sans-serif' }}>
              {t.mg_backHome}
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'8px' }}>
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
              padding:'9px', borderRadius:'11px', border:'none',
              fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700', cursor:'pointer',
              background: tab===tb.key ? 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.07))' : 'rgba(255,255,255,0.04)',
              color: tab===tb.key ? 'var(--gold)' : '#555',
              borderBottom: tab===tb.key ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
              transition:'all 0.2s',
            }}>
              <span style={{ color: tab===tb.key ? 'var(--gold)' : '#444' }}>{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'16px 16px 40px' }}>

        {/* ══ بطاقات الملخص ══ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px' }}>
          {SUMMARY_CARDS.map((s, i) => (
            <div key={i} style={{ background:'#0F0D0A', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'16px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,transparent,${s.color},transparent)`, opacity:.8 }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ color:s.color }}>{s.icon}</div>
                <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)', padding:'2px 7px', borderRadius:'20px' }}>{s.delta}</span>
              </div>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'24px', fontWeight:'900', color:s.color, margin:'8px 0 3px' }}>{s.value}</div>
              <div style={{ fontSize:'11px', color:'#555' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══ TAB: إحصاءات الطلبات ══ */}
        {tab === 'stats' && (
          <div>
            {/* اختيار الفترة */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
              {[['daily', t.mg_periodDaily],['weekly', t.mg_periodWeekly],['monthly', t.mg_periodMonthly]].map(([k,l]) => (
                <button key={k} onClick={() => setPeriod(k)} style={{
                  flex:1, padding:'8px', borderRadius:'10px', border:'none',
                  fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700', cursor:'pointer',
                  background: period===k ? 'linear-gradient(135deg,var(--gold-dark),var(--gold))' : 'rgba(255,255,255,0.05)',
                  color: period===k ? 'var(--dark)' : '#666',
                  transition:'all 0.2s',
                }}>{l}</button>
              ))}
            </div>

            {/* إجمالي */}
            <div style={{ background:'#0F0D0A', border:'1px solid rgba(201,168,76,0.2)', borderRadius:'14px', padding:'14px 16px', marginBottom:'14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'11px', color:'rgba(201,168,76,0.6)', marginBottom:'3px', letterSpacing:'1px' }}>{t.mg_totalPeriod}</div>
                <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'26px', fontWeight:'900', color:'var(--gold)' }}>{totalOrders.toLocaleString()}</div>
                <div style={{ fontSize:'10px', color:'#555' }}>{t.mg_orders}</div>
              </div>
              <div style={{ width:'50px', height:'50px', borderRadius:'50%', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)' }}>
                {Icons.orders}
              </div>
            </div>

            {/* الرسم البياني */}
            <div style={{ background:'#0F0D0A', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700', color:'rgba(201,168,76,0.7)', marginBottom:'14px', letterSpacing:'1px' }}>
                {t.mg_chartTitle} — {chartPeriodLabel}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {periodData.map((d, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ fontSize:'11px', color:'#666', width: period==='monthly' ? '55px' : '42px', flexShrink:0, textAlign:'right', fontFamily:'Cairo,sans-serif' }}>
                      {d.label}
                    </span>
                    <MiniBar value={d.orders} max={maxOrders} color="#C9A84C" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: تقييمات الزبائن ══ */}
        {tab === 'reviews' && (
          <div>
            {/* ملخص */}
            <div style={{ background:'#0F0D0A', border:'1px solid rgba(201,168,76,0.2)', borderRadius:'16px', padding:'18px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'20px' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'42px', fontWeight:'900', color:'var(--gold)', lineHeight:1 }}>{avgRating}</div>
                <div style={{ display:'flex', justifyContent:'center', gap:'2px', margin:'6px 0' }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(avgRating) ? '#C9A84C' : 'rgba(201,168,76,0.2)', fontSize:'14px' }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize:'10px', color:'#555' }}>{REVIEWS.length} {t.mg_reviewsCount}</div>
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
                {[5,4,3,2,1].map(n => {
                  const count = REVIEWS.filter(r => r.rating === n).length
                  return (
                    <div key={n} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontSize:'10px', color:'var(--gold)', width:'12px', textAlign:'center' }}>{n}</span>
                      <span style={{ color:'var(--gold)', fontSize:'10px' }}>★</span>
                      <div style={{ flex:1, height:'5px', borderRadius:'3px', background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                        <div style={{ width:`${(count/REVIEWS.length)*100}%`, height:'100%', background:'linear-gradient(90deg,var(--gold-dark),var(--gold))', borderRadius:'3px' }}/>
                      </div>
                      <span style={{ fontSize:'10px', color:'#555', width:'16px' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* قائمة التقييمات */}
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background:'#0F0D0A', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'14px 16px', marginBottom:'10px', animation:'fadeUp 0.4s both', animationDelay:`${i*0.05}s` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'12px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{r.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:'800', color:'var(--cream)' }}>{t.mg_tableLabel} {r.table}</span>
                      <div style={{ display:'flex', gap:'2px' }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= r.rating ? '#C9A84C' : 'rgba(201,168,76,0.2)', fontSize:'11px' }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize:'10px', color:'#555', marginRight:'auto' }}>
                        {(reviewTimes[lang] || reviewTimes.ar)[r.time]}
                      </span>
                    </div>
                    <p style={{ fontSize:'13px', color:'rgba(245,237,214,0.65)', lineHeight:1.6, margin:0 }}>
                      {(reviewComments[lang] || reviewComments.ar)[r.commentKey]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  )
}
