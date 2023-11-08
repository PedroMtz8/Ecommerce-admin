import prismadb from '@/lib/prismadb';
import CategoryForm from './components/category-form';

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const billboard = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <CategoryForm initialData={billboard} />
      </div>
    </div>
  );
  // return <div>Existing billboard {billboard?.label} </div>;
}
