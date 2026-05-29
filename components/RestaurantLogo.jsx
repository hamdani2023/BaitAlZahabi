'use client'
// اسم المطعم ثابت بالفرنسية — لا يُترجم أبداً
const FIXED_NAME = "Maison d'or"

export default function RestaurantLogo({ size = 'md' }) {
  const sizes = {
    sm: { wrap:52, crown:18, title:15, sub:8,  gap:6  },
    md: { wrap:80, crown:26, title:22, sub:10, gap:8  },
    lg: { wrap:110,crown:36, title:32, sub:12, gap:10 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:`${s.gap}px` }}>
      {/* الشعار */}
      <div style={{ position:'relative', width:s.wrap, height:s.wrap }}>
        {/* الحلقة الخارجية المتوهجة */}
        <div style={{
          position:'absolute', inset:'-6px', borderRadius:'50%',
          border:'1px solid rgba(201,168,76,0.15)',
          animation:'spin-slow 20s linear infinite',
        }}/>
        {/* الحلقة الوسطى */}
        <div style={{
          position:'absolute', inset:'-2px', borderRadius:'50%',
          border:'1.5px solid rgba(201,168,76,0.35)',
          background:'transparent',
        }}/>
        {/* الدائرة الرئيسية */}
        <div style={{
          width:'100%', height:'100%', borderRadius:'50%',
          background:'radial-gradient(circle at 35% 35%, rgba(201,168,76,0.22), rgba(139,105,20,0.08) 60%, rgba(10,8,5,0.9))',
          border:'1px solid rgba(201,168,76,0.5)',
          boxShadow:'0 0 30px rgba(201,168,76,0.18), inset 0 0 20px rgba(201,168,76,0.06)',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', overflow:'hidden',
        }}>
          {/* SVG داخلي — نجمة ثمانية + هلال */}
          <svg width={s.crown * 1.8} height={s.crown * 1.8} viewBox="0 0 60 60" fill="none">
            {/* النجمة الإسلامية */}
            <g transform="translate(30,30)">
              {[0,45,90,135,180,225,270,315].map(deg => (
                <polygon key={deg}
                  points="0,-11 2.5,-5 9,-5 4,0 6,7 0,3 -6,7 -4,0 -9,-5 -2.5,-5"
                  fill="rgba(201,168,76,0.85)"
                  transform={`rotate(${deg})`}
                  style={{ filter:'drop-shadow(0 0 3px rgba(201,168,76,0.6))' }}
                />
              ))}
              {/* الدائرة المركزية */}
              <circle r="5" fill="rgba(201,168,76,0.2)" stroke="rgba(201,168,76,0.7)" strokeWidth="1"/>
              <circle r="2.5" fill="rgba(232,200,112,0.9)"/>
            </g>
            {/* خطوط الزينة الأركان */}
            {[[-24,-24],[24,-24],[24,24],[-24,24]].map(([x,y],i)=>(
              <circle key={i} cx={30+x} cy={30+y} r="1.5" fill="rgba(201,168,76,0.4)"/>
            ))}
          </svg>
          {/* وميض داخلي */}
          <div style={{
            position:'absolute', top:'15%', left:'20%',
            width:'30%', height:'25%',
            background:'radial-gradient(ellipse, rgba(255,255,255,0.08), transparent)',
            borderRadius:'50%', transform:'rotate(-30deg)',
          }}/>
        </div>
        {/* نقاط الزينة الأركان */}
        {[0,90,180,270].map(deg => {
          const rad = (deg * Math.PI) / 180
          const r = s.wrap / 2 + 3
          return (
            <div key={deg} style={{
              position:'absolute',
              width:'5px', height:'5px', borderRadius:'50%',
              background:'linear-gradient(135deg,#E8C870,#C9A84C)',
              boxShadow:'0 0 6px rgba(201,168,76,0.8)',
              top: `calc(50% + ${Math.sin(rad) * r}px - 2.5px)`,
              left:`calc(50% + ${Math.cos(rad) * r}px - 2.5px)`,
            }}/>
          )
        })}
      </div>

      {/* الاسم — ثابت بالإنجليزية دائماً */}
      <div style={{ textAlign:'center' }}>
        <div style={{
          fontFamily:'Playfair Display, serif',
          fontSize: s.title, fontWeight:'700', fontStyle:'italic',
          background:'linear-gradient(135deg, #F5E6B8 0%, #E8C870 40%, #C9A84C 70%, #8B6914 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          lineHeight:1.1, marginBottom:'3px',
          letterSpacing:'0.5px',
          textShadow:'none',
        }}>
          {FIXED_NAME}
        </div>
        <div style={{
          fontSize: s.sub, color:'rgba(201,168,76,0.5)',
          letterSpacing:'4px', fontWeight:'500',
          fontFamily:'Playfair Display, serif',
        }}>
          FINE  DINING
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
