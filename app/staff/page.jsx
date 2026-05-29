'use client'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useStore from '@/lib/store'
import { getPendingCalls, updateCall } from '@/lib/api'
import { LANGS } from '@/lib/i18n'
import LangSwitcher from '@/components/LangSwitcher'

const Icons = {
  bell: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>),
  check: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>),
  x: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  sections: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>),
  person: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  logout: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  notif: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>),
  table: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><line x1="7" y1="12" x2="7" y2="20"/><line x1="17" y1="12" x2="17" y2="20"/><line x1="5" y1="20" x2="9" y2="20"/><line x1="15" y1="20" x2="19" y2="20"/></svg>),
}

const SECTIONS_BASE = [
  { key:'A', color:'#C9A84C', tables:[1,2,3,4,5],     gradient:'rgba(201,168,76,' },
  { key:'B', color:'#3B82F6', tables:[6,7,8,9,10],    gradient:'rgba(59,130,246,' },
  { key:'C', color:'#10B981', tables:[11,12,13,14,15], gradient:'rgba(16,185,129,' },
  { key:'D', color:'#8B5CF6', tables:[16,17,18,19,20], gradient:'rgba(139,92,246,' },
]

function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(); osc.stop(ctx.currentTime + 0.6)
  } catch(e) {}
}

