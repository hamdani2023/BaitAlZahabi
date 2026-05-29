'use client'
/*
  ==========================================
  components/TopBar.jsx   ←   شريط العنوان
  ==========================================

  Props (المُدخلات):
  ──────────────────
  title       : عنوان الصفحة
  chipColor   : لون خلفية شريحة الطاولة
  chipBorder  : لون حدود الشريحة ولون النص
  children    : عناصر إضافية (مثل زر السلة)

  useRouter().back():
  ────────────────────
  يُعيد المستخدم للصفحة السابقة.
  مثل زر الرجوع في المتصفح لكن داخل تطبيقنا.
*/

import { useRouter }   from 'next/navigation'
import useStore        from '@/lib/store'

export default function TopBar({ title, chipColor, chipBorder, children }) {
  const router      = useRouter()
  const tableNumber = useStore(s => s.tableNumber)

  return (
    <div style={{
      position:       'sticky',
      top:            0,
      zIndex:         50,
      display:        'flex',
      alignItems:     'center',
      gap:            '12px',
      padding:        '13px 16px',
      background:     'rgba(8,8,8,0.93)',
      borderBottom:   '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
    }}>

      {/* ── زر الرجوع ── */}
      <button
        onClick={() => router.back()}
        style={{
          width:      '36px',
          height:     '36px',
          flexShrink: 0,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          background:   'rgba(255,255,255,0.06)',
          border:       '1px solid rgba(255,255,255,0.09)',
          color:        'white',
          fontSize:     '18px',
          cursor:       'pointer',
        }}
      >
        ←
      </button>

      {/* ── عنوان الصفحة ── */}
      <span style={{
        flex:       1,
        fontFamily: 'Cairo, sans-serif',
        fontSize:   '17px',
        fontWeight: '800',
      }}>
        {title}
      </span>

      {/* ── شريحة رقم الطاولة ── */}
      <span style={{
        padding:      '5px 13px',
        borderRadius: '50px',
        fontSize:     '11.5px',
        fontWeight:   '700',
        background:   chipColor  || 'rgba(201,168,76,0.1)',
        border:       `1px solid ${chipBorder || 'rgba(201,168,76,0.28)'}`,
        color:        chipBorder || '#C9A84C',
        whiteSpace:   'nowrap',
      }}>
        🪑 {tableNumber ? `طاولة ${tableNumber}` : '—'}
      </span>

      {/* ── أي عنصر إضافي (مثل زر السلة) ── */}
      {children}
    </div>
  )
}
