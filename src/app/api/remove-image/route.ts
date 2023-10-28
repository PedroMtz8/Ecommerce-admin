// import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(req: NextRequest) {
  try {
    const publicId = req.nextUrl.searchParams.get('publicId');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await cloudinary.uploader.destroy(publicId as string);

    // const response = await axios.delete(
    //   `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy/${publicId}`
    // );
    return NextResponse.json({ message: 'Image removed' }, { status: 200 });
  } catch (error) {
    console.log('[REMOVE-IMAGE]', error);
    return NextResponse.json({ message: 'Error removing image', error }, { status: 500 });
  }
}
