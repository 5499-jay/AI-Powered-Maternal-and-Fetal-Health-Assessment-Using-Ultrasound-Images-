import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    let token = authHeader ? authHeader.replace('Bearer ', '') : null

    if (!token) {
      token = req.cookies.get('natalis_token')?.value || null
    }

    if (!token) {
      return NextResponse.json({ error: 'No authorization token found.' }, { status: 401 })
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: payload,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Authentication check failed.' }, { status: 500 })
  }
}
