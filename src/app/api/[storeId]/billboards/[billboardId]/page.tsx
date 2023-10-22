import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { billboardId: string; storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    const body = await req.json();

    const { label, imageUrl } = body;
    if (!label || !imageUrl)
      return new NextResponse('At least one field required. Label or image url', { status: 404 });

    if (!params.billboardId) return new NextResponse('Billboard ID required', { status: 404 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 404 });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
        // userId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json({ message: 'Billboard changed', billboard }, { status: 200 });
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
