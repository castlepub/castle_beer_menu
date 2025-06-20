import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/display-messages?screen=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const screen = searchParams.get('screen')
    
    if (!screen) {
      return NextResponse.json({ error: 'Screen parameter is required' }, { status: 400 })
    }

    const screenNumber = parseInt(screen)
    if (screenNumber !== 1 && screenNumber !== 2) {
      return NextResponse.json({ error: 'Screen must be 1 or 2' }, { status: 400 })
    }

    const message = await prisma.displayMessage.findFirst({
      where: { screen: screenNumber }
    })

    return NextResponse.json(message || { content: '' })
  } catch (error) {
    console.error('Error fetching display message:', error)
    return NextResponse.json({ error: 'Failed to fetch display message' }, { status: 500 })
  }
}

// POST /api/display-messages
export async function POST(request: NextRequest) {
  try {
    const { screen, content } = await request.json()
    
    if (!screen || (screen !== 1 && screen !== 2)) {
      return NextResponse.json({ error: 'Screen must be 1 or 2' }, { status: 400 })
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Upsert: create if doesn't exist, update if it does
    const message = await prisma.displayMessage.upsert({
      where: { screen },
      update: { content },
      create: { screen, content }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error saving display message:', error)
    return NextResponse.json({ error: 'Failed to save display message' }, { status: 500 })
  }
} 