'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Store } from '@prisma/client';
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
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, 'At least one character'),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const storeModal = useStoreModal();

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: SettingsFormValues) => {
    console.log(data);
    try {
      setLoading(true);
      await axios.patch('/api/stores/' + params.storeId, data);
      router.refresh();
      toast.success('Store updated successfully.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/stores/' + params.storeId);
      storeModal.onClose();
      router.refresh();
      toast.success('Store deleted.');
    } catch (error: any) {
      toast.error('Make sure you delete all products and categories first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const origin = useOrigin();

  return (
    <>
      <AlertModal loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <Trash className="" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ">
          <div className="grid grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} placeholder="Store name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes {loading && <Loader2 className="ml-2 animate-spin duration-1000" />}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
}
