'use client'
import { useEffect } from 'react'
import useStore from '@/lib/store'

const COLORS = {
  gold:   { bg:'rgba(15,11,6,0.97)', border:'rgba(201,168,76,0.5)', color:'var(--gold-light)' },
  green:  { bg:'rgba(16,185,129,0.92)', border:'transparent', color:'#fff' },
  red:    { bg:'rgba(192,57,43,0.92)',  border:'transparent', color:'#fff' },
  blue:   { bg:'rgba(59,130,246,0.92)', border:'transparent', color:'#fff' },
  purple: { bg:'rgba(139,92,246,0.92)', border:'transparent', color:'#fff' },
}

export default function Toast() {
  const toast      = useStore(s => s.toast)
  const clearToast = useStore(s => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 2800)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  const c = COLORS[toast?.color] || COLORS.gold

  return (
    <div style={{
      position:'fixed', top:'18px', left:'50%', zIndex:9999,
      transform:`translateX(-50%) translateY(${toast ? '0' : '-130px'})`,
      transition:'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      background: c.bg,
      border:`1px solid ${c.border}`,
      color: c.color,
      borderRadius:'50px',
      padding:'10px 22px',
      fontSize:'13px', fontWeight:'600',
      whiteSpace:'nowrap',
      backdropFilter:'blur(20px)',
      maxWidth:'90vw', textAlign:'center',
      boxShadow:'0 8px 30px rgba(0,0,0,0.5)',
      fontFamily:'Tajawal,sans-serif',
      pointerEvents:'none',
    }}>
      {toast?.message}
    </div>
  )
}
