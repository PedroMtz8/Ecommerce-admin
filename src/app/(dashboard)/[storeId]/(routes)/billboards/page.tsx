import BillboardClient from './client';

export default function BillboardsPage() {
  return (
    <div className="flex-col  ">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BillboardClient />
      </div>
    </div>
  );
}
