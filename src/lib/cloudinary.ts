import { v2 as cloudinary } from 'cloudinary';

export async function deleteImageCloudinary(publicId: string) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await cloudinary.uploader.destroy(publicId as string);
  } catch (error) {
    console.error(error);
    console.log('[CLOUDINARY-ERROR]', error);
  }
}
