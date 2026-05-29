// app/api/calls/route.js  ←  GET/POST /api/calls
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

function relTime(date) {
  const m = Math.floor((Date.now() - new Date(date)) / 60000)
  return m < 1 ? 'الآن' : m < 60 ? `${m} د` : `${Math.floor(m/60)} س`
}
const typeAr = { URGENT:'نداء عاجل', NORMAL:'نداء النادل', LOW:'طلب بسيط' }

// GET /api/calls?status=pending
export async function GET(request) {
  try {
    const status = request.nextUrl.searchParams.get('status')

    const calls = await prisma.call.findMany({
      where:   status ? { status: status.toUpperCase() } : {},
      orderBy: { createdAt: 'desc' },
      include: { table: true }
    })

    return NextResponse.json(calls.map(c => ({
      id:      c.id,                        // ObjectId String
      table:   `طاولة ${c.table.number}`,
      tableId: c.tableId,
      request: c.message || typeAr[c.type] || 'نداء',
      type:    c.type.toLowerCase(),
      status:  c.status.toLowerCase(),
      time:    relTime(c.createdAt),
    })))
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب النداءات' }, { status: 500 })
  }
}

// POST /api/calls  ←  { tableNumber, type, message }
export async function POST(request) {
  try {
    const body  = await request.json()
    const table = await prisma.table.findUnique({
      where: { number: Number(body.tableNumber) }
    })
    if (!table) return NextResponse.json({ error: 'الطاولة غير موجودة' }, { status: 404 })

    const call = await prisma.call.create({
      data: {
        tableId: table.id,
        type:    (body.type || 'NORMAL').toUpperCase(),
        status:  'PENDING',
        message: body.message || null,
      },
      include: { table: true }
    })

    await prisma.table.update({ where: { id: table.id }, data: { status: 'CALLING' } })

    return NextResponse.json({
      id:      call.id,
      table:   `طاولة ${call.table.number}`,
      request: call.message || typeAr[call.type],
      time:    'الآن',
    }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'فشل إنشاء النداء' }, { status: 500 })
  }
}
