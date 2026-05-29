'use client'
import LangSwitcher from '@/components/LangSwitcher'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useStore from '@/lib/store'
import { LANGS, RESTAURANT_NAME } from '@/lib/i18n'
import { submitReview } from '@/lib/api'

export default function FeedbackPage() {
  const router      = useRouter()
  const tableNumber = useStore(s => s.tableNumber)
  const lang        = useStore(s => s.lang)
  const t           = LANGS[lang]
  const showToast   = useStore(s => s.showToast)

  const [mainRating, setMainRating] = useState(0)
  const [aspects,    setAspects]    = useState({food:0,service:0,speed:0,clean:0})
  const [comment,    setComment]    = useState('')
  const [submitted,  setSubmitted]  = useState(false)

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => { setSubmitted(true); showToast('✦ ' + t.thankYouFeedback, 'gold') },
    onError:   () => showToast(t.errorGeneral, 'red'),
  })

  function rateAspect(key, n) { setAspects(p => ({...p,[key]:n})) }

  function submit() {
    if (!mainRating) { showToast(t.chooseOverallFirst, 'red'); return }
    reviewMutation.mutate({ tableNumber, overallRating:mainRating, ...aspects, comment })
  }

  const ASPECTS_KEYS = ['food','service','speed','clean']

  if (submitted) return (
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t?.dir || 'rtl', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', textAlign:'center', minHeight:'80vh' }}>
      <div style={{ position:'relative', marginBottom:'24px' }}>
        <div style={{ fontSize:'80px', animation:'float 3s ease-in-out infinite' }}>🏆</div>
        <div style={{ position:'absolute', top:0, left:'-10px', right:'-10px', bottom:'-10px', background:'radial-gradient(circle,rgba(201,168,76,0.2),transparent)', borderRadius:'50%', animation:'glow-gold 2.5s infinite' }}/>
      </div>
      <div className="font-playfair" style={{ fontSize:'26px', fontStyle:'italic', color:'var(--gold-light)', marginBottom:'8px' }}>{t.thankYouFeedback}</div>
      <div className="ornament-line" style={{ margin:'10px auto', width:'200px' }}>Thank You</div>
      <div style={{ fontSize:'13px', color:'rgba(245,237,214,0.5)', marginBottom:'28px', lineHeight:1.9, marginTop:'10px' }}>
        {t.feedbackReceived}<br/>{t.comeBackSoon}
      </div>
      <button onClick={() => router.push('/')} className="btn-gold-luxury" style={{ padding:'14px 36px', borderRadius:'50px', fontSize:'15px' }}>
        {t.backHome}
      </button>
    </div>
  )

  return (
    <div className="scrollable page-in" style={{ background:'var(--dark)', direction: t?.dir || 'rtl' }}>

      {/* Hero */}
      <div style={{ position:'relative', height:'170px', overflow:'hidden' }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"
          alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 60%' }}/>
        <div className="hero-bg-overlay" style={{ position:'absolute', inset:0 }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'rgba(10,8,5,0.5)', backdropFilter:'blur(10px)' }}>
          <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'var(--cream)', fontSize:'17px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <span className="font-cairo" style={{ flex:1, fontSize:'17px', fontWeight:'800', color:'var(--cream)' }}>{t.feedbackTitle}</span>
          <LangSwitcher />
          <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.3)', color:'#A78BFA' }}>🪑 {t.tableLabel || 'طاولة'} {tableNumber||'—'}</span>
        </div>
        <div style={{ position:'absolute', bottom:'14px', left:0, right:0, textAlign:'center', zIndex:5 }}>
          <div className="font-playfair" style={{ fontSize:'18px', fontStyle:'italic', color:'var(--gold-light)' }}>{t.heroFeedback}</div>
        </div>
      </div>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'20px 16px 32px' }}>

        {/* Intro */}
        <div style={{ textAlign:'center', marginBottom:'22px' }}>
          <div style={{ fontSize:'40px', marginBottom:'10px' }}>⭐</div>
          <div className="font-playfair" style={{ fontSize:'20px', fontStyle:'italic', color:'var(--cream)', marginBottom:'4px' }}>
            {t.howWasExp}
          </div>
          <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.4)' }}>{t.feedbackSub}</div>
        </div>

        {/* التقييم العام */}
        <div className="luxury-card" style={{ padding:'20px', marginBottom:'14px', textAlign:'center' }}>
          <div style={{ fontSize:'13px', color:'var(--gold)', fontWeight:'600', letterSpacing:'2px', marginBottom:'14px' }}>
            {t.overallRating}
          </div>
          <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'8px' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setMainRating(n)} style={{
                fontSize:'36px', background:'none', border:'none', cursor:'pointer',
                filter: n <= mainRating ? 'drop-shadow(0 0 8px rgba(201,168,76,0.9)) brightness(1.2)' : 'grayscale(1) brightness(0.3)',
                transform: n <= mainRating ? 'scale(1.15)' : 'scale(1)',
                transition:'all 0.2s',
              }}>⭐</button>
            ))}
          </div>
          <div style={{ fontSize:'13px', color:'var(--gold)', minHeight:'20px', fontWeight:'600' }}>
            {(t.starLabels || [])[mainRating] || ''}
          </div>
        </div>

        {/* التقييمات التفصيلية */}
        <div className="ornament-line" style={{ marginBottom:'12px' }}>{t.detailedRating}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px' }}>
          {ASPECTS_KEYS.map(key => {
            const a = t.aspects?.[key] || {}
            const rating = aspects[key]
            return (
              <div key={key} className="luxury-card" style={{ padding:'14px 12px', textAlign:'center', border: rating>0 ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(201,168,76,0.1)', background: rating>0 ? 'rgba(201,168,76,0.06)' : 'var(--dark-3)', transition:'all 0.25s' }}>
                <span style={{ fontSize:'24px', display:'block', marginBottom:'6px' }}>{a.icon || '⭐'}</span>
                <div className="font-cairo" style={{ fontSize:'12px', fontWeight:'700', marginBottom:'8px', color:'var(--cream)' }}>{a.label || key}</div>
                <div style={{ display:'flex', gap:'3px', justifyContent:'center' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => rateAspect(key,n)} style={{
                      fontSize:'14px', background:'none', border:'none', cursor:'pointer', padding:'1px',
                      filter: n<=rating ? 'none' : 'grayscale(1) brightness(0.3)',
                      transition:'filter 0.15s',
                    }}>⭐</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* التعليق */}
        <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.45)', marginBottom:'8px', fontWeight:'500' }}>
          {t.addComment}
        </div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4}
          placeholder={t.commentPlaceholder} className="input-luxury"
          style={{ width:'100%', padding:'13px', resize:'none', marginBottom:'14px', fontSize:'13px' }}/>

        <button onClick={submit} disabled={reviewMutation.isPending}
          style={{
            width:'100%', padding:'16px', borderRadius:'14px', border:'none',
            fontFamily:'Cairo,sans-serif', fontSize:'16px', fontWeight:'900',
            cursor: reviewMutation.isPending ? 'not-allowed' : 'pointer',
            background:'linear-gradient(135deg,#8B5CF6,#6D28D9)',
            color:'white', boxShadow:'0 6px 24px rgba(139,92,246,0.35)',
            opacity: reviewMutation.isPending ? 0.7 : 1, transition:'all 0.3s',
          }}>
          {reviewMutation.isPending ? t.sendingReview : t.submitReview}
        </button>
      </div>
    </div>
  )
}
