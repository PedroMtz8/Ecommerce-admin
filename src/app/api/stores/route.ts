import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { utcToZonedTime } from 'date-fns-tz';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name } = body;

    if (!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 });

    const now = new Date();

    const nowMexico = utcToZonedTime(now, 'America/Mexico_City');

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
        createdAt: nowMexico,
        updatedAt: nowMexico,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log('[STORES_POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
