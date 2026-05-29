'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { LANGS } from '@/lib/i18n'
import { sendCall } from '@/lib/api'
import LangSwitcher from '@/components/LangSwitcher'

const Icons = {
  back:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>,
  bell:     <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  bill:     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  water:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6 9 4 13 4 16a8 8 0 0016 0c0-3-2-7-8-14z"/></svg>,
  utensils: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  napkins:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  sauce:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v6l-2 4v8a2 2 0 002 2h4a2 2 0 002-2v-8l-2-4V2"/><line x1="10" y1="2" x2="14" y2="2"/></svg>,
  clean:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  baby:     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M8 14s-4 1-4 5h16c0-4-4-5-4-5"/></svg>,
  allergy:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  send:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  check:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
  menu:     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="17" cy="19" r="1" fill="currentColor"/></svg>,
  feedback: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
}

const QUICK_ICONS = {
  bill: Icons.bill, water: Icons.water, utensils: Icons.utensils,
  napkins: Icons.napkins, sauce: Icons.sauce, clean: Icons.clean,
  baby: Icons.baby, allergy: Icons.allergy,
}
const QUICK_COLORS = {
  bill:'#C9A84C', water:'#3B82F6', utensils:'#10B981', napkins:'#F59E0B',
  sauce:'#EF4444', clean:'#8B5CF6', baby:'#EC4899', allergy:'#F97316',
}
const QUICK_BG = {
  bill:'rgba(201,168,76,0.1)', water:'rgba(59,130,246,0.08)', utensils:'rgba(16,185,129,0.08)',
  napkins:'rgba(245,158,11,0.08)', sauce:'rgba(239,68,68,0.08)', clean:'rgba(139,92,246,0.08)',
  baby:'rgba(236,72,153,0.08)', allergy:'rgba(249,115,22,0.1)',
}

