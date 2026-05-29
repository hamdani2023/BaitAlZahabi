'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { getMenu, createOrder } from '@/lib/api'
import { MENU_ITEMS, CATEGORIES, BADGE_CONFIG, formatPrice, getItemName, getItemDesc, getCatName } from '@/lib/menuData'
import LangSwitcher from '@/components/LangSwitcher'
import { LANGS } from '@/lib/i18n'

export default function MenuPage() {
  const router     = useRouter()
  const qc         = useQueryClient()
  const [activeCat, setActiveCat] = useState('ALL')
  const [search,    setSearch]    = useState('')
  const [cartOpen,  setCartOpen]  = useState(false)

  const tableNumber = useStore(s => s.tableNumber)
  const cart        = useStore(s => s.cart)
  const addItem     = useStore(s => s.addItem)
  const changeQty   = useStore(s => s.changeQty)
  const clearCart   = useStore(s => s.clearCart)
  const totalItems  = useStore(s => s.totalItems())
  const showToast   = useStore(s => s.showToast)
  const lang        = useStore(s => s.lang)
  const t           = LANGS[lang]

  const { data: serverMenu } = useQuery({ queryKey:['menu'], queryFn:getMenu })
  const menuItems = serverMenu?.length ? serverMenu.map(s => {
    // نبحث بالـ id أو بالاسم العربي
    const local = MENU_ITEMS.find(l => l.id === s.id || l.name === s.name)
    if (!local) return s
    // الـ server يعطينا: price, isAvailable, sortOrder (بيانات قاعدة البيانات)
    // الـ local يعطينا: img, nameFr, nameEn, descFr, descEn, badge, cat (ترجمة + صور)
    return {
      ...s,                          // بيانات server أساس
      ...local,                      // local يكتب فوق كل شيء
      id:    s.id   || local.id,     // id من server (ObjectId حقيقي)
      price: s.price ?? local.price, // سعر server له الأولوية
      isAvailable: s.isAvailable ?? true,
    }
  }) : MENU_ITEMS

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => { clearCart(); setCartOpen(false); showToast('✦ ' + t.sendOrder, 'gold') },
    onError: () => showToast(t.errorSend, 'red'),
  })

  const filtered = menuItems.filter(item => {
    const mc = activeCat === 'ALL' || item.cat === activeCat || item.category === activeCat
    const nameToSearch = getItemName(item, lang).toLowerCase()
    const ms = !search || nameToSearch.includes(search.toLowerCase())
    return mc && ms
  })

  // تجميع حسب الفئة مع دعم الترجمة
  const grouped = filtered.reduce((acc, item) => {
    const cat = CATEGORIES.find(c => c.id === (item.cat || item.category))
    const key = getCatName(cat, lang) || item.catAr || item.cat || 'أخرى'
    if (!acc[key]) acc[key] = { items: [], catIcon: cat?.icon || '🍽️', catImg: cat?.img || '', catId: cat?.id }
    acc[key].items.push(item)
    return acc
  }, {})

  const cartRows = Object.entries(cart).map(([id, qty]) => ({
    item: menuItems.find(m => String(m.id) === id), qty
  })).filter(x => x.item)

  const subtotal = cartRows.reduce((s, { item, qty }) => s + item.price * qty, 0)
  const vat      = Math.round(subtotal * 0.09)
  const total    = subtotal + vat

  // badge label حسب اللغة
  function getBadgeLabel(badge) {
    if (!badge) return null
    const cfg = BADGE_CONFIG[badge]
    if (!cfg) return null
    if (typeof cfg.label === 'object') return cfg.label[lang] || cfg.label.ar
    return cfg.label
  }

  return (
    <>
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t.dir, paddingBottom: totalItems>0 ? '90px' : '20px' }}>

      {/* Hero */}
      <div style={{ position:'relative', height:'200px', overflow:'hidden' }}>
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
          alt="menu hero" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        <div className="hero-bg-overlay" style={{ position:'absolute', inset:0 }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'rgba(10,8,5,0.5)', backdropFilter:'blur(10px)' }}>
          <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'var(--cream)', fontSize:'17px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <span className="font-cairo" style={{ flex:1, fontSize:'17px', fontWeight:'800', color:'var(--cream)' }}>{t.menuTitle}</span>
          <LangSwitcher />
          <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', color:'var(--gold)' }}>
            🪑 {t.tableLabel || 'طاولة'} {tableNumber || '—'}
          </span>
          <button onClick={() => setCartOpen(true)} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,var(--gold-dark),var(--gold))', border:'none', fontSize:'18px', cursor:'pointer', position:'relative' }}>
            🛒
            {totalItems > 0 && (
              <span style={{ position:'absolute', top:'-4px', left:'-4px', width:'16px', height:'16px', background:'var(--red-warm)', color:'#fff', fontSize:'9px', fontWeight:'900', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--dark)' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
        <div style={{ position:'absolute', bottom:'16px', left:0, right:0, textAlign:'center', zIndex:5 }}>
          <div className="font-playfair" style={{ fontSize:'22px', fontStyle:'italic', color:'var(--gold-light)' }}>
            {t.heroMenu}
          </div>
          <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.6)', letterSpacing:'3px' }}>
            {t.menuTitle}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'0 14px' }}>

        {/* بحث */}
        <div style={{ position:'relative', marginTop:'14px', marginBottom:'12px' }}>
          <input className="input-luxury" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder={t.searchPlaceholder} style={{ width:'100%', padding:'11px 16px 11px 42px', fontSize:'13.5px' }}/>
          <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'16px', opacity:0.4 }}>🔍</span>
        </div>

        {/* فئات */}
        <div style={{ display:'flex', gap:'8px', overflowX:'auto', padding:'4px 0 12px', scrollbarWidth:'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`cat-tab ${activeCat===cat.id?'active':''}`}
              onClick={() => setActiveCat(cat.id)}>
              {cat.icon} {getCatName(cat, lang)}
            </button>
          ))}
        </div>

        {/* الأصناف */}
        {Object.entries(grouped).map(([catName, { items, catIcon }]) => (
          <div key={catName} style={{ marginBottom:'28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <div style={{ fontSize:'22px' }}>{catIcon}</div>
              <h2 className="font-cairo" style={{ fontSize:'18px', fontWeight:'900', color:'var(--cream)' }}>
                {catName}
              </h2>
              <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,rgba(201,168,76,0.35),transparent)' }}/>
              <span style={{ fontSize:'10px', color:'rgba(245,237,214,0.3)', letterSpacing:'1px' }}>
                {items.length} {t.itemCount}
              </span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {items.map(item => {
                const qty   = cart[item.id] || 0
                const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
                const bLabel = getBadgeLabel(item.badge)
                const badgeCfg = item.badge ? BADGE_CONFIG[item.badge] : null

                return (
                  <div key={item.id} className="luxury-card" style={{ overflow:'hidden', cursor:'pointer' }}>
                    {/* صورة */}
                    <div className="food-img-wrap" style={{ height:'120px', borderRadius:0, position:'relative' }}>
                      {item.img ? (
                        <img src={item.img} alt={getItemName(item, lang)} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      ) : (
                        <div style={{ width:'100%', height:'100%', background:'var(--dark-4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>
                          {item.e || item.emoji || '🍽️'}
                        </div>
                      )}
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(10,8,5,0.7) 0%,transparent 60%)' }}/>
                      {bLabel && badgeCfg && (
                        <div style={{ position:'absolute', top:'8px', right:'8px', padding:'3px 8px', borderRadius:'12px', fontSize:'9px', fontWeight:'800', background:badgeCfg.bg, color:badgeCfg.color, letterSpacing:'0.5px' }}>
                          {bLabel}
                        </div>
                      )}
                    </div>

                    {/* معلومات */}
                    <div style={{ padding:'10px 12px 12px' }}>
                      <div className="font-cairo" style={{ fontSize:'13px', fontWeight:'700', color:'var(--cream)', marginBottom:'3px', lineHeight:1.3 }}>
                        {getItemName(item, lang)}
                      </div>
                      <div style={{ fontSize:'10px', color:'rgba(245,237,214,0.45)', marginBottom:'10px', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {getItemDesc(item, lang)}
                      </div>

                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div className="price-luxury" style={{ fontSize:'14px' }}>{formatPrice(price)}</div>
                        {qty > 0 ? (
                          <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:'10px', padding:'4px 8px' }}>
                            <button onClick={() => changeQty(item.id,-1)} style={{ width:'22px', height:'22px', background:'none', border:'none', color:'var(--gold)', fontSize:'18px', fontWeight:'700', cursor:'pointer', lineHeight:1 }}>−</button>
                            <span className="font-cairo" style={{ fontSize:'14px', fontWeight:'800', color:'var(--cream)', minWidth:'16px', textAlign:'center' }}>{qty}</span>
                            <button onClick={() => changeQty(item.id,+1)} style={{ width:'22px', height:'22px', background:'none', border:'none', color:'var(--gold)', fontSize:'18px', fontWeight:'700', cursor:'pointer', lineHeight:1 }}>+</button>
                          </div>
                        ) : (
                          <button onClick={() => { addItem(item.id); showToast(`✦ ${t.addedToCart} ${getItemName(item, lang)}`, 'gold') }}
                            className="btn-gold-luxury" style={{ width:'34px', height:'34px', borderRadius:'10px', fontSize:'20px', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'50px 0', color:'rgba(245,237,214,0.3)' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
            <div className="font-cairo">{t.noResults}</div>
          </div>
        )}
      </div>

      {/* زر السلة العائم */}
      {totalItems > 0 && (
        <div style={{ position:'sticky', bottom:0, padding:'10px 16px 0', background:'linear-gradient(0deg,var(--dark) 60%,transparent)', maxWidth:'520px', margin:'0 auto' }}>
          <button onClick={() => setCartOpen(true)} className="btn-gold-luxury" style={{
            width:'100%', padding:'14px 20px', borderRadius:'16px', fontSize:'14px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            boxShadow:'0 6px 28px rgba(201,168,76,0.4)',
          }}>
            <span>🛒 {t.viewCart}</span>
            <span style={{ background:'rgba(0,0,0,0.25)', padding:'4px 12px', borderRadius:'50px', fontSize:'12px' }}>
              {totalItems} {t.itemCount} — {formatPrice(total)}
            </span>
          </button>
        </div>
      )}
    </div>

    {/* درج السلة */}
    <div onClick={() => setCartOpen(false)} style={{
      position:'fixed', inset:0, zIndex:800,
      background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
      opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? 'all' : 'none',
      transition:'opacity 0.3s',
    }}/>
    <div style={{
      position:'fixed', left:0, right:0, zIndex:801,
      bottom:'var(--nav-h)',
      background:'linear-gradient(180deg,var(--dark-2),var(--dark))',
      borderTop:'1px solid rgba(201,168,76,0.25)',
      borderRadius:'22px 22px 0 0',
      padding:'18px 16px',
      maxHeight:'78vh', overflowY:'auto',
      transform: cartOpen ? 'translateY(0)' : 'translateY(100%)',
      transition:'transform 0.42s cubic-bezier(0.34,1.36,0.64,1)',
      direction: t.dir,
    }}>
      <div style={{ width:'40px', height:'4px', background:'rgba(201,168,76,0.25)', borderRadius:'2px', margin:'0 auto 16px' }}/>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <span className="font-cairo" style={{ fontSize:'17px', fontWeight:'900', color:'var(--cream)' }}>{t.cartTitle}</span>
        <button onClick={() => setCartOpen(false)} style={{ padding:'5px 12px', borderRadius:'8px', border:'1px solid rgba(201,168,76,0.2)', background:'none', color:'rgba(245,237,214,0.5)', cursor:'pointer', fontSize:'12px' }}>{t.cartClose}</button>
      </div>

      {cartRows.map(({ item, qty }) => (
        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'10px', overflow:'hidden', flexShrink:0, border:'1px solid rgba(201,168,76,0.15)' }}>
            {item.img ? <img src={item.img} alt={getItemName(item, lang)} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ width:'100%', height:'100%', background:'var(--dark-4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>{item.e||'🍽️'}</div>}
          </div>
          <div style={{ flex:1 }}>
            <div className="font-cairo" style={{ fontSize:'13px', fontWeight:'600', color:'var(--cream)' }}>{getItemName(item, lang)}</div>
            <div style={{ fontSize:'11px', color:'rgba(245,237,214,0.4)' }}>× {qty}</div>
          </div>
          <div className="price-luxury" style={{ fontSize:'13px' }}>{formatPrice(item.price * qty)}</div>
        </div>
      ))}

      <div style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:'14px', padding:'14px', margin:'14px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'rgba(245,237,214,0.5)', marginBottom:'7px' }}><span>{t.cartSubtotal}</span><span>{formatPrice(subtotal)}</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'rgba(245,237,214,0.5)', marginBottom:'7px' }}><span>{t.cartTax}</span><span>{formatPrice(vat)}</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px solid rgba(201,168,76,0.15)' }}>
          <span className="font-cairo" style={{ fontSize:'17px', fontWeight:'900', color:'var(--cream)' }}>{t.cartTotal}</span>
          <span className="price-luxury" style={{ fontSize:'19px' }}>{formatPrice(total)}</span>
        </div>
      </div>

      <button onClick={() => orderMutation.mutate({ tableNumber, items: Object.entries(cart).map(([id,qty])=>({id,qty})) })}
        disabled={orderMutation.isPending}
        className="btn-gold-luxury" style={{ width:'100%', padding:'15px', borderRadius:'14px', fontSize:'15px', opacity: orderMutation.isPending ? 0.7 : 1 }}>
        {orderMutation.isPending ? t.sendingOrder : t.sendOrder}
      </button>
    </div>
    </>
  )
}
