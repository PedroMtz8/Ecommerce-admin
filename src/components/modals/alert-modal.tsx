'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function AlertModal({ isOpen, onClose, loading, onConfirm }: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Modal title="Are you sure?" description="This action cannot be undone" isOpen={isOpen} onClose={onClose}>
      <div className="pt-6 space-x-2 flex items-center justify-end ">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading ? <Loader2 className="animate-spin duration-1000" /> : 'Continue'}
        </Button>
      </div>
    </Modal>
  );
}
