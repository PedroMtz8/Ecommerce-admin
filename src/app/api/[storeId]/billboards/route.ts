import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { utcToZonedTime } from 'date-fns-tz';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

    const { label, imageUrl } = body;

    if (!label) return NextResponse.json({ message: 'Label is required' }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ message: 'Image url is required' }, { status: 400 });

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

    const store = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        // userId,
        storeId: params.storeId,
        createdAt: nowMexico,
        updatedAt: nowMexico,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
