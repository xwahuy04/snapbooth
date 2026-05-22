import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Get session from auth
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - please login first' },
        { status: 401 }
      )
    }

    const { imageUrl, sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Verify the session belongs to the user
    const dbSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!dbSession || dbSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - session not found or belongs to another user' },
        { status: 403 }
      )
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000'
    const shareUrl = `${origin}/result/${sessionId}`

    // Generate a short ID for easier sharing
    const shortId = sessionId.slice(-8)

    return NextResponse.json({
      shareUrl,
      shortId,
      qrData: shareUrl,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 })
  }
}
