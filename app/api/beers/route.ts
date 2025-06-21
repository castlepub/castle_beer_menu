import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const beers = await prisma.beer.findMany({
      orderBy: { tapNumber: 'asc' },
    })
    return NextResponse.json(beers)
  } catch (error) {
    console.error('Error fetching beers:', error)
    return NextResponse.json({ error: 'Failed to fetch beers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tapNumber, displayNumber, name, brewery, abv, style, price, logo, status, tags, location, isCore } = body

    const beer = await prisma.beer.create({
      data: {
        tapNumber: parseInt(tapNumber),
        displayNumber: displayNumber ? parseInt(displayNumber) : null,
        name,
        brewery,
        abv,
        style,
        price,
        logo: logo || null,
        status: status || 'on_tap',
        tags: tags ? JSON.stringify(tags) : null,
        location: location || null,
        isCore: isCore || false,
      },
    })

    return NextResponse.json(beer, { status: 201 })
  } catch (error) {
    console.error('Error creating beer:', error)
    return NextResponse.json({ error: 'Failed to create beer' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, tapNumber, displayNumber, name, brewery, abv, style, price, logo, status, tags, location, isCore } = body

    const beer = await prisma.beer.update({
      where: { id: parseInt(id) },
      data: {
        tapNumber: parseInt(tapNumber),
        displayNumber: displayNumber ? parseInt(displayNumber) : null,
        name,
        brewery,
        abv,
        style,
        price,
        logo: logo || null,
        status,
        tags: tags ? JSON.stringify(tags) : null,
        location: location || null,
        isCore: isCore || false,
      },
    })

    return NextResponse.json(beer)
  } catch (error) {
    console.error('Error updating beer:', error)
    return NextResponse.json({ error: 'Failed to update beer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Beer ID is required' }, { status: 400 })
    }

    await prisma.beer.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Beer deleted successfully' })
  } catch (error) {
    console.error('Error deleting beer:', error)
    return NextResponse.json({ error: 'Failed to delete beer' }, { status: 500 })
  }
} 