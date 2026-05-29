'use client'
import LangSwitcher from '@/components/LangSwitcher'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useStore from '@/lib/store'
import { getPendingCalls, getTablesStatus, updateCall } from '@/lib/api'
import { LANGS } from '@/lib/i18n'
import axios from 'axios'

const Icons = {
  bell:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  users:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  chart:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  table:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  check:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
  x:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  star:   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  order:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="17" cy="19" r="1" fill="currentColor"/></svg>,
  alert:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  trend:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
}

const WAITERS = [
  { id:1, name:'أحمد بن علي',   pin:'1234', section:'A', tables:[1,2,3,4,5],     ordersToday:14, callsToday:3,  avgRating:4.7, status:'active',  joinTime:'08:00' },
  { id:2, name:'فاطمة زهراء',  pin:'2345', section:'B', tables:[6,7,8,9,10],    ordersToday:11, callsToday:1,  avgRating:4.5, status:'active',  joinTime:'08:15' },
  { id:3, name:'كريم مسعود',   pin:'3456', section:'C', tables:[11,12,13,14,15], ordersToday:9, callsToday:2,  avgRating:4.3, status:'active',  joinTime:'08:30' },
  { id:4, name:'سامي العمراوي', pin:'4567', section:'VIP', tables:[16,17,18,19,20], ordersToday:12, callsToday:0, avgRating:4.8, status:'break', joinTime:'09:00' },
]

// أداء أسبوعي — كل يوم يحتوي على أداء كل نادل
const WEEKLY_DATA = [
  { dayKey:'sat', date:'11 Apr', waiters:{ 'أحمد':{ orders:8,  calls:2, rating:4.5 }, 'فاطمة':{ orders:7,  calls:1, rating:4.6 }, 'كريم':{ orders:6,  calls:1, rating:4.2 }, 'سامي':{ orders:9,  calls:0, rating:4.8 } } },
  { dayKey:'sun', date:'12 Apr', waiters:{ 'أحمد':{ orders:10, calls:3, rating:4.6 }, 'فاطمة':{ orders:9,  calls:1, rating:4.5 }, 'كريم':{ orders:7,  calls:2, rating:4.3 }, 'سامي':{ orders:11, calls:0, rating:4.9 } } },
  { dayKey:'mon', date:'13 Apr', waiters:{ 'أحمد':{ orders:12, calls:2, rating:4.7 }, 'فاطمة':{ orders:11, calls:0, rating:4.8 }, 'كريم':{ orders:8,  calls:3, rating:4.1 }, 'سامي':{ orders:10, calls:1, rating:4.7 } } },
  { dayKey:'tue', date:'14 Apr', waiters:{ 'أحمد':{ orders:11, calls:1, rating:4.8 }, 'فاطمة':{ orders:10, calls:2, rating:4.4 }, 'كريم':{ orders:9,  calls:1, rating:4.4 }, 'سامي':{ orders:13, calls:0, rating:4.9 } } },
  { dayKey:'wed', date:'15 Apr', waiters:{ 'أحمد':{ orders:14, calls:3, rating:4.6 }, 'فاطمة':{ orders:13, calls:1, rating:4.7 }, 'كريم':{ orders:10, calls:2, rating:4.3 }, 'سامي':{ orders:15, calls:0, rating:5.0 } } },
  { dayKey:'thu', date:'16 Apr', waiters:{ 'أحمد':{ orders:16, calls:4, rating:4.5 }, 'فاطمة':{ orders:14, calls:2, rating:4.6 }, 'كريم':{ orders:12, calls:1, rating:4.4 }, 'سامي':{ orders:17, calls:1, rating:4.8 } } },
  { dayKey:'fri', date:'17 Apr', waiters:{ 'أحمد':{ orders:14, calls:3, rating:4.7 }, 'فاطمة':{ orders:11, calls:1, rating:4.5 }, 'كريم':{ orders:9,  calls:2, rating:4.3 }, 'سامي':{ orders:12, calls:0, rating:4.8 } } },
]

