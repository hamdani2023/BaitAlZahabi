// app/api/admin/tables/route.js
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

export async function GET() {
  try {
    const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } })
    return NextResponse.json(tables.map(t => ({
      number:   t.number,
      capacity: t.capacity,
      status:   t.status.toLowerCase(),
    })))
  } catch (e) {
    const s = ['free','occ','call','occ','occ','free','call','res','occ','free','occ','call','free','occ','free','res','occ','free','occ','occ']
    return NextResponse.json(s.map((status,i) => ({ number:i+1, capacity:4, status })))
  }
}

export async function PATCH(request) {
  try {
    const { tableNumber, status } = await request.json()
    const table = await prisma.table.update({
      where: { number: Number(tableNumber) },
      data:  { status: status.toUpperCase() }
    })
    return NextResponse.json({ success: true, table })
  } catch (e) {
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 })
  }
}
