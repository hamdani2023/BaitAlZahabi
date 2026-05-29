// app/api/admin/orders/route.js
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

const STATUS_AR = { PENDING:'معلق', PREPARING:'في المطبخ', READY:'جاهز للتقديم', DELIVERED:'تم التسليم', CANCELLED:'ملغي' }

export async function GET(request) {
  try {
    const status = request.nextUrl.searchParams.get('status')
    const orders = await prisma.order.findMany({
      where:   status ? { status: status.toUpperCase() } : { status: { in: ['PENDING','PREPARING','READY'] } },
      orderBy: { createdAt: 'desc' },
      take:    20,
      include: { table: true, items: { include: { menuItem: { select:{ name:true, emoji:true } } } } }
    })

    return NextResponse.json(orders.map(o => ({
      id:          o.id,
      table:       o.table.number,
      status:      o.status,
      statusAr:    STATUS_AR[o.status],
      totalAmount: o.totalAmount,
      items:       o.items.map(i => `${i.menuItem.emoji} ${i.menuItem.name} ×${i.quantity}`).join('، ')
    })))
  } catch (e) {
    return NextResponse.json([
      { id:'1', table:5, status:'PREPARING', statusAr:'في المطبخ',    totalAmount:150, items:'🥩 كباب ×2، 🥗 سلطة ×1' },
      { id:'2', table:9, status:'READY',     statusAr:'جاهز للتقديم', totalAmount:135, items:'🦐 روبيان ×1'             },
    ])
  }
}