const MONTHLY_TOP = [
  { name:'سامي العمراوي', totalOrders:312, totalCalls:3,  avgRating:4.85, badge:'🥇', trend:'+12%' },
  { name:'أحمد بن علي',   totalOrders:295, totalCalls:18, avgRating:4.65, badge:'🥈', trend:'+8%'  },
  { name:'فاطمة زهراء',  totalOrders:278, totalCalls:11, avgRating:4.58, badge:'🥉', trend:'+5%'  },
  { name:'كريم مسعود',   totalOrders:241, totalCalls:15, avgRating:4.32, badge:'4',  trend:'+2%'  },
]

const TABLE_STATUS_KEYS = { free:'hw_tableFree', occupied:'hw_tableOccupied', calling:'hw_tableCalling', reserved:'hw_tableReserved' }
const TABLE_STYLE_BASE = {
  free:     { bg:'rgba(30,25,15,0.8)',    border:'rgba(255,255,255,0.06)', color:'#3a3a3a' },
  occupied: { bg:'rgba(201,168,76,0.12)', border:'rgba(201,168,76,0.35)', color:'#C9A84C' },
  calling:  { bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.55)',  color:'#EF4444' },
  reserved: { bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.25)', color:'#3B82F6' },
}
const SECTION_COLORS = { A:'#C9A84C', B:'#3B82F6', C:'#10B981', VIP:'#8B5CF6' }
const WAITER_COLORS = ['#C9A84C','#3B82F6','#10B981','#8B5CF6']

