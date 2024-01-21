/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Size } from '@prisma/client';
import { Trash, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { useStoreModal } from '@/hooks/use-store-modal';

const formSchema = z.object({
  name: z.string().min(1, 'At least one character'),
  value: z.string().min(1, 'At least one character'),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

export default function SizeForm({ initialData }: SizeFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const storeModal = useStoreModal();

  const params = useParams();
  const router = useRouter();

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Edit size' : 'Add a new size';
  const toastMessage = initialData ? 'Size updated' : 'Size created';
  const action = initialData ? 'Save changes' : 'Create';

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      let sizeId = '';
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        const response = await axios.post(`/api/${params.storeId}/sizes`, data);
        form.reset();
        sizeId = response.data.size.id;
        setTimeout(() => {
          router.push(`/${params.storeId}/sizes/${sizeId}`);
        }, 500);
      }
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      storeModal.onClose();
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success('Size deleted.');
    } catch (error: any) {
      toast.error('Make sure you remove all categories using this size first');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} placeholder="Size name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} placeholder="Size value" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action} {loading && <Loader2 className="ml-2 animate-spin duration-1000" />}
          </Button>
        </form>
      </Form>
    </>
  );
}
