/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Billboard } from '@prisma/client';
import { Trash, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import ImageUpload from '@/components/ui/image-upload';
import { useImgUrl } from '@/hooks/use-remove-unsaved-url';

const formSchema = z.object({
  label: z.string().min(1, 'At least one character'),
  imageUrl: z.string().min(1, 'At least one character'),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export default function BillboardForm({ initialData }: BillboardFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const { url: imageUrl, setUrl, unsetUrl } = useImgUrl();

  const storeModal = useStoreModal();

  const params = useParams();
  const router = useRouter();

  const title = initialData ? 'Edit billboard' : 'Create billboard';
  const description = initialData ? 'Edit billboard' : 'Add a new billboard';
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created';
  const action = initialData ? 'Save changes' : 'Create';

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      let billboardId = '';
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        unsetUrl();
        const response = await axios.post(`/api/${params.storeId}/billboards`, data);
        form.reset();
        billboardId = response.data.billboard.id;
        setTimeout(() => {
          router.push(`/${params.storeId}/billboards/${billboardId}`);
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
      unsetUrl();
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      storeModal.onClose();
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error: any) {
      toast.error('Make sure you remove all categories using this billboard first');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const removeImageCloud = async (url: string) => {
    try {
      const getPublicId = (imageURL: string) => imageURL.split('/').pop()?.split('.')[0];
      const publicId = getPublicId(url);
      // const cl = new cloudinary.Cloudinary({ cloud_name: cloudName });
      console.log('PUBLICID', publicId);
      if (publicId) {
        form.setValue('imageUrl', '');
        const response = await axios.delete(`/api/remove-image?publicId=${publicId}`);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      async function some() {
        if (imageUrl) {
          await removeImageCloud(imageUrl);
          unsetUrl();
        }
      }
      if (mounted) {
        some();
      }
    };
  }, [mounted]);

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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => {
                      field.onChange(url);
                      setUrl(url);
                    }}
                    onRemove={async () => {
                      // field.onChange('');
                      await removeImageCloud(field.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} placeholder="Billboard label" />
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
