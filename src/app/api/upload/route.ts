import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dataUrl, sessionId, themeId } = body

    if (!dataUrl || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log(`Uploading session ${sessionId} to Cloudinary...`)

    // Upload base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
      folder: 'snapbooth',
      public_id: sessionId,
      tags: [themeId || 'default'],
    })

    const imageUrl = uploadResponse.secure_url
    console.log(`Uploaded successfully. Image URL: ${imageUrl}`)

    // Save metadata to Supabase via Prisma
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        imageUrl: imageUrl,
        themeId: themeId || 'midnight',
      },
    })

    const origin = req.headers.get('origin') ?? 'http://localhost:3000'
    const shareUrl = `${origin}/result/${sessionId}`

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      shareUrl,
      imageUrl,
      themeId: session.themeId,
      uploadedAt: session.createdAt.toISOString(),
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
