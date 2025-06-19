import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Simple check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'castle123'

    if (username === adminUsername && password === adminPassword) {
      // Set a simple session cookie
      const response = NextResponse.json({ success: true, message: 'Login successful' })
      
      // Set httpOnly cookie for auth
      response.cookies.set('castle-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
      })

      return response
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout by clearing the cookie
  const response = NextResponse.json({ message: 'Logged out successfully' })
  response.cookies.delete('castle-auth')
  return response
} 