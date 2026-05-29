'use client'
import { useState } from 'react'
import useStore from '@/lib/store'
import { LANGS } from '@/lib/i18n'

export default function LangSwitcher() {
  const { lang, setLang } = useStore()
  const [open, setOpen] = useState(false)
  const current = LANGS[lang]

  return (
    <div style={{ position:'relative', zIndex:300 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display:'flex', alignItems:'center', gap:'6px',
          padding:'6px 12px', borderRadius:'20px',
          background:'rgba(201,168,76,0.1)',
          border:'1px solid rgba(201,168,76,0.3)',
          color:'var(--gold)', fontSize:'12px', fontWeight:'700',
          cursor:'pointer', transition:'all 0.2s',
          fontFamily:'Tajawal,sans-serif',
        }}
      >
        <span style={{ fontSize:'14px' }}>{current.flag}</span>
        <span>{current.name}</span>
        <span style={{ fontSize:'10px', opacity:0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          {/* overlay للإغلاق عند النقر خارج القائمة */}
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:290 }}/>
          <div style={{
            position:'absolute', top:'calc(100% + 8px)',
            right:0, minWidth:'150px', zIndex:310,
            background:'rgba(12,9,5,0.99)',
            border:'1px solid rgba(201,168,76,0.3)',
            borderRadius:'14px', overflow:'hidden',
            boxShadow:'0 8px 32px rgba(0,0,0,0.7)',
            animation:'dropIn 0.15s ease',
          }}>
            {Object.entries(LANGS).map(([code, l]) => (
              <button key={code}
                onClick={() => { setLang(code); setOpen(false) }}
                style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  width:'100%', padding:'11px 14px',
                  background: code === lang ? 'rgba(201,168,76,0.12)' : 'none',
                  border:'none', borderBottom:'1px solid rgba(201,168,76,0.07)',
                  color: code === lang ? 'var(--gold)' : 'rgba(245,237,214,0.65)',
                  fontSize:'13px', fontWeight: code === lang ? '700' : '500',
                  cursor:'pointer', fontFamily:'Tajawal,sans-serif',
                  transition:'all 0.15s',
                }}
              >
                <span style={{ fontSize:'16px' }}>{l.flag}</span>
                <span style={{ flex:1, textAlign:'right' }}>{l.name}</span>
                {code === lang && <span style={{ color:'var(--gold)', fontSize:'12px' }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
