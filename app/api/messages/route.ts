import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all active messages
export async function GET() {
  try {
    const messages = await prisma.rotatingMessage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newMessage = await prisma.rotatingMessage.create({
      data: body,
    })
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

// PUT (update) a message
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const updatedMessage = await prisma.rotatingMessage.update({
      where: { id: parseInt(id) },
      data: updateData,
    })
    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }
    await prisma.rotatingMessage.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
} 