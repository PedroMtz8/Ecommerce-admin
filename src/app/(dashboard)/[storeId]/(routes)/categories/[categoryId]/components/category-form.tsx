/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Category } from '@prisma/client';
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
  billboardId: z.string().min(1, 'At least one character'),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    },
  });

  const storeModal = useStoreModal();

  const params = useParams();
  const router = useRouter();

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Edit category' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated' : 'Category created';
  const action = initialData ? 'Save changes' : 'Create';

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      let categoryId = '';
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categorys/${params.categoryId}`, data);
      } else {
        const response = await axios.post(`/api/${params.storeId}/categorys`, data);
        form.reset();
        categoryId = response.data.category.id;
        setTimeout(() => {
          router.push(`/${params.storeId}/categorys/${categoryId}`);
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
      await axios.delete(`/api/${params.storeId}/categorys/${params.categoryId}`);
      storeModal.onClose();
      router.refresh();
      router.push(`/${params.storeId}/categorys`);
      toast.success('Category deleted.');
    } catch (error: any) {
      toast.error('Make sure you remove all categories using this category first');
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
                    <Input disabled={loading} {...field} placeholder="Category name" />
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
