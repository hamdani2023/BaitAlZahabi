/*
  ==========================================
  components/Spinner.jsx
  ==========================================

  مكونات مساعدة تُستخدم في كل الصفحات:

  <Spinner />      ← دوامة تحميل
  <ErrorMsg />     ← رسالة خطأ مع زر إعادة
  <Empty />        ← رسالة "لا توجد بيانات"

  لا تحتاج 'use client' لأنها لا تستخدم hooks.
*/

/* ── دوامة التحميل ── */
export function Spinner() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px', gap:'12px' }}>
      {/* دائرة تدور */}
      <div style={{
        width:       '40px',
        height:      '40px',
        borderRadius:'50%',
        border:      '2px solid rgba(201,168,76,0.25)',
        borderTop:   '2px solid #C9A84C',
        animation:   'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize:'13px', color:'#555' }}>جاري التحميل...</p>

      {/* نضيف كلاس spin مباشرة */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* ── رسالة الخطأ ── */
export function ErrorMsg({ message = 'حدث خطأ في التحميل', onRetry }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px', gap:'14px', textAlign:'center' }}>
      <span style={{ fontSize:'48px' }}>⚠️</span>
      <p style={{ fontSize:'13px', color:'#666' }}>{message}</p>
      {/* زر إعادة المحاولة — يظهر فقط إذا مُررنا onRetry */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding:      '10px 24px',
            borderRadius: '12px',
            border:       '1px solid rgba(201,168,76,0.3)',
            background:   'rgba(201,168,76,0.12)',
            color:        '#C9A84C',
            fontSize:     '13px',
            fontWeight:   '700',
            cursor:       'pointer',
          }}
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}

/* ── رسالة فارغة ── */
export function Empty({ icon = '📭', message = 'لا توجد بيانات' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px', gap:'10px' }}>
      <span style={{ fontSize:'48px' }}>{icon}</span>
      <p style={{ fontSize:'13px', color:'#555' }}>{message}</p>
    </div>
  )
}
