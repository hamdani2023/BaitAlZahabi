'use client'
import { useEffect } from 'react'
import useStore from '@/lib/store'
import { LANGS } from '@/lib/i18n'

// هذا المكوّن يُطبّق اتجاه اللغة (RTL/LTR) على كامل الصفحة عند تغيير اللغة
export default function LangWrapper({ children }) {
  const lang = useStore(s => s.lang)
  const dir  = LANGS[lang]?.dir || 'rtl'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir  = dir
    document.body.dir              = dir
    document.body.style.fontFamily = dir === 'rtl'
      ? "'Tajawal', 'Cairo', sans-serif"
      : "'Tajawal', sans-serif"
  }, [lang, dir])

  return <>{children}</>
}
