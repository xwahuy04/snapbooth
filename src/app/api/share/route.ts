import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
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
