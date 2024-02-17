import prismadb from '@/lib/prismadb';
import BillboardClient from './components/client';
import { format } from 'date-fns';

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

  const formatedBillboards = billboards.map((billboard) => ({
    label: billboard.label,
    id: billboard.id,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col  ">
      <div className="flex-1 space-y-4">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  );
}