export default function WaiterPage() {
  const router      = useRouter()
  const tableNumber = useStore(s => s.tableNumber)
  const showToast   = useStore(s => s.showToast)
  const lang        = useStore(s => s.lang)
  const t           = LANGS[lang]

  const [callState, setCallState] = useState(null)
  const [sentSet,   setSentSet]   = useState(new Set())
  const [msg,       setMsg]       = useState('')
  const [history,   setHistory]   = useState([])
  const [activeTab, setActiveTab] = useState('quick')

  const callMutation = useMutation({
    mutationFn: sendCall,
    onSuccess: () => {
      setCallState('calling')
      addHist(t.callWaiter, '#F59E0B', '⏳')
      setTimeout(() => {
        setCallState('done')
        addHist(t.responseReceived, '#3FB950', '✅')
        setTimeout(() => setCallState(null), 15000)
      }, 6000)
    },
    onError: () => showToast(t.errorConn, 'red'),
  })

  function addHist(text, color, icon) {
    const n = new Date()
    const time = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`
    setHistory(h => [{ text, color, icon, time }, ...h.slice(0,9)])
  }

  function handleMainCall() {
    if (callState === 'calling') return
    if (!tableNumber) { showToast(t.noTableChosen, 'red'); return }
    callMutation.mutate({ tableNumber, type:'urgent', message: t.callWaiter })
    showToast('✦ ' + t.callSent, 'gold')
  }

  function sendQuick(req) {
    if (!tableNumber) { showToast(t.noTableChosen, 'red'); return }
    setSentSet(p => new Set(p).add(req.type))
    callMutation.mutate({ tableNumber, type:'normal', message: req.name })
    showToast(`✦ ${t.sendRequest}: ${req.name}`, 'gold')
    addHist(req.name, '#F59E0B', '⏳')
    setTimeout(() => {
      addHist(`${req.name} — ${t.responseReceived}`, '#3FB950', '✅')
      setSentSet(p => { const s=new Set(p); s.delete(req.type); return s })
    }, 8000)
  }

  function sendMsg() {
    if (!msg.trim()) return
    if (!tableNumber) { showToast(t.noTableChosen, 'red'); return }
    callMutation.mutate({ tableNumber, type:'normal', message: msg })
    showToast('✦ ' + t.sendRequest, 'gold')
    addHist(msg.length > 28 ? msg.slice(0,28)+'...' : msg, '#58A6FF', '📩')
    setMsg('')
  }

  const quickList = t.quickRequestsList || []

  const TABS = [
    { key:'quick',   label: t.quickRequests, emoji:'⚡' },
    { key:'message', label: t.customMessage, emoji:'✉️' },
    { key:'log',     label: t.requestLog,    emoji:'📋' },
  ]

  const QUICK_LINKS = [
    { label: t.foodMenu,  sub: t.foodMenuSub,  icon: Icons.menu,     href:'/menu',     color:'#C9A84C' },
    { label: t.payment,   sub: t.paymentSub,   icon: Icons.bill,     href:'/bill',     color:'#10B981' },
    { label: t.rating,    sub: t.ratingSub,    icon: Icons.feedback, href:'/feedback', color:'#F59E0B' },
  ]

  return (
    <div className="scrollable page-in" style={{ direction: t.dir }}>

      {/* Hero */}
      <div style={{ position:'relative', height:'160px', overflow:'hidden', flexShrink:0 }}>
        <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=700&q=80" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(10,8,5,0.5) 0%,rgba(10,8,5,0.85) 100%)' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px' }}>
          <button onClick={() => router.back()} style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(201,168,76,0.25)', color:'var(--cream)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {Icons.back}
          </button>
          <span style={{ flex:1, fontFamily:'Cairo,sans-serif', fontSize:'16px', fontWeight:'800', color:'var(--cream)' }}>
            {t.tableService}
          </span>
          <LangSwitcher />
          {tableNumber ? (
            <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.35)', color:'var(--gold)' }}>
              🪑 {t.tableSelected} {tableNumber}
            </span>
          ) : (
            <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444' }}>
              {t.noTableWarning}
            </span>
          )}
        </div>
        <div style={{ position:'absolute', bottom:'14px', left:0, right:0, textAlign:'center' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:'18px', fontStyle:'italic', color:'var(--gold-light)' }}>{t.heroWaiter}</div>
        </div>
      </div>

      {/* تحذير بدون طاولة */}
      {!tableNumber && (
        <div style={{ margin:'12px 16px 0', padding:'12px 16px', borderRadius:'13px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'20px' }}>⚠️</span>
          <div>
            <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:'700', color:'#EF4444', marginBottom:'2px' }}>{t.noTableChosen}</div>
            <div style={{ fontSize:'11px', color:'rgba(239,68,68,0.6)' }}>{t.noTableSub}</div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'16px 16px 32px' }}>

        {/* زر النداء الرئيسي */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ position:'relative', display:'inline-block' }}>
            {callState === 'calling' && (
              <>
                <div style={{ position:'absolute', inset:'-12px', borderRadius:'50%', border:'2px solid rgba(59,130,246,0.2)', animation:'ringPulse 2s ease-out infinite' }}/>
                <div style={{ position:'absolute', inset:'-22px', borderRadius:'50%', border:'1px solid rgba(59,130,246,0.1)', animation:'ringPulse 2s ease-out 0.5s infinite' }}/>
              </>
            )}
            {callState === null && (
              <div style={{ position:'absolute', inset:'-8px', borderRadius:'50%', border:'1px solid rgba(201,168,76,0.15)', animation:'ringPulse 3s ease-out infinite' }}/>
            )}
            <button
              onClick={handleMainCall}
              disabled={callState === 'calling'}
              style={{
                width:'140px', height:'140px', borderRadius:'50%',
                cursor: callState==='calling' ? 'not-allowed' : 'pointer',
                background: callState==='calling'
                  ? 'radial-gradient(circle,rgba(59,130,246,0.25),rgba(59,130,246,0.05))'
                  : callState==='done'
                  ? 'radial-gradient(circle,rgba(16,185,129,0.25),rgba(16,185,129,0.05))'
                  : 'radial-gradient(circle,rgba(201,168,76,0.2),rgba(201,168,76,0.04))',
                border: callState==='calling'
                  ? '2px solid rgba(59,130,246,0.5)'
                  : callState==='done'
                  ? '2px solid rgba(16,185,129,0.5)'
                  : '2px solid rgba(201,168,76,0.45)',
                boxShadow: callState==='calling'
                  ? '0 0 40px rgba(59,130,246,0.2), inset 0 0 30px rgba(59,130,246,0.05)'
                  : callState==='done'
                  ? '0 0 40px rgba(16,185,129,0.2)'
                  : '0 0 40px rgba(201,168,76,0.18)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px',
                transition:'all 0.4s',
              }}
            >
              <span style={{
                color: callState==='calling' ? '#60A5FA' : callState==='done' ? '#10B981' : 'var(--gold)',
                filter: `drop-shadow(0 0 8px ${callState==='calling'?'rgba(59,130,246,0.8)':callState==='done'?'rgba(16,185,129,0.8)':'rgba(201,168,76,0.6)'})`,
                animation: callState==='calling' ? 'bellShake 0.8s ease-in-out infinite' : 'none',
              }}>
                {Icons.bell}
              </span>
              <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'800', color: callState==='calling'?'#60A5FA':callState==='done'?'#10B981':'var(--gold)', letterSpacing:'0.5px' }}>
                {callState==='calling' ? t.calling : callState==='done' ? t.doneTick : t.callWaiterNow}
              </span>
            </button>
          </div>
          <div style={{ marginTop:'16px' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'18px', fontStyle:'italic', color:'var(--cream)', marginBottom:'4px' }}>{t.callWaiter}</div>
            <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.4)' }}>
              {callState==='calling' ? t.waiterOnWay : callState==='done' ? t.waiterReady : t.within2min}
            </div>
          </div>
        </div>

        {/* حالة النداء */}
        {callState && (
          <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderRadius:'14px', marginBottom:'20px', background: callState==='done'?'rgba(16,185,129,0.07)':'rgba(59,130,246,0.07)', border: callState==='done'?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(59,130,246,0.2)', animation:'fadeUp 0.3s ease' }}>
            <span style={{ fontSize:'24px' }}>{callState==='done'?'✅':'⏳'}</span>
            <div>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:'700', color:'var(--cream)', marginBottom:'2px' }}>
                {callState==='done' ? t.responseReceived : t.callSent}
              </div>
              <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.45)' }}>
                {callState==='done' ? t.waiterArrived : t.waiterOnWay}
              </div>
            </div>
          </div>
        )}

        {/* التبويبات */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'18px', background:'rgba(15,12,8,0.8)', borderRadius:'13px', padding:'4px', border:'1px solid rgba(255,255,255,0.05)' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex:1, padding:'8px 4px', borderRadius:'10px', border:'none', fontFamily:'Cairo,sans-serif', fontSize:'11px', fontWeight:'700', cursor:'pointer', transition:'all 0.2s', background: activeTab===tab.key ? 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))' : 'transparent', color: activeTab===tab.key ? 'var(--gold)' : '#555', borderBottom: activeTab===tab.key ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent' }}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* طلبات سريعة */}
        {activeTab === 'quick' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {quickList.map(req => {
              const sent  = sentSet.has(req.type)
              const color = QUICK_COLORS[req.type] || '#C9A84C'
              const bg    = QUICK_BG[req.type]    || 'rgba(201,168,76,0.08)'
              return (
                <button key={req.type} onClick={() => sendQuick(req)}
                  style={{ padding:'16px 12px', borderRadius:'16px', textAlign:'center', cursor:'pointer', border: sent?'1px solid rgba(16,185,129,0.4)':'1px solid rgba(255,255,255,0.07)', background: sent ? 'rgba(16,185,129,0.07)' : bg, position:'relative', transition:'all 0.25s', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
                  {sent && (
                    <div style={{ position:'absolute', top:'8px', right:'8px', width:'18px', height:'18px', background:'#10B981', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                      {Icons.check}
                    </div>
                  )}
                  <div style={{ color: sent ? '#10B981' : color, filter:`drop-shadow(0 2px 6px ${color}50)` }}>
                    {QUICK_ICONS[req.type] || Icons.bell}
                  </div>
                  <div>
                    <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'800', color:'var(--cream)', marginBottom:'2px' }}>{req.name}</div>
                    <div style={{ fontSize:'10px', color:'rgba(245,237,214,0.35)' }}>{req.sub}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* رسالة مخصصة */}
        {activeTab === 'message' && (
          <div>
            <div style={{ marginBottom:'14px', padding:'12px 14px', borderRadius:'13px', background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.12)' }}>
              <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700', color:'rgba(201,168,76,0.7)', marginBottom:'4px' }}>ℹ️ {t.customMessage}</div>
              <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.4)', lineHeight:1.7, whiteSpace:'pre-line' }}>
                {t.customMsgInfo}
              </div>
            </div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4}
              placeholder={t.writeRequest} className="input-luxury"
              style={{ width:'100%', padding:'14px', resize:'none', marginBottom:'12px', fontSize:'13px', lineHeight:1.7 }}/>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setMsg('')} style={{ padding:'12px 18px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#555', fontSize:'13px', cursor:'pointer', fontFamily:'Cairo,sans-serif', fontWeight:'700' }}>
                {t.clearMsg}
              </button>
              <button onClick={sendMsg} disabled={!msg.trim()} className="btn-gold-luxury" style={{ flex:1, padding:'14px', borderRadius:'12px', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: msg.trim() ? 1 : 0.4 }}>
                {Icons.send} {t.sendRequest}
              </button>
            </div>
          </div>
        )}

        {/* سجل الطلبات */}
        {activeTab === 'log' && (
          <div>
            {history.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:'40px', marginBottom:'10px', opacity:0.3 }}>📋</div>
                <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'14px', color:'#444' }}>{t.noRequests}</div>
                <div style={{ fontSize:'11px', color:'#333', marginTop:'4px' }}>{t.noRequestsSub}</div>
              </div>
            ) : (
              <div>
                {history.map((h, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'12px', marginBottom:'8px', background:'rgba(15,12,8,0.7)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:`${h.color}15`, border:`1px solid ${h.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>
                      {h.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'12px', fontWeight:'700', color:'rgba(245,237,214,0.8)' }}>{h.text}</div>
                    </div>
                    <div style={{ fontSize:'10px', color:'#333', flexShrink:0 }}>{h.time}</div>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:h.color, flexShrink:0, boxShadow:`0 0 6px ${h.color}` }}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* روابط سريعة */}
        <div style={{ marginTop:'28px' }}>
          <div className="ornament-line" style={{ marginBottom:'14px' }}>{t.quickLinks}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
            {QUICK_LINKS.map(link => (
              <button key={link.href} onClick={() => router.push(link.href)}
                style={{ padding:'14px 10px', borderRadius:'14px', border:`1px solid ${link.color}20`, background:`${link.color}0d`, cursor:'pointer', textAlign:'center', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                <span style={{ color:link.color, filter:`drop-shadow(0 2px 6px ${link.color}40)` }}>{link.icon}</span>
                <div>
                  <div style={{ fontFamily:'Cairo,sans-serif', fontSize:'11px', fontWeight:'800', color:'var(--cream)' }}>{link.label}</div>
                  <div style={{ fontSize:'9px', color:'rgba(245,237,214,0.35)', marginTop:'1px' }}>{link.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes bellShake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-15deg)} 40%{transform:rotate(15deg)} 60%{transform:rotate(-10deg)} 80%{transform:rotate(10deg)} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.4);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
