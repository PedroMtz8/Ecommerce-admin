import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    const body = await req.json();

    const { name } = body;
    if (!name) return new NextResponse('Name required', { status: 404 });

    if (!storeId) return new NextResponse('Store ID required', { status: 404 });

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ message: 'Store name changed', store }, { status: 200 });
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/* DELETE REQUEST */

export async function DELETE(_req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!storeId) return new NextResponse('Store ID required', { status: 404 });

    const store = await prismadb.store.delete({
      where: {
        id: storeId,
      },
    });

    return NextResponse.json({ message: 'Store deleted', store }, { status: 200 });
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
