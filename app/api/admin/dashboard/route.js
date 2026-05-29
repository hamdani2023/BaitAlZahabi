// app/api/admin/dashboard/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayOrders, pendingCalls, todayBills, occupiedTables, weekOrders, monthOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.call.count({ where: { status: 'PENDING' } }),
      prisma.bill.aggregate({ where: { createdAt: { gte: today }, status: 'PAID' }, _sum: { totalAmount: true } }),
      prisma.table.count({ where: { status: { in: ['OCCUPIED', 'CALLING'] } } }),
      // أسبوعي
      prisma.order.count({ where: { createdAt: { gte: new Date(Date.now() - 7*24*60*60*1000) } } }),
      // شهري
      prisma.order.count({ where: { createdAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } } }),
    ])

    return NextResponse.json({
      todayOrders,
      pendingCalls,
      revenue: todayBills._sum.totalAmount || 0,
      occupiedTables,
      weekOrders,
      monthOrders,
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
