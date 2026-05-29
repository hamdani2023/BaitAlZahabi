// app/api/bills/route.js  ←  GET/POST /api/bills
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

const VAT = 0.15

// GET /api/bills?table=5
export async function GET(request) {
  try {
    const tableNum = Number(request.nextUrl.searchParams.get('table'))
    const table = await prisma.table.findUnique({ where: { number: tableNum } })
    if (!table) return NextResponse.json(getMock())

    // جلب أحدث فاتورة غير مدفوعة
    let bill = await prisma.bill.findFirst({
      where:   { tableId: table.id, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { menuItem: true } } }
    })

    if (!bill) {
      // بناء الفاتورة من آخر طلب مكتمل
      const order = await prisma.order.findFirst({
        where:   { tableId: table.id, status: { in: ['PREPARING','READY','DELIVERED'] } },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { menuItem: true } } }
      })
      if (!order) return NextResponse.json(getMock())

      const sub   = order.totalAmount
      const vat   = sub * VAT
      bill = await prisma.bill.create({
        data: {
          tableId: table.id, orderId: order.id,
          subtotal: sub, vatAmount: vat, totalAmount: sub + vat,
          items: {
            create: order.items.map(i => ({
              menuItemId: i.menuItemId,
              quantity:   i.quantity,
              unitPrice:  i.unitPrice,
              lineTotal:  i.unitPrice * i.quantity,
            }))
          }
        },
        include: { items: { include: { menuItem: true } } }
      })
    }

    return NextResponse.json({
      id:       bill.id,
      items:    bill.items.map(i => ({
        e: i.menuItem.emoji, name: i.menuItem.name,
        qty: i.quantity, price: i.unitPrice,
      })),
      subtotal: bill.subtotal,
      vat:      bill.vatAmount,
      total:    bill.totalAmount,
    })
  } catch (e) {
    console.error('GET /api/bills:', e)
    return NextResponse.json(getMock())
  }
}

// POST /api/bills  ←  { billId, paymentMethod }
export async function POST(request) {
  try {
    const { billId, paymentMethod } = await request.json()

    const bill = await prisma.bill.update({
      where: { id: billId },
      data:  {
        status:        'PAID',
        paymentMethod: (paymentMethod || 'CASH').toUpperCase(),
        paidAt:        new Date(),
      }
    })

    await prisma.table.update({
      where: { id: bill.tableId },
      data:  { status: 'FREE' }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'فشل تسجيل الدفع' }, { status: 500 })
  }
}

function getMock() {
  const items = [
    { e:'🥩', name:'كباب مشوي',    qty:2, price:65 },
    { e:'🥗', name:'سلطة فتوش',    qty:1, price:28 },
    { e:'🧃', name:'عصير برتقال', qty:2, price:20 },
    { e:'🍰', name:'كنافة',        qty:1, price:35 },
  ]
  const sub = items.reduce((s,i) => s + i.price*i.qty, 0)
  return { id:'0', items, subtotal:sub, vat:+(sub*0.15).toFixed(2), total:+(sub*1.15).toFixed(2) }
}
