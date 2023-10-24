'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useParams, useRouter } from 'next/navigation';
import { Billboard } from '@prisma/client';

interface BillboardClientProps {
  data: Billboard[];
}

export default function BillboardClient({ data }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  );
}
