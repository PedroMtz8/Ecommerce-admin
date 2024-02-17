import prismadb from '@/lib/prismadb';
import CategoryClient from './components/client';
import { format } from 'date-fns';

interface CategoriesPageProps {
  params: {
    storeId: string;
  };
}

export const metadata = {
  title: 'Categories | Admin Dashboard',
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedcategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col  ">
      <div className="flex-1 space-y-4">
        <CategoryClient data={formatedcategories} />
      </div>
    </div>
  );
}
