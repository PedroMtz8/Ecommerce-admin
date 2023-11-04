// import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { deleteImageCloudinary } from '@/lib/cloudinary';

export async function DELETE(req: NextRequest) {
  try {
    const publicId = req.nextUrl.searchParams.get('publicId');
    if (!publicId) return NextResponse.json({ message: 'Public ID required' }, { status: 404 });
    await deleteImageCloudinary(publicId);

    return NextResponse.json({ message: 'Image removed' }, { status: 200 });
  } catch (error) {
    console.log('[REMOVE-IMAGE]', error);
    return NextResponse.json({ message: 'Error removing image', error }, { status: 500 });
  }
}
