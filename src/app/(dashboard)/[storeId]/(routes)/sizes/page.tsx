import prismadb from '@/lib/prismadb';
import SizeClient from './components/client';
import { format } from 'date-fns';

interface SIzesPageProps {
  params: {
    storeId: string;
  };
}

export default async function SIzesPage({ params }: SIzesPageProps) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedSIzes = sizes.map((size) => ({
    name: size.name,
    id: size.id,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col  ">
      <div className="flex-1 space-y-4 ">
        <SizeClient data={formatedSIzes} />
      </div>
    </div>
  );
}
