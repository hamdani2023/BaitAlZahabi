'use client'
import useStore from '@/lib/store'
import { LANGS, RESTAURANT_NAME, RESTAURANT_NAME_AR } from '@/lib/i18n'

export default function RestaurantFooter() {
  const lang = useStore(s => s.lang)
  const t = LANGS[lang]

  return (
    <footer style={{
      background:'linear-gradient(180deg, #0A0805 0%, #060402 60%, #020100 100%)',
      borderTop:'1px solid rgba(201,168,76,0.15)',
      marginTop:'8px',
      direction: t.dir,
      position:'relative',
      overflow:'hidden',
    }}>
      {/* خطوط الزينة العلوية */}
      <div style={{ height:'3px', background:'linear-gradient(90deg,transparent 0%,rgba(201,168,76,0.15) 20%,rgba(201,168,76,0.7) 50%,rgba(201,168,76,0.15) 80%,transparent 100%)' }}/>
      <div style={{ height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent)', marginTop:'3px' }}/>

      {/* الزخارف الخلفية */}
      <div style={{ position:'absolute', top:'-60px', left:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,0.04),transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,0.04),transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:'540px', margin:'0 auto', padding:'40px 20px 0' }}>

        {/* الشعار والاسم */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          {/* SVG Logo مصغر */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
            <div style={{ position:'relative', width:'72px', height:'72px' }}>
              <div style={{ position:'absolute', inset:'-2px', borderRadius:'50%', border:'1.5px solid rgba(201,168,76,0.3)' }}/>
              <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'radial-gradient(circle at 35% 35%,rgba(201,168,76,0.2),rgba(10,8,5,0.95))', border:'1px solid rgba(201,168,76,0.45)', boxShadow:'0 0 24px rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
                  <g transform="translate(30,30)">
                    {[0,45,90,135,180,225,270,315].map(deg=>(
                      <polygon key={deg} points="0,-10 2.2,-4.5 8,-4.5 3.5,0.5 5.5,6.5 0,3 -5.5,6.5 -3.5,0.5 -8,-4.5 -2.2,-4.5"
                        fill="rgba(201,168,76,0.8)" transform={`rotate(${deg})`}/>
                    ))}
                    <circle r="4.5" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
                    <circle r="2" fill="rgba(232,200,112,0.9)"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:'26px', fontWeight:'700', fontStyle:'italic', background:'linear-gradient(135deg,#F5E6B8,#E8C870,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'4px', letterSpacing:'0.5px' }}>
            Maison d'or
          </div>
          <div style={{ fontSize:'11px', color:'rgba(201,168,76,0.45)', letterSpacing:'5px', fontFamily:'Playfair Display,serif', marginBottom:'8px' }}>
            FINE  DINING
          </div>
          <div style={{ fontSize:'13px', color:'rgba(245,237,214,0.4)', fontFamily:'Tajawal,sans-serif' }}>
            Gastronomie Raffinée
          </div>
        </div>

        {/* فاصل بزخرفة */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px' }}>
          <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3))' }}/>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <g transform="translate(12,12)">
              {[0,45,90,135,180,225,270,315].map(deg=>(
                <polygon key={deg} points="0,-5 1,-2 4,-2 1.5,0.5 2.5,3.5 0,2 -2.5,3.5 -1.5,0.5 -4,-2 -1,-2"
                  fill="rgba(201,168,76,0.7)" transform={`rotate(${deg})`}/>
              ))}
            </g>
          </svg>
          <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,rgba(201,168,76,0.3),transparent)' }}/>
        </div>

        {/* نص التعريف */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <p style={{ fontSize:'13px', color:'rgba(245,237,214,0.5)', lineHeight:1.9, fontFamily:'Tajawal,sans-serif' }}>
            {t.aboutText}
          </p>
        </div>

        {/* شبكة المعلومات 2×2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'32px' }}>
          {[
            { icon:'📍', label:t.location,  value:t.locationText,  href:null },
            { icon:'🕐', label:t.hours,     value:t.hoursText,     href:null },
            { icon:'📞', label:t.phone,     value:'+213 550 123 456', href:'tel:+213550123456' },
            { icon:'✉️', label:t.email,     value:'contact@baitalzahabi.dz', href:'mailto:contact@baitalzahabi.dz' },
          ].map((item,i) => (
            <div key={i} style={{ background:'rgba(201,168,76,0.03)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:'14px', padding:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'7px' }}>
                <span style={{ fontSize:'15px' }}>{item.icon}</span>
                <span style={{ fontSize:'10px', color:'rgba(201,168,76,0.7)', letterSpacing:'1.5px', fontWeight:'700', textTransform:'uppercase' }}>{item.label}</span>
              </div>
              {item.href
                ? <a href={item.href} style={{ fontSize:'11px', color:'rgba(245,237,214,0.55)', textDecoration:'none', wordBreak:'break-all', lineHeight:1.6 }}>{item.value}</a>
                : <p style={{ fontSize:'11px', color:'rgba(245,237,214,0.5)', lineHeight:1.6, margin:0 }}>{item.value}</p>
              }
            </div>
          ))}
        </div>

        {/* الشبكات الاجتماعية */}
        <div style={{ marginBottom:'32px' }}>
          <div style={{ textAlign:'center', fontSize:'10px', color:'rgba(201,168,76,0.5)', letterSpacing:'3px', fontWeight:'700', marginBottom:'16px', textTransform:'uppercase' }}>
            ✦ {t.followUs}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'14px' }}>
            {[
              { label:'f',  name:'Facebook',  color:'#1877F2', bg:'rgba(24,119,242,0.08)',  border:'rgba(24,119,242,0.2)'  },
              { label:'ig', name:'Instagram', color:'#E4405F', bg:'rgba(228,64,95,0.08)',   border:'rgba(228,64,95,0.2)'   },
              { label:'tw', name:'Twitter',   color:'#1DA1F2', bg:'rgba(29,161,242,0.08)',  border:'rgba(29,161,242,0.2)'  },
              { label:'yt', name:'YouTube',   color:'#FF0000', bg:'rgba(255,0,0,0.08)',     border:'rgba(255,0,0,0.2)'     },
              { label:'tk', name:'TikTok',    color:'#69C9D0', bg:'rgba(105,201,208,0.08)', border:'rgba(105,201,208,0.2)' },
            ].map(s => (
              <a key={s.name} href="#"
                style={{ width:'46px', height:'46px', borderRadius:'14px', background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, fontSize:'11px', fontWeight:'900', textDecoration:'none', transition:'all 0.2s', flexShrink:0 }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 8px 20px ${s.color}30`}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}
              >{s.label}</a>
            ))}
          </div>
        </div>

        {/* فريق التطوير */}
        <div style={{ marginBottom:'24px', textAlign:'center' }}>
          <div style={{ fontSize:'10px', color:'rgba(201,168,76,0.45)', letterSpacing:'3px', fontWeight:'700', marginBottom:'12px', textTransform:'uppercase' }}>
            ✦ طُوِّر من طرف
          </div>
          <div style={{ fontSize:'12px', color:'rgba(245,237,214,0.45)', fontFamily:'Tajawal,sans-serif', lineHeight:2, letterSpacing:'0.5px' }}>
            بلباهي إكرام خلود &nbsp;·&nbsp; مداني كريمة &nbsp;·&nbsp; جودي أسماء
          </div>
        </div>

        {/* الجزء السفلي */}
        <div style={{ borderTop:'1px solid rgba(201,168,76,0.08)', paddingTop:'20px', paddingBottom:'24px', textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'8px' }}>
            <div style={{ height:'1px', width:'30px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3))' }}/>
            <span style={{ fontSize:'16px', opacity:0.5 }}>✦</span>
            <div style={{ height:'1px', width:'30px', background:'linear-gradient(90deg,rgba(201,168,76,0.3),transparent)' }}/>
          </div>
          <div style={{ fontSize:'10px', color:'rgba(245,237,214,0.2)', letterSpacing:'1.5px', lineHeight:1.8 }}>
            {t.allRights}
          </div>
          <div style={{ fontSize:'9px', color:'rgba(245,237,214,0.12)', letterSpacing:'1px', marginTop:'4px' }}>
            Oran • Algeria • Since 2020
          </div>
        </div>
      </div>

      {/* الخط السفلي */}
      <div style={{ height:'2px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }}/>
    </footer>
  )
}
