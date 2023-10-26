'use client';

import { BillboardColumn } from './columns';

interface CellActionProps {
  data: BillboardColumn;
}

export function CellAction({ data }: CellActionProps) {
  console.log(data);
  return <div>Action</div>;
}
