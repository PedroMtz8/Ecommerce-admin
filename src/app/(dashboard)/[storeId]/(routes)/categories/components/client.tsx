'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useParams, useRouter } from 'next/navigation';
// import { Billboard } from '@prisma/client';
import { CategoryColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface CategoryClientProps {
  data: CategoryColumn[];
}

export default function CategoryClient({ data }: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="name" />
      {/* ApiLis */}
      <Heading title="API" description="API calls for Categories" />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
}
