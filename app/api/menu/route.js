import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'
import { MENU_ITEMS }   from '@/lib/menuData'

const CATEGORY_AR = { APPETIZERS:'مقبلات', GRILLS:'مشويات', CHICKEN:'دجاج', SEAFOOD:'بحري', SALADS:'سلطات', DRINKS:'مشروبات', DESSERTS:'حلويات' }

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({ where:{ isAvailable:true }, orderBy:{ sortOrder:'asc' } })
    const formatted = items.map(item => {
      const local = MENU_ITEMS.find(l => l.name === item.name || l.id === item.sortOrder)
      return {
        id:    item.id,
        cat:   item.category,
        catAr: CATEGORY_AR[item.category],
        e:     item.emoji,
        name:  item.name,
        desc:  item.description,
        price: item.price,
        badge: item.badge,
        img:   local?.img || '',
      }
    })
    return NextResponse.json(formatted)
  } catch (e) {
    console.error('GET /api/menu:', e)
    return NextResponse.json({ error: 'فشل جلب القائمة' }, { status: 500 })
  }
}
