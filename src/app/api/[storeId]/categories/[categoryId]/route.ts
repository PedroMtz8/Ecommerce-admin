import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { categoryId: string } }) {
  try {
    if (!params.categoryId) return new NextResponse('Category ID required', { status: 404 });

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json({ message: 'Category deleted', category }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

interface Params {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    const body = await req.json();

    const { name, billboardId } = body;
    if (!name || !billboardId)
      return new NextResponse('At least one field required. Label or image url', { status: 404 });

    if (!params.categoryId) return new NextResponse('Category ID required', { status: 404 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 404 });

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
        // userId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json({ message: 'Category changed', category }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/* DELETE REQUEST */

export async function DELETE(_req: Request, { params }: { params: { storeId: string; categoryId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!params.categoryId) return new NextResponse('Category ID required', { status: 404 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 404 });

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json({ message: 'Category deleted', category }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
