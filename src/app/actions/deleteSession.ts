'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deleteSession(sessionId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized - Silakan login terlebih dahulu' }
  }

  const userId = session.user.id

  try {
    // 1. Verify ownership of the photo session
    const dbSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!dbSession || dbSession.userId !== userId) {
      return { error: 'Foto tidak ditemukan atau Anda tidak memiliki akses' }
    }

    // 2. Extract public ID and delete from Cloudinary
    // Public ID format in Cloudinary is: snapbooth/{userId}/{sessionId}
    const publicId = `snapbooth/${userId}/${sessionId}`
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (cloudinaryErr) {
      console.error('Gagal menghapus dari Cloudinary:', cloudinaryErr)
      // We continue to delete from database even if Cloudinary fails
    }

    // 3. Delete from Prisma Database
    await prisma.session.delete({
      where: { id: sessionId },
    })

    // Revalidate paths to refresh the UI
    revalidatePath('/gallery')
    return { success: true }
  } catch (err: any) {
    console.error('Gagal menghapus sesi:', err)
    return { error: err.message || 'Gagal menghapus foto strip' }
  }
}
