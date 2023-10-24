import prismadb from '@/lib/prismadb';
import BillboardClient from './client';

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

export default async function BillboardsPage({ params }: BillboardsPageProps) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex-col  ">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BillboardClient data={billboards} />
      </div>
    </div>
  );
}
