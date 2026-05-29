// app/api/reviews/route.js  ←  POST /api/reviews
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'

export async function POST(request) {
  try {
    const body  = await request.json()
    const table = await prisma.table.findUnique({
      where: { number: Number(body.tableNumber) }
    })
    if (!table) return NextResponse.json({ error: 'الطاولة غير موجودة' }, { status: 404 })

    const review = await prisma.review.create({
      data: {
        tableId:       table.id,
        overallRating: body.overallRating,
        foodRating:    body.food    ?? null,
        serviceRating: body.service ?? null,
        speedRating:   body.speed   ?? null,
        cleanRating:   body.clean   ?? null,
        comment:       body.comment ?? null,
      }
    })

    return NextResponse.json({ success: true, reviewId: review.id }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'فشل حفظ التقييم' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { table: { select: { number: true } } }
    })
    return NextResponse.json(reviews)
  } catch (e) {
    return NextResponse.json({ error: 'فشل جلب التقييمات' }, { status: 500 })
  }
}
