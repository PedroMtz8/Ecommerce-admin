'use client';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';

export default function Home() {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [onOpen, isOpen]);
  return <div className=" bg-slate-500 p-3 h-full "></div>;
}
