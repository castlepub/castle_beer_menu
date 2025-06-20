import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') || 'display2_message'
    
    let message = await prisma.customMessage.findUnique({
      where: { key }
    })
    
    if (!message) {
      // Create default message if it doesn't exist
      message = await prisma.customMessage.create({
        data: {
          key,
          content: 'Welcome to The Castle - Enjoy our rotating selection of craft beers!'
        }
      })
    }
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error fetching custom message:', error)
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key = 'display2_message', content } = body

    const message = await prisma.customMessage.upsert({
      where: { key },
      update: { content },
      create: { key, content }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error saving custom message:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
} 