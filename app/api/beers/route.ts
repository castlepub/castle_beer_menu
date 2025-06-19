import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    const beers = await prisma.beer.findMany({
      orderBy: { tapNumber: 'asc' },
    })
    return NextResponse.json(beers)
  } catch (error) {
    console.error('Error fetching beers:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json({ 
        error: 'Database configuration error. Please check environment variables.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch beers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { tapNumber, name, brewery, abv, style, price, logo, status, tags } = body

    const beer = await prisma.beer.create({
      data: {
        tapNumber: parseInt(tapNumber),
        name,
        brewery,
        abv,
        style,
        price,
        logo: logo || null,
        status: status || 'on_tap',
        tags: tags ? JSON.stringify(tags) : null,
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
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { id, tapNumber, name, brewery, abv, style, price, logo, status, tags } = body

    const beer = await prisma.beer.update({
      where: { id: parseInt(id) },
      data: {
        tapNumber: parseInt(tapNumber),
        name,
        brewery,
        abv,
        style,
        price,
        logo: logo || null,
        status,
        tags: tags ? JSON.stringify(tags) : null,
        endDate: status === 'keg_empty' ? new Date() : null,
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
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

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