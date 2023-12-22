import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { sizeId: string } }) {
  try {
    if (!params.sizeId) return new NextResponse('Size ID required', { status: 404 });

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json({ message: 'Size data', size }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

interface Params {
  params: {
    storeId: string;
    sizeId: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    const body = await req.json();

    const { name, value } = body;
    if (!name || !value)
      return new NextResponse('At least one field required. Label or image url', { status: 404 });

    if (!params.sizeId) return new NextResponse('Size ID required', { status: 404 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 404 });

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
        // userId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json({ message: 'Size changed', size }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/* DELETE REQUEST */

export async function DELETE(_req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!params.sizeId) return new NextResponse('Size ID required', { status: 404 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 404 });

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json({ message: 'Size deleted', size }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
