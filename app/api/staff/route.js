// app/api/staff/route.js
// نقطة نهاية للنُدُل - فلترة النداءات حسب القسم
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const SECTIONS = {
  A: [1,2,3,4,5],
  B: [6,7,8,9,10],
  C: [11,12,13,14,15],
  D: [16,17,18,19,20],
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')?.toUpperCase()

    const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } })

    // فلتر الطاولات حسب القسم
    const sectionTables = section && SECTIONS[section]
      ? tables.filter(t => SECTIONS[section].includes(t.number))
      : tables

    const tableIds = sectionTables.map(t => t.id)

    const calls = await prisma.call.findMany({
      where: { tableId: { in: tableIds }, status: 'PENDING' },
      include: { table: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(calls.map(c => ({
      id: c.id,
      table: `طاولة ${c.table.number}`,
      tableNumber: c.table.number,
      section: section || Object.entries(SECTIONS).find(([,ts]) => ts.includes(c.table.number))?.[0],
      request: c.message || 'نداء عام',
      type: c.type,
      time: new Date(c.createdAt).toLocaleTimeString('ar-DZ', { hour:'2-digit', minute:'2-digit' }),
    })))
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