function NotifToast({ notif, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:'12px',
      background:'rgba(18,14,9,0.97)',
      border:`1px solid ${notif.color}50`,
      borderLeft:`3px solid ${notif.color}`,
      borderRadius:'14px', padding:'13px 14px',
      boxShadow:`0 8px 32px rgba(0,0,0,0.7), 0 0 20px ${notif.color}20`,
      animation:'slideInRight 0.3s ease',
      backdropFilter:'blur(20px)',
      minWidth:'280px', maxWidth:'320px',
    }}>
      <div style={{ width:'36px',height:'36px',borderRadius:'10px',flexShrink:0, background:`${notif.gradientBase}0.15)`,border:`1px solid ${notif.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px' }}>🔔</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'12px',fontWeight:'800',color:notif.color,marginBottom:'3px' }}>{notif.title}</div>
        <div style={{ fontSize:'12px',color:'rgba(245,237,214,0.75)',lineHeight:1.4 }}>{notif.body}</div>
        <div style={{ fontSize:'10px',color:'rgba(245,237,214,0.35)',marginTop:'4px' }}>{notif.time}</div>
      </div>
      <button onClick={onClose} style={{ background:'none',border:'none',color:'rgba(245,237,214,0.3)',cursor:'pointer',padding:'2px',flexShrink:0 }}>{Icons.x}</button>
    </div>
  )
}

export default function StaffPage() {
  const showToast = useStore(s => s.showToast)
  const lang = useStore(s => s.lang)
  const t = LANGS[lang] || LANGS.ar
  const qc = useQueryClient()
  const SECTIONS = SECTIONS_BASE.map(s => ({ ...s, label: t.st_sectionLabel + ' ' + s.key }))
  const [selectedSection, setSelectedSection] = useState(null)
  const [waiterName, setWaiterName] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [mySection, setMySection] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [toastNotifs, setToastNotifs] = useState([])
  const prevCallsRef = useRef([])

  const { data: allCalls = [] } = useQuery({
    queryKey: ['calls'],
    queryFn: getPendingCalls,
    refetchInterval: 4_000,
  })

  const myCalls = mySection
    ? allCalls.filter(call => {
        const tableNum = Number(call.tableNumber || call.table?.replace(/[^0-9]/g,''))
        return mySection.tables.includes(tableNum)
      })
    : []

  useEffect(() => {
    if (!isRegistered || !mySection) return
    const prevIds = new Set(prevCallsRef.current.map(c => c.id))
    const newCalls = myCalls.filter(c => !prevIds.has(c.id))
    if (newCalls.length > 0) {
      newCalls.forEach(call => {
        playNotifSound()
        const time = new Date().toLocaleTimeString('ar-DZ', { hour:'2-digit', minute:'2-digit' })
        setNotifications(p => [{ id:call.id+'_h_'+Date.now(), text:`🔔 ${t.st_newCall} • ${t.tableLabel || 'Table'} ${call.table}`, req:call.request, time }, ...p.slice(0,14)])
        setToastNotifs(p => [{ id:call.id+'_t_'+Date.now(), title:`${t.st_newCall} • ${t.tableLabel || 'Table'} ${call.table}`, body:call.request||t.callWaiterSub, time, color:mySection.color, gradientBase:mySection.gradient }, ...p.slice(0,3)])
        if (Notification.permission === 'granted') {
          new Notification("Maison d'or — " + mySection.label, { body:`طاولة ${call.table}: ${call.request}`, icon:'/favicon.ico' })
        }
      })
    }
    prevCallsRef.current = myCalls
  }, [myCalls, isRegistered, mySection, t])

  const acceptMutation = useMutation({
    mutationFn: ({ callId }) => updateCall({ callId, status:'accepted' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey:['calls'] }); showToast(t.st_callAccepted,'green') },
  })

  function register() {
    if (!waiterName.trim() || !selectedSection) { showToast(t.st_enterNameSection,'red'); return }
    const sec = SECTIONS.find(s => s.key === selectedSection)
    setMySection(sec); setIsRegistered(true)
    if ('Notification' in window) Notification.requestPermission()
    showToast(`${t.st_welcome} ${waiterName} — ${sec?.label}`,'gold')
  }

  // ══════ صفحة تسجيل الدخول ══════
  if (!isRegistered) {
    return (
      <div className="scrollable page-in" style={{
        background:`
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 100%, rgba(201,168,76,0.06) 0%, transparent 50%),
          linear-gradient(180deg,#0A0805 0%,#0E0A06 40%,#080604 100%)
        `,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'24px', direction: t.dir,
        minHeight:'calc(100vh - var(--nav-h))',
      }}>
        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'420px' }}>
          <div style={{ textAlign:'center', marginBottom:'40px' }}>
            <div style={{ width:'80px',height:'80px',borderRadius:'50%',margin:'0 auto 16px', background:'radial-gradient(circle at 35% 35%,rgba(201,168,76,0.25),rgba(139,105,20,0.08) 60%,rgba(10,8,5,0.9))', border:'1.5px solid rgba(201,168,76,0.45)',boxShadow:'0 0 40px rgba(201,168,76,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px' }}>🏛️</div>
            <div style={{ fontFamily:"Playfair Display,serif",fontSize:'26px',fontStyle:'italic',background:'linear-gradient(135deg,#F5E6B8,#E8C870,#C9A84C)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'6px',letterSpacing:'0.5px' }}>Maison d'or</div>
            <div style={{ fontSize:'11px',color:'rgba(201,168,76,0.5)',letterSpacing:'4px',fontWeight:'600' }}>{ t.st_title }</div>
            <div style={{ height:'1px',background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)',margin:'16px auto',width:'60%' }}/>
          </div>

          <div style={{ background:'rgba(18,14,9,0.85)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:'20px',padding:'28px 24px',backdropFilter:'blur(20px)',boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'flex',alignItems:'center',gap:'7px',fontSize:'11px',color:'rgba(201,168,76,0.7)',fontWeight:'700',marginBottom:'10px',letterSpacing:'1.5px' }}>
                <span style={{ color:'#C9A84C' }}>{Icons.person}</span> { t.st_waiterName }
              </label>
              <input value={waiterName} onChange={e=>setWaiterName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&register()} placeholder={ t.st_waiterPlaceholder } className="input-luxury" style={{ width:'100%',padding:'13px 16px',fontSize:'14px',borderRadius:'12px' }}/>
            </div>

            <div style={{ marginBottom:'28px' }}>
              <label style={{ display:'flex',alignItems:'center',gap:'7px',fontSize:'11px',color:'rgba(201,168,76,0.7)',fontWeight:'700',marginBottom:'12px',letterSpacing:'1.5px' }}>
                <span style={{ color:'#C9A84C' }}>{Icons.sections}</span> { t.st_chooseSection }
              </label>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px' }}>
                {SECTIONS.map(sec => (
                  <button key={sec.key} onClick={()=>setSelectedSection(sec.key)} style={{ padding:'18px 14px',borderRadius:'14px',cursor:'pointer',border:selectedSection===sec.key?`1.5px solid ${sec.color}`:'1px solid rgba(255,255,255,0.07)',background:selectedSection===sec.key?`${sec.gradient}0.1)`:'rgba(255,255,255,0.02)',transition:'all 0.2s',textAlign:'center',boxShadow:selectedSection===sec.key?`0 0 20px ${sec.gradient}0.2)`:'none' }}>
                    <div style={{ fontSize:'22px',fontFamily:'Cairo,sans-serif',fontWeight:'900',color:sec.color,marginBottom:'5px' }}>{sec.key}</div>
                    <div style={{ fontSize:'11px',color:selectedSection===sec.key?sec.color:'#555',fontWeight:'700' }}>{sec.label}</div>
                    <div style={{ fontSize:'10px',color:'#444',marginTop:'3px' }}>{t.st_tables} {sec.tables[0]}–{sec.tables[sec.tables.length-1]}</div>
                    {selectedSection===sec.key&&<div style={{ marginTop:'6px',fontSize:'13px',color:sec.color }}>✓</div>}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={register} className="btn-gold-luxury" style={{ width:'100%',padding:'15px',borderRadius:'14px',fontSize:'15px',letterSpacing:'1px',fontFamily:'Cairo,sans-serif' }}>{ t.st_startShift }</button>
          </div>
        </div>
      </div>
    )
  }

  // ══════ واجهة العمل الرئيسية ══════
  return (
    <div style={{
      background:`
        radial-gradient(ellipse 90% 50% at 50% 0%, ${mySection.gradient}0.10) 0%, transparent 55%),
        radial-gradient(ellipse 60% 40% at 90% 100%, ${mySection.gradient}0.06) 0%, transparent 50%),
        radial-gradient(ellipse 40% 30% at 10% 60%, rgba(201,168,76,0.03) 0%, transparent 45%),
        linear-gradient(180deg,#0A0805 0%,#0E0A06 30%,#080604 70%,#050402 100%)
      `,
      direction: t.dir,
      overflowY:'auto',
      WebkitOverflowScrolling:'touch',
    }}>

      {/* إشعارات منبثقة */}
      <div style={{ position:'fixed',top:'80px',right:'12px',zIndex:9999,display:'flex',flexDirection:'column',gap:'10px',pointerEvents:'none' }}>
        {toastNotifs.map(n => (
          <div key={n.id} style={{ pointerEvents:'all' }}>
            <NotifToast notif={n} onClose={()=>setToastNotifs(p=>p.filter(t=>t.id!==n.id))}/>
          </div>
        ))}
      </div>

      {/* الهيدر */}
      <div style={{ position:'sticky',top:0,zIndex:50,background:'rgba(8,6,4,0.92)',backdropFilter:'blur(24px)',borderBottom:`1px solid ${mySection.color}25`,padding:'12px 16px',boxShadow:`0 4px 20px rgba(0,0,0,0.4)` }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div style={{ width:'42px',height:'42px',borderRadius:'13px',background:`${mySection.gradient}0.14)`,border:`1.5px solid ${mySection.color}50`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontFamily:'Cairo,sans-serif',fontWeight:'900',color:mySection.color,boxShadow:`0 0 12px ${mySection.gradient}0.2)` }}>
              {mySection.key}
            </div>
            <div>
              <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'15px',fontWeight:'900',color:'#F5EDD6' }}>{waiterName}</div>
              <div style={{ fontSize:'10px',color:mySection.color,fontWeight:'700' }}>{mySection.label} • {t.st_tables} {mySection.tables[0]}–{mySection.tables[mySection.tables.length-1]}</div>
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
            {myCalls.length>0&&(
              <div style={{ background:'linear-gradient(135deg,#EF4444,#DC2626)',color:'#fff',fontSize:'11px',fontWeight:'900',padding:'4px 11px',borderRadius:'50px',animation:'urgentPulse 1s infinite',boxShadow:'0 0 12px rgba(239,68,68,0.4)',fontFamily:'Cairo,sans-serif' }}>{myCalls.length} {t.st_newCall}</div>
            )}
            <LangSwitcher />
            <button onClick={()=>{setIsRegistered(false);setMySection(null)}} style={{ display:'flex',alignItems:'center',gap:'5px',padding:'7px 12px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:'#666',fontSize:'11px',fontWeight:'700',cursor:'pointer',fontFamily:'Cairo,sans-serif' }}>
              {Icons.logout} { t.st_logout }
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'520px',margin:'0 auto',padding:'16px 16px 60px' }}>

        {/* حالة المناوبة */}
        <div style={{ background:`${mySection.gradient}0.06)`,border:`1px solid ${mySection.color}20`,borderRadius:'16px',padding:'16px 18px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'14px',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,transparent,${mySection.color},transparent)`,opacity:0.5 }}/>
          <div style={{ width:'12px',height:'12px',borderRadius:'50%',background:mySection.color,animation:'livePulse 2s infinite',flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'14px',fontWeight:'800',color:'#F5EDD6' }}>{t.st_activeShift} — {mySection.label}</div>
            <div style={{ fontSize:'11px',color:'rgba(245,237,214,0.45)',marginTop:'2px' }}>{ t.st_refreshEvery }</div>
          </div>
          <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'28px',fontWeight:'900',color:myCalls.length>0?'#EF4444':mySection.color,transition:'color 0.3s' }}>{myCalls.length}</div>
        </div>

        {/* { t.st_incomingCalls } */}
        <div style={{ marginBottom:'24px' }}>
          <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'12px',fontWeight:'700',color:'rgba(245,237,214,0.5)',marginBottom:'14px',display:'flex',alignItems:'center',gap:'7px',letterSpacing:'1px' }}>
            <span style={{ color:mySection.color }}>{Icons.bell}</span>
            { t.st_incomingCalls }
          </div>
          {myCalls.length===0 ? (
            <div style={{ textAlign:'center',padding:'48px 20px',background:'rgba(255,255,255,0.01)',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:'16px' }}>
              <div style={{ fontSize:'44px',opacity:0.2,marginBottom:'12px' }}>🔔</div>
              <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'14px',color:'#444' }}>{ t.st_noCalls }</div>
              <div style={{ fontSize:'11px',color:'#333',marginTop:'6px' }}>{ t.st_noCallsSub }</div>
            </div>
          ) : myCalls.map((call,idx) => (
            <div key={call.id} style={{ background:'rgba(18,14,9,0.9)',border:`1px solid ${mySection.color}30`,borderRight:`3px solid ${mySection.color}`,borderRadius:'16px',padding:'14px 16px',marginBottom:'10px',animation:`fadeUp 0.4s ${idx*0.05}s both`,boxShadow:`0 4px 20px ${mySection.gradient}0.1)`,backdropFilter:'blur(10px)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
                <div style={{ width:'48px',height:'48px',borderRadius:'14px',flexShrink:0,background:`${mySection.gradient}0.14)`,border:`1.5px solid ${mySection.color}45`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 14px ${mySection.gradient}0.15)` }}>
                  <span style={{ fontFamily:'Cairo,sans-serif',fontSize:'20px',fontWeight:'900',color:mySection.color }}>{call.table?.replace(/[^0-9]/g,'')}</span>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'14px',fontWeight:'800',color:'#F5EDD6',marginBottom:'3px' }}>{call.table}</div>
                  <div style={{ fontSize:'12px',color:'rgba(245,237,214,0.65)',marginBottom:'5px',lineHeight:1.4 }}>{call.request}</div>
                  <div style={{ fontSize:'10px',color:'#4A4035' }}>{call.time}</div>
                </div>
                <button onClick={()=>acceptMutation.mutate({callId:call.id})} style={{ padding:'9px 16px',borderRadius:'11px',flexShrink:0,border:'1px solid rgba(16,185,129,0.35)',background:'rgba(16,185,129,0.1)',color:'#10B981',fontSize:'12px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',fontFamily:'Cairo,sans-serif',transition:'all 0.2s' }}>
                  {Icons.check} {t.st_done}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* الطاولات */}
        <div style={{ background:'rgba(18,14,9,0.6)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'16px',marginBottom:'20px',backdropFilter:'blur(10px)' }}>
          <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'11px',fontWeight:'700',color:'rgba(245,237,214,0.4)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px',letterSpacing:'1px' }}>
            <span style={{ color:mySection.color }}>{Icons.table}</span>
            { t.st_myTables } — {mySection.label}
          </div>
          <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
            {mySection.tables.map(n => {
              const hasCall = myCalls.some(c=>c.table?.includes(String(n)))
              return (
                <div key={n} style={{ width:'48px',height:'48px',borderRadius:'13px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cairo,sans-serif',fontSize:'16px',fontWeight:'900',background:hasCall?`${mySection.gradient}0.18)`:'rgba(255,255,255,0.03)',border:hasCall?`1.5px solid ${mySection.color}`:'1px solid rgba(255,255,255,0.06)',color:hasCall?mySection.color:'#444',animation:hasCall?'tablePulse 1.2s infinite':'none',boxShadow:hasCall?`0 0 14px ${mySection.gradient}0.3)`:'none',transition:'all 0.3s' }}>{n}</div>
              )
            })}
          </div>
        </div>

        {/* { t.st_notifLog } */}
        {notifications.length>0&&(
          <div style={{ background:'rgba(18,14,9,0.6)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'16px',backdropFilter:'blur(10px)' }}>
            <div style={{ fontFamily:'Cairo,sans-serif',fontSize:'11px',fontWeight:'700',color:'rgba(245,237,214,0.4)',marginBottom:'12px',display:'flex',alignItems:'center',justifyContent:'space-between',letterSpacing:'1px' }}>
              <span style={{ display:'flex',alignItems:'center',gap:'6px' }}>
                <span style={{ color:mySection.color }}>{Icons.notif}</span>
                { t.st_notifLog }
              </span>
              <button onClick={()=>setNotifications([])} style={{ background:'none',border:'none',color:'#444',fontSize:'10px',cursor:'pointer',fontFamily:'Cairo,sans-serif' }}>{ t.st_clearAll }</button>
            </div>
            {notifications.map((n,i)=>(
              <div key={n.id||i} style={{ display:'flex',gap:'10px',alignItems:'flex-start',padding:'9px 0',borderBottom:i<notifications.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                <span style={{ fontSize:'10px',color:'rgba(245,237,214,0.3)',width:'42px',flexShrink:0,paddingTop:'1px' }}>{n.time}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px',color:'rgba(245,237,214,0.6)' }}>{n.text}</div>
                  {n.req&&<div style={{ fontSize:'11px',color:'rgba(245,237,214,0.35)',marginTop:'2px' }}>{n.req}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.5)}50%{box-shadow:0 0 0 7px rgba(201,168,76,0)}}
        @keyframes urgentPulse{0%,100%{opacity:1;box-shadow:0 0 12px rgba(239,68,68,.4)}50%{opacity:.75;box-shadow:0 0 20px rgba(239,68,68,.7)}}
        @keyframes tablePulse{0%,100%{opacity:1}50%{opacity:.65}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  )
}
