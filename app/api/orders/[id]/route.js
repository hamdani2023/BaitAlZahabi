// app/api/orders/[id]/route.js  ←  PATCH /api/orders/:objectId
// MongoDB: params.id هو ObjectId String
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { id } = params   // ObjectId String
    const body   = await request.json()

    const VALID = ['PENDING','PREPARING','READY','DELIVERED','CANCELLED']
    if (!VALID.includes(body.status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where:   { id },           // MongoDB يقبل id مباشرة
      data:    { status: body.status },
      include: { table: true, items: { include: { menuItem: true } } }
    })

    // إنشاء الفاتورة عند التسليم
    if (body.status === 'DELIVERED') {
      const exists = await prisma.bill.findFirst({ where: { orderId: id } })
      if (!exists) {
        const sub   = order.totalAmount
        const vat   = sub * 0.15
        const total = sub + vat
        await prisma.bill.create({
          data: {
            tableId: order.tableId,
            orderId: order.id,
            subtotal: sub, vatAmount: vat, totalAmount: total,
            items: {
              create: order.items.map(i => ({
                menuItemId: i.menuItemId,
                quantity:   i.quantity,
                unitPrice:  i.unitPrice,
                lineTotal:  i.unitPrice * i.quantity,
              }))
            }
          }
        })
      }
    }

    return NextResponse.json({ success: true, id, status: body.status })
  } catch (e) {
    return NextResponse.json({ error: 'فشل تحديث الطلب' }, { status: 500 })
  }
}
