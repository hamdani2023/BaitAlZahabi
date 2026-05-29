// app/api/calls/[id]/route.js  ←  PATCH /api/calls/:objectId
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { id } = params   // ObjectId String
    const body   = await request.json()
    const newStatus = body.status === 'accepted' ? 'ACCEPTED' : 'DISMISSED'

    const updated = await prisma.call.update({
      where: { id },
      data:  { status: newStatus },
      include: { table: true }
    })

    if (newStatus === 'ACCEPTED') {
      await prisma.table.update({
        where: { id: updated.tableId },
        data:  { status: 'OCCUPIED' }
      })
    }

    return NextResponse.json({ success: true, id, status: newStatus })
  } catch (e) {
    return NextResponse.json({ error: 'فشل تحديث النداء' }, { status: 500 })
  }
}
