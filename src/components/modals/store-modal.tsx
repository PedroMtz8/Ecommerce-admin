'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Need at least one character'),
});

export function StoreModal() {
  const storeModal = useStoreModal();
  const [open, setOpen] = useState(storeModal.isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpen(storeModal.isOpen);
  }, [storeModal.isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/stores', values);
      router.push('/' + response.data.id);
      storeModal.onClose();
      setOpen(false);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create tore"
      description="Add new store to manage products and categories"
      isOpen={open}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder="E-Commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  Continue {isLoading && <Loader2 className="ml-2 animate-spin duration-1000" />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
