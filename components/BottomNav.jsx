'use client'
import { usePathname, useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { LANGS } from '@/lib/i18n'

const Icons = {
  home: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  menu: ({ active, badge }) => (
    <div style={{ position:'relative' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13z"/>
        <circle cx="9" cy="19" r="1" fill={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'}/>
        <circle cx="17" cy="19" r="1" fill={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'}/>
      </svg>
      {badge > 0 && (
        <span style={{ position:'absolute', top:'-5px', right:'-5px', width:'16px', height:'16px', background:'#C0392B', color:'#fff', fontSize:'9px', fontWeight:'900', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--dark)' }}>{badge}</span>
      )}
    </div>
  ),
  bell: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  bill: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  star: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'rgba(201,168,76,0.3)' : 'none'} stroke={active ? '#C9A84C' : 'rgba(245,237,214,0.4)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
}

const STAFF_PATHS = ['/manager', '/head-waiter', '/staff']

export default function BottomNav() {
  const path       = usePathname()
  const router     = useRouter()
  const totalItems = useStore(s => s.totalItems())
  const lang       = useStore(s => s.lang)
  const t          = LANGS[lang]

  // إخفاء شريط التنقل في لوحات الإدارة والموظفين
  if (STAFF_PATHS.some(p => path.startsWith(p))) return null

  const NAV = [
    { href:'/',        Icon: Icons.home, label: t.home },
    { href:'/menu',    Icon: Icons.menu, label: t.menu,    badge: totalItems },
    { href:'/waiter',  Icon: Icons.bell, label: t.waiter },
    { href:'/bill',    Icon: Icons.bill, label: t.bill },
    { href:'/feedback',Icon: Icons.star, label: t.feedback },
  ]

  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0,
      height:'var(--nav-h)', zIndex:999,
      background:'rgba(8,6,4,0.97)',
      borderTop:'1px solid rgba(201,168,76,0.12)',
      backdropFilter:'blur(20px)',
      display:'flex', alignItems:'stretch',
    }}>
      {NAV.map(({ href, Icon, label, badge }) => {
        const active = path === href
        return (
          <button key={href} onClick={() => router.push(href)}
            style={{
              flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:'3px',
              border:'none', background:'none', cursor:'pointer',
              position:'relative', transition:'all 0.25s',
            }}
          >
            {active && (
              <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:'2px', borderRadius:'0 0 3px 3px', background:'linear-gradient(90deg,transparent,var(--gold),transparent)' }}/>
            )}
            {active && (
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
            )}
            <div style={{ transform: active ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition:'transform 0.25s', filter: active ? 'drop-shadow(0 0 6px rgba(201,168,76,0.7))' : 'none' }}>
              <Icon active={active} badge={badge} />
            </div>
            <span style={{ fontSize:'9px', fontWeight: active ? '700' : '500', letterSpacing:'0.5px', color: active ? 'var(--gold)' : 'rgba(245,237,214,0.4)', fontFamily:'Cairo,sans-serif' }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