export default function HeadWaiterPage() {
  const showToast = useStore(s => s.showToast)
  const lang = useStore(s => s.lang)
  const t = LANGS[lang] || LANGS.ar
  const qc = useQueryClient()
  const [tab, setTab] = useState('calls')
  const [perfMode, setPerfMode] = useState('weekly') // 'weekly' | 'monthly'
  const [selectedWaiter, setSelectedWaiter] = useState('all') // لتصفية الأسبوعي
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const { data: callsData = [] } = useQuery({ queryKey:['calls'], queryFn: getPendingCalls, refetchInterval:5000 })
  const [callsUI, setCallsUI] = useState([])
  useEffect(() => { setCallsUI(callsData) }, [callsData])

  const { data: tables = [] } = useQuery({ queryKey:['tables'], queryFn: getTablesStatus, refetchInterval:10000 })

  const acceptMutation = useMutation({
    mutationFn: ({ callId }) => updateCall({ callId, status:'accepted' }),
    onSuccess: (_, { callId }) => {
      setCallsUI(prev => prev.filter(c => c.id !== callId))
      qc.invalidateQueries({ queryKey:['calls'] })
      showToast('✓ ' + t.hw_callSent, 'green')
    },
  })

  const TABS = [
    { key:'calls',   label: t.hw_tabCalls,   icon:Icons.bell  },
    { key:'perf',    label: t.hw_tabPerf,     icon:Icons.chart  },
    { key:'tables',  label: t.hw_tabTables,   icon:Icons.table  },
    { key:'waiters', label: t.hw_tabWaiters,  icon:Icons.users  },
  ]

  // حساب إجمالي اليوم لكل نادل
  const todayData = WEEKLY_DATA[WEEKLY_DATA.length - 1]

  return (
    <div style={{ height:'100vh', overflowY:'auto', background:'#080604', direction: t.dir }}>

      {/* ══ Header ══ */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(8,6,4,0.97)', borderBottom:'1px solid rgba(201,168,76,0.15)', backdropFilter:'blur(20px)', padding:'14px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)' }}>
              {Icons.users}
            </div>
            <div>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'16px', fontWeight:'900', color:'var(--cream)' }}>{t.hw_title}</div>
              <div style={{ fontSize:'10px', color:'rgba(201,168,76,0.6)', letterSpacing:'1px' }}>Maison d'or</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ padding:'5px 12px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:'12px', fontFamily:'monospace', color:'#10B981', fontWeight:'700' }}>
              ⏱ {clock}
            </div>
            <LangSwitcher />
            {callsUI.length > 0 && (
              <div style={{ padding:'4px 10px', borderRadius:'10px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', fontSize:'12px', color:'#EF4444', fontWeight:'700', animation:'pulse-red 1.5s infinite' }}>
                🔔 {callsUI.length}
              </div>
            )}
          </div>
        </div>

        {/* إحصائيات سريعة اليوم */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'14px' }}>
          {[
            { label: t.hw_ordersToday, value: WAITERS.reduce((a,w)=>a+w.ordersToday,0), color:'#C9A84C',  icon:'🍽️' },
            { label: t.hw_calls,       value: WAITERS.reduce((a,w)=>a+w.callsToday,0),  color:'#EF4444',  icon:'🔔' },
            { label: t.hw_activeWaiters, value: WAITERS.filter(w=>w.status==='active').length, color:'#10B981', icon:'👥' },
            { label: t.hw_avgRating,   value: (WAITERS.reduce((a,w)=>a+w.avgRating,0)/WAITERS.length).toFixed(1), color:'#F59E0B', icon:'⭐' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'8px 6px', textAlign:'center' }}>
              <div style={{ fontSize:'14px', marginBottom:'2px' }}>{s.icon}</div>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'16px', fontWeight:'900', color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'9px', color:'#555', marginTop:'1px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'6px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'8px 4px', borderRadius:'10px', border:'none',
              fontFamily:'Cairo,sans-serif', fontSize:'11px', fontWeight:'700',
              cursor:'pointer', transition:'all 0.2s',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
              background: tab===t.key ? 'linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.1))' : 'rgba(255,255,255,0.03)',
              color: tab===t.key ? 'var(--gold)' : '#555',
              border: tab===t.key ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ color: tab===t.key ? 'var(--gold)' : '#555' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Content ══ */}
      <div style={{ padding:'16px', maxWidth:'600px', margin:'0 auto' }}>

        {/* ══ النداءات ══ */}
        {tab === 'calls' && (
          <div>
            {callsUI.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px', opacity:0.3 }}>🔔</div>
                <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'15px', fontWeight:'700', color:'#555', marginBottom:'6px' }}>{t.hw_noCalls}</div>
                <div style={{ fontSize:'12px', color:'#333' }}>{t.hw_noCallsSub}</div>
              </div>
            ) : callsUI.map(call => {
              const assignedWaiter = WAITERS.find(w => w.tables.includes(Number(call.tableNumber)))
              return (
                <div key={call.id} style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'16px', padding:'16px', marginBottom:'10px', animation:'fadeUp 0.3s ease' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0, animation:'livePulse 2s infinite' }}>🔔</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                        <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:'900', color:'var(--cream)' }}>{t.tableLabel} {call.tableNumber}</span>
                        <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', fontSize:'10px', color:'#EF4444', fontWeight:'700' }}>
                          {call.type === 'urgent' ? t.hw_urgent : call.message || t.hw_normalCall}
                        </span>
                      </div>
                      {assignedWaiter && (
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 10px', borderRadius:'10px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', marginBottom:'8px' }}>
                          <div style={{ width:'22px', height:'22px', borderRadius:'7px', background:`rgba(${SECTION_COLORS[assignedWaiter.section].slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(',') || '201,168,76'},0.15)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px' }}>👤</div>
                          <div>
                            <div style={{ fontSize:'11px', color:'rgba(201,168,76,0.7)', marginBottom:'1px' }}>{t.hw_assignTo}</div>
                            <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'800', color:'var(--gold)' }}>{assignedWaiter.name} — {t.hw_sectionLabel} {assignedWaiter.section}</div>
                          </div>
                        </div>
                      )}
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => acceptMutation.mutate({ callId: call.id })} style={{ flex:1, padding:'8px', borderRadius:'10px', border:'1px solid rgba(16,185,129,0.35)', background:'rgba(16,185,129,0.12)', color:'#10B981', fontSize:'12px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
                          {Icons.check} {t.hw_sendToWaiter}
                        </button>
                        <button onClick={() => setCallsUI(p => p.filter(c => c.id !== call.id))} style={{ width:'36px', borderRadius:'10px', border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.08)', color:'#EF4444', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {Icons.x}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ══ أداء الفريق ══ */}
        {tab === 'perf' && (
          <div>
            {/* اختيار الوضع */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
              {[
                { key:'weekly',  label: t.hw_weeklyBtn },
                { key:'monthly', label: t.hw_monthlyBtn },
              ].map(p => (
                <button key={p.key} onClick={() => setPerfMode(p.key)} style={{
                  flex:1, padding:'9px', borderRadius:'11px', border:'none',
                  fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700',
                  cursor:'pointer', transition:'all 0.2s',
                  background: perfMode===p.key ? 'linear-gradient(135deg,var(--gold-dark),var(--gold))' : 'rgba(255,255,255,0.04)',
                  color: perfMode===p.key ? '#0A0805' : '#666',
                  border: perfMode===p.key ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  {p.label}
                </button>
              ))}
            </div>

            {perfMode === 'weekly' && (
              <>
                {/* شرح واضح للقسم */}
                <div style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:'14px', padding:'14px 16px', marginBottom:'20px' }}>
                  <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:'800', color:'var(--gold)', marginBottom:'6px' }}>📊 {t.hw_weeklyPerf}</div>
                  <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.55)', lineHeight:1.7 }}>{t.hw_weeklyPerfSub}</div>
                </div>

                {/* مفتاح الألوان */}
                <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
                  {WAITERS.map((w,i) => (
                    <button key={w.name} onClick={() => setSelectedWaiter(selectedWaiter===w.name?'all':w.name)}
                      style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 10px', borderRadius:'8px', border:`1px solid ${WAITER_COLORS[i]}40`, background: selectedWaiter===w.name||selectedWaiter==='all' ? `rgba(${WAITER_COLORS[i].slice(1).match(/../g).map(h=>parseInt(h,16)).join(',')},0.15)` : 'rgba(255,255,255,0.02)', cursor:'pointer', transition:'all 0.2s' }}>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:WAITER_COLORS[i] }}/>
                      <span style={{ fontSize:'11px', fontFamily:'Cairo,sans-serif', fontWeight:'700', color: selectedWaiter===w.name ? WAITER_COLORS[i] : '#555' }}>{w.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* جدول الأداء اليومي */}
                {WEEKLY_DATA.map((dayData, di) => (
                  <div key={di} style={{ background:'rgba(15,12,8,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'14px', marginBottom:'10px' }}>
                    {/* رأس اليوم */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:'900', color:'var(--cream)' }}>{(t.days && t.days[dayData.dayKey]) || dayData.dayKey}</div>
                        <div style={{ fontSize:'11px', color:'#444' }}>{dayData.date}</div>
                        {di === WEEKLY_DATA.length - 1 && (
                          <span style={{ padding:'2px 7px', borderRadius:'6px', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)', fontSize:'9px', color:'#10B981', fontWeight:'700' }}>{t.hw_today}</span>
                        )}
                      </div>
                      <div style={{ fontSize:'11px', color:'#444' }}>
                        {t.hw_totalDay} <span style={{ color:'var(--gold)', fontWeight:'700' }}>
                          {Object.values(dayData.waiters).reduce((a,w)=>a+w.orders,0)} {t.hw_orders}
                        </span>
                      </div>
                    </div>

                    {/* أداء كل نادل في هذا اليوم */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                      {WAITERS.map((waiter, wi) => {
                        const wName = waiter.name.split(' ')[0]
                        const perf = dayData.waiters[wName] || { orders:0, calls:0, rating:0 }
                        const isFiltered = selectedWaiter !== 'all' && selectedWaiter !== waiter.name
                        const maxOrders = Math.max(...Object.values(dayData.waiters).map(w=>w.orders))
                        return (
                          <div key={wi} style={{ background: isFiltered ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isFiltered ? 'rgba(255,255,255,0.04)' : WAITER_COLORS[wi]+'25'}`, borderRadius:'11px', padding:'10px', opacity: isFiltered ? 0.35 : 1, transition:'all 0.2s' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
                              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:WAITER_COLORS[wi], flexShrink:0 }}/>
                              <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'11px', fontWeight:'800', color:'rgba(245,237,214,0.8)' }}>{wName}</span>
                            </div>
                            {/* شريط الطلبات */}
                            <div style={{ marginBottom:'6px' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'10px', color:'#666' }}>
                                  {Icons.order} {t.hw_orders}
                                </div>
                                <span style={{ fontSize:'11px', fontWeight:'900', color:WAITER_COLORS[wi] }}>{perf.orders}</span>
                              </div>
                              <div style={{ height:'5px', borderRadius:'3px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                                <div style={{ width:`${maxOrders > 0 ? (perf.orders/maxOrders)*100 : 0}%`, height:'100%', background:`linear-gradient(90deg,${WAITER_COLORS[wi]}80,${WAITER_COLORS[wi]})`, borderRadius:'3px', transition:'width 0.8s' }}/>
                              </div>
                            </div>
                            {/* النداءات والتقييم */}
                            <div style={{ display:'flex', justifyContent:'space-between' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'10px' }}>
                                <span style={{ color:'#EF4444' }}>{Icons.alert}</span>
                                <span style={{ color: perf.calls > 3 ? '#EF4444' : '#555' }}>{perf.calls} {t.hw_calls2}</span>
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:'2px', fontSize:'10px', color:'#F59E0B' }}>
                                {Icons.star}
                                <span style={{ fontWeight:'700' }}>{perf.rating}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {perfMode === 'monthly' && (
              <>
                <div style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:'14px', padding:'14px 16px', marginBottom:'20px' }}>
                  <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:'800', color:'var(--gold)', marginBottom:'4px' }}>{t.hw_monthTitle}</div>
                  <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.45)' }}>{t.hw_monthSub}</div>
                </div>
                {MONTHLY_TOP.map((w, i) => (
                  <div key={i} style={{ background: i===0 ? 'rgba(201,168,76,0.07)' : 'rgba(15,12,8,0.9)', border:`1px solid ${i===0?'rgba(201,168,76,0.3)':'rgba(255,255,255,0.07)'}`, borderRadius:'16px', padding:'16px', marginBottom:'10px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                      <div style={{ fontSize:'28px', width:'40px', textAlign:'center', flexShrink:0 }}>{w.badge}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                          <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'15px', fontWeight:'900', color:'var(--cream)' }}>{w.name}</span>
                          <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:'10px', color:'#10B981', fontWeight:'700' }}>{Icons.trend} {w.trend}</span>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
                          {[
                            { label: t.hw_totalOrders, value:w.totalOrders, color:WAITER_COLORS[i] },
                            { label: t.hw_totalCalls,  value:w.totalCalls,  color:'#EF4444' },
                            { label: t.hw_rating,      value:w.avgRating,   color:'#F59E0B' },
                          ].map(stat => (
                            <div key={stat.label} style={{ textAlign:'center', padding:'6px', borderRadius:'8px', background:'rgba(255,255,255,0.03)' }}>
                              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'15px', fontWeight:'900', color:stat.color }}>{stat.value}</div>
                              <div style={{ fontSize:'9px', color:'#444' }}>{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* شريط الأداء الإجمالي */}
                    <div style={{ marginTop:'10px' }}>
                      <div style={{ height:'4px', borderRadius:'3px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                        <div style={{ width:`${(w.totalOrders/312)*100}%`, height:'100%', background:`linear-gradient(90deg,${WAITER_COLORS[i]}60,${WAITER_COLORS[i]})`, borderRadius:'3px' }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ══ خريطة الطاولات ══ */}
        {tab === 'tables' && (
          <div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'16px' }}>
              {[
                { color:'rgba(201,168,76,0.5)',  label: t.hw_tableOccupied },
                { color:'rgba(239,68,68,0.55)',  label: t.hw_tableCalling  },
                { color:'rgba(59,130,246,0.35)', label: t.hw_tableReserved },
                { color:'rgba(50,40,25,0.9)',    label: t.hw_tableFree     },
              ].map(l => (
                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#555' }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'3px', background:l.color, border:'1px solid rgba(255,255,255,0.1)' }}/>
                  {l.label}
                </div>
              ))}
            </div>
            {[
              { sec:'A',   label: t.hw_sectionLabel + ' A', waiterName:'أحمد بن علي',   tableNums:[1,2,3,4,5]       },
              { sec:'B',   label: t.hw_sectionLabel + ' B', waiterName:'فاطمة زهراء',  tableNums:[6,7,8,9,10]      },
              { sec:'C',   label: t.hw_sectionLabel + ' C', waiterName:'كريم مسعود',   tableNums:[11,12,13,14,15]  },
              { sec:'VIP', label:'VIP',                     waiterName:'سامي العمراوي', tableNums:[16,17,18,19,20]  },
            ].map(sec => (
              <div key={sec.sec} style={{ marginBottom:'18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ padding:'4px 12px', borderRadius:'8px', background:`rgba(${SECTION_COLORS[sec.sec].slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(',') || '201,168,76'},0.12)`, border:`1px solid ${SECTION_COLORS[sec.sec]}35`, fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'900', color:SECTION_COLORS[sec.sec] }}>{sec.label}</div>
                  <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', color:'rgba(245,237,214,0.55)' }}>{sec.waiterName}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
                  {sec.tableNums.map(n => {
                    const tableData = tables.find(t2 => t2.number === n)
                    const status = tableData?.status?.toLowerCase() || 'free'
                    const ts = TABLE_STYLE_BASE[status] || TABLE_STYLE_BASE.free
                    const label = t[TABLE_STATUS_KEYS[status]] || status
                    return (
                      <div key={n}
                        onClick={() => showToast(`${t.tableLabel} ${n} — ${label}`, 'gold')}
                        style={{ aspectRatio:'1', borderRadius:'12px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'3px', background:ts.bg, border:`1px solid ${ts.border}`, transition:'all 0.2s' }}>
                        <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'17px', fontWeight:'900', color:ts.color }}>{n}</span>
                        <span style={{ fontSize:'8px', color:ts.color, opacity:.75 }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ فريق العمل ══ */}
        {tab === 'waiters' && (
          <div>
            {WAITERS.map((w, wi) => (
              <div key={w.id} style={{ background:'rgba(15,12,8,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'16px', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                  <div style={{ width:'50px', height:'50px', borderRadius:'14px', background:`rgba(${SECTION_COLORS[w.section].slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(',') || '201,168,76'},0.15)`, border:`1.5px solid ${SECTION_COLORS[w.section]}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>👤</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'15px', fontWeight:'900', color:'var(--cream)', marginBottom:'4px' }}>{w.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                      <span style={{ padding:'2px 8px', borderRadius:'6px', background:`rgba(${SECTION_COLORS[w.section].slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(',') || '201,168,76'},0.12)`, border:`1px solid ${SECTION_COLORS[w.section]}30`, fontSize:'10px', fontWeight:'700', color:SECTION_COLORS[w.section] }}>
                        {w.section === 'VIP' ? 'VIP' : `قسم ${w.section}`}
                      </span>
                      <span style={{ padding:'2px 8px', borderRadius:'6px', background: w.status==='active'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)', border: w.status==='active'?'1px solid rgba(16,185,129,0.25)':'1px solid rgba(245,158,11,0.25)', fontSize:'10px', fontWeight:'700', color: w.status==='active'?'#10B981':'#F59E0B' }}>
                        {w.status==='active' ? t.hw_active : t.hw_break}
                      </span>
                      <span style={{ fontSize:'10px', color:'#444' }}>{t.hw_joined} {w.joinTime}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'3px' }}>
                    <span style={{ color:'#F59E0B', fontSize:'14px' }}>⭐</span>
                    <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'17px', fontWeight:'900', color:'#F59E0B' }}>{w.avgRating}</span>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'12px' }}>
                  {[
                    { label: t.hw_ordersLbl, value:w.ordersToday,   color:WAITER_COLORS[wi], icon:'🍽️' },
                    { label: t.hw_callsLbl,  value:w.callsToday,    color:'#EF4444',          icon:'🔔' },
                    { label: t.hw_tablesLbl, value:w.tables.length, color:'#3B82F6',          icon:'🪑' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign:'center', padding:'10px 6px', borderRadius:'11px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize:'14px', marginBottom:'3px' }}>{s.icon}</div>
                      <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'18px', fontWeight:'900', color:s.color }}>{s.value}</div>
                      <div style={{ fontSize:'9px', color:'#444', marginTop:'2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'10px', color:'#444', marginLeft:'4px', alignSelf:'center' }}>{t.hw_waiterTables}</span>
                  {w.tables.map(n => (
                    <span key={n} style={{ padding:'3px 9px', borderRadius:'7px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', fontSize:'11px', color:'#666', fontFamily:'Cairo,sans-serif', fontWeight:'700' }}>{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
        @keyframes pulse-red { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  )
}
