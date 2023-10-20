'use client';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect, useState } from 'react';

export default function Home() {
  const { onOpen, isOpen } = useStoreModal();
  const [firstMount, setFirstMount] = useState(false);
  useEffect(() => {
    if (!isOpen && !firstMount) {
      setFirstMount(true);
      onOpen();
    }
  }, [onOpen, isOpen, firstMount]);
  return <div className="p-3 h-full "></div>;
}
