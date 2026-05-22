import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    const body = await req.json()
    const { dataUrl, sessionId, themeId } = body

    if (!dataUrl || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log(`Uploading session ${sessionId} for user ${session.user.id}...`)

    // Upload base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
      folder: `snapbooth/${session.user.id}`,
      public_id: sessionId,
      tags: [themeId || 'default', session.user.id],
      resource_type: 'auto',
    })

    const imageUrl = uploadResponse.secure_url
    console.log(`Uploaded successfully. Image URL: ${imageUrl}`)

    // Save metadata to database with user association
    const dbSession = await prisma.session.create({
      data: {
        id: sessionId,
        imageUrl: imageUrl,
        themeId: themeId || 'midnight',
        userId: session.user.id,
      },
    })

    const origin = req.headers.get('origin') ?? 'http://localhost:3000'
    const shareUrl = `${origin}/result/${sessionId}`

    return NextResponse.json({
      success: true,
      sessionId: dbSession.id,
      shareUrl,
      imageUrl,
      themeId: dbSession.themeId,
      uploadedAt: dbSession.createdAt.toISOString(),
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
