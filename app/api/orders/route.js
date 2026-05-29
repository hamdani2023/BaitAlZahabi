// app/api/orders/route.js  ←  GET/POST /api/orders
// ============================================================
// MongoDB: نبحث بـ number (Int) وليس id
// ============================================================
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

// GET /api/orders?table=5
export async function GET(request) {
  try {
    const tableNum = Number(request.nextUrl.searchParams.get('table'))

    const table = await prisma.table.findUnique({ where: { number: tableNum } })
    if (!table) return NextResponse.json({ error: 'الطاولة غير موجودة' }, { status: 404 })

    const orders = await prisma.order.findMany({
      where:   { tableId: table.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { menuItem: true } } }
    })
    return NextResponse.json(orders)
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب الطلبات' }, { status: 500 })
  }
}

// POST /api/orders  ←  body: { tableNumber, items: [{id, qty}] }
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.tableNumber || !Array.isArray(body.items) || !body.items.length) {
      return NextResponse.json({ error: 'tableNumber و items مطلوبان' }, { status: 400 })
    }

    // 1. جلب الطاولة بالرقم
    const table = await prisma.table.findUnique({
      where: { number: Number(body.tableNumber) }
    })
    if (!table) return NextResponse.json({ error: 'الطاولة غير موجودة' }, { status: 404 })

    // 2. جلب أسعار الأصناف من MongoDB بالـ ObjectId
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: body.items.map(i => i.id) } }
      // { in: [...] } يعمل مع ObjectId في MongoDB
    })

    const menuMap = new Map(menuItems.map(m => [m.id, m]))

    // 3. حساب المجموع
    let total = 0
    const orderItemsData = body.items.map(({ id, qty }) => {
      const m = menuMap.get(id)
      if (!m) throw new Error(`الصنف ${id} غير موجود`)
      total += m.price * qty
      return { menuItemId: id, quantity: qty, unitPrice: m.price }
    })

    // 4. إنشاء الطلب
    const order = await prisma.order.create({
      data: {
        tableId:     table.id,
        totalAmount: total,
        status:      'PENDING',
        items:       { create: orderItemsData }
      },
      include: { items: { include: { menuItem: true } } }
    })

    // 5. تحديث حالة الطاولة
    await prisma.table.update({
      where: { id: table.id },
      data:  { status: 'OCCUPIED' }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    console.error('POST /api/orders:', e)
    return NextResponse.json({ error: e.message || 'فشل إنشاء الطلب' }, { status: 500 })
  }
}
