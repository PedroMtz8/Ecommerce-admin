import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { utcToZonedTime } from 'date-fns-tz';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    const { name, billboardId } = body;

    if (!name) return NextResponse.json({ message: 'Label is required' }, { status: 400 });
    if (!billboardId) return NextResponse.json({ message: 'Image url is required' }, { status: 400 });

    if (!params.storeId) return NextResponse.json({ message: 'Store id is required' }, { status: 400 });

    const now = new Date();

    const nowMexico = utcToZonedTime(now, 'America/Mexico_City');

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 403 });

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        // userId,
        storeId: params.storeId,
        createdAt: nowMexico,
        updatedAt: nowMexico,
      },
    });
    return NextResponse.json({ category, message: 'Category created!' }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) return NextResponse.json({ message: 'Store id is required' }, { status: 400 });

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ categories, message: 'Category', total: categories.length }, { status: 200 });
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
