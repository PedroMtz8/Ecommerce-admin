import prismadb from '@/lib/prismadb';

export default async function DashboardPage({ params }: { params: { storeId: string } }) {
  const store = await prismadb.store.findUnique({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div>
      <h1>Active Store: {store?.name} </h1>
    </div>
  );
}
