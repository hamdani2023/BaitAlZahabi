'use client'
import LangSwitcher from '@/components/LangSwitcher'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { LANGS, RESTAURANT_NAME } from '@/lib/i18n'
import { getTableBill, payBill } from '@/lib/api'
import { formatPrice, getItemName, MENU_ITEMS } from '@/lib/menuData'


export default function BillPage() {
  const router      = useRouter()
  const tableNumber = useStore(s => s.tableNumber)
  const showToast   = useStore(s => s.showToast)
  const qc          = useQueryClient()
  const lang        = useStore(s => s.lang)
  const t           = LANGS[lang]
  const [payMethod, setPayMethod] = useState('cash')
  const [paid,      setPaid]      = useState(false)
  const cart = useStore(s => s.cart)

  // نبني الفاتورة من السلة الحقيقية
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const item = MENU_ITEMS.find(m => String(m.id) === String(id))
      if (!item) return null
      return { e: item.emoji || item.e || '🍽️', name: getItemName(item, lang), qty, price: item.price }
    })
    .filter(Boolean)

  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const cartVat      = Math.round(cartSubtotal * 0.09)
  const cartTotal    = cartSubtotal + cartVat

  // نجلب الفاتورة من السيرفر دائماً إذا عندنا رقم طاولة
  const { data: serverBill } = useQuery({
    queryKey: ['bill', tableNumber],
    queryFn:  () => getTableBill(tableNumber),
    enabled:  !!tableNumber,
  })

  // نستعمل السلة إذا فيها عناصر، وإلا نستعمل الـ server
  const bill = cartItems.length > 0
    ? { id: 0, items: cartItems, subtotal: cartSubtotal, vat: cartVat, total: cartTotal }
    : serverBill || { id: 0, items: [], subtotal: 0, vat: 0, total: 0 }

  const isMock = !bill.id || bill.id === 0 || bill.id === '0'

  const payMutation = useMutation({
    mutationFn: async () => {
      if (isMock) return { success: true, mock: true }
      return payBill(bill.id, payMethod)
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey:['bill']})
      setPaid(true)
      showToast('✦ ' + t.paySuccess, 'gold')
    },
    onError: () => {
      if (isMock) {
        setPaid(true)
        showToast('✦ ' + t.paySuccess, 'gold')
      } else {
        showToast(t.payFailed || t.errorSend, 'red')
      }
    },
  })

  if (paid) return (
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t?.dir || 'rtl', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', textAlign:'center' }}>
      <div style={{ fontSize:'80px', marginBottom:'20px', animation:'float 3s ease-in-out infinite' }}>🎉</div>
      <div className="font-playfair" style={{ fontSize:'26px', fontStyle:'italic', color:'var(--gold-light)', marginBottom:'8px' }}>{t.thankYou}</div>
      <div style={{ fontSize:'13px', color:'rgba(245,237,214,0.5)', marginBottom:'28px', lineHeight:1.8 }}>
        {t.paySuccess}<br/>{t.seeYouSoon}
      </div>
      <button onClick={() => router.push('/')} className="btn-gold-luxury" style={{ padding:'14px 36px', borderRadius:'50px', fontSize:'15px' }}>
        {t.backHome}
      </button>
    </div>
  )

  const PAY_METHODS = ['cash','card','apple_pay','cib']
  const PAY_ICONS   = { cash:'💵', card:'💳', apple_pay:'📱', cib:'🏦' }

  return (
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t?.dir || 'rtl' }}>

      {/* Hero */}
      <div style={{ position:'relative', height:'160px', overflow:'hidden' }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"
          alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }}/>
        <div className="hero-bg-overlay" style={{ position:'absolute', inset:0 }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'rgba(10,8,5,0.5)', backdropFilter:'blur(10px)' }}>
          <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'var(--cream)', fontSize:'17px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <span className="font-cairo" style={{ flex:1, fontSize:'17px', fontWeight:'800', color:'var(--cream)' }}>{t.billTitle}</span>
          <LangSwitcher />
          <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#3FB950' }}>🪑 {t.tableLabel} {tableNumber||'—'}</span>
        </div>
        <div style={{ position:'absolute', bottom:'14px', left:0, right:0, textAlign:'center', zIndex:5 }}>
          <div className="font-playfair" style={{ fontSize:'18px', fontStyle:'italic', color:'var(--gold-light)' }}>{t.heroBill}</div>
        </div>
      </div>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'18px 16px 32px' }}>

        {/* الفاتورة */}
        <div className="luxury-card" style={{ marginBottom:'18px', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))', padding:'20px', textAlign:'center', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
            <div style={{ fontSize:'36px', marginBottom:'8px' }}>🧾</div>
            <div className="font-playfair" style={{ fontSize:'20px', fontStyle:'italic', color:'var(--gold-light)', marginBottom:'2px' }}>{RESTAURANT_NAME}</div>
            <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.4)', letterSpacing:'2px' }}>
              {t.invoiceLabel} #{String(bill.id||0).padStart(4,'0')}
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 16px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(201,168,76,0.06)', fontSize:'11px', color:'rgba(245,237,214,0.4)' }}>
            <span>📅 {new Date().toLocaleDateString(lang==='ar'?'ar-DZ':lang==='fr'?'fr-DZ':'en-GB')}</span>
            <span>🪑 {t.tableLabel} {tableNumber||'—'}</span>
          </div>
          {bill.items.map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom:'1px solid rgba(201,168,76,0.05)' }}>
              <span style={{ fontSize:'22px', width:'30px', textAlign:'center' }}>{item.e||'🍽️'}</span>
              <div style={{ flex:1 }}>
                <div className="font-cairo" style={{ fontSize:'13px', fontWeight:'600', color:'var(--cream)', marginBottom:'1px' }}>{item.name}</div>
                <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.4)' }}>{item.qty} × {formatPrice(item.price)}</div>
              </div>
              <div className="price-luxury" style={{ fontSize:'14px' }}>{formatPrice(item.qty * item.price)}</div>
            </div>
          ))}
          <div style={{ padding:'16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'rgba(245,237,214,0.45)', marginBottom:'6px' }}><span>{t.subtotal}</span><span>{formatPrice(bill.subtotal)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'rgba(245,237,214,0.45)', marginBottom:'6px' }}><span>{t.tax}</span><span>{formatPrice(bill.vat)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px solid rgba(201,168,76,0.2)', marginTop:'6px' }}>
              <span className="font-cairo" style={{ fontSize:'18px', fontWeight:'900', color:'var(--cream)' }}>{t.totalLabel}</span>
              <span className="price-luxury" style={{ fontSize:'20px' }}>{formatPrice(bill.total)}</span>
            </div>
          </div>
        </div>

        {/* طريقة الدفع */}
        <div className="ornament-line" style={{ marginBottom:'14px' }}>{t.payMethodTitle}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
          {PAY_METHODS.map(id => {
            const m = t.payMethods?.[id] || {}
            return (
              <button key={id} onClick={() => setPayMethod(id)} style={{
                padding:'14px 12px', borderRadius:'14px', textAlign:'center', cursor:'pointer',
                transition:'all 0.25s', color:'var(--cream)',
                background: payMethod===id ? 'rgba(201,168,76,0.08)' : 'var(--dark-3)',
                border: payMethod===id ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.1)',
                boxShadow: payMethod===id ? '0 0 16px rgba(201,168,76,0.15)' : 'none',
              }}>
                <div style={{ fontSize:'26px', marginBottom:'6px' }}>{PAY_ICONS[id]}</div>
                <div className="font-cairo" style={{ fontSize:'12px', fontWeight:'700', marginBottom:'2px' }}>{m.name}</div>
                <div style={{ fontSize:'10px', color:'rgba(245,237,214,0.4)' }}>{m.sub}</div>
              </button>
            )
          })}
        </div>

        <button onClick={() => payMutation.mutate()} disabled={payMutation.isPending}
          className="btn-gold-luxury" style={{ width:'100%', padding:'16px', borderRadius:'14px', fontSize:'16px', opacity: payMutation.isPending ? 0.7 : 1 }}>
          {payMutation.isPending ? t.paying : t.confirmPay}
        </button>
      </div>
    </div>
  )
}
