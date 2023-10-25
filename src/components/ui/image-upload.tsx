'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export default function ImageUpload({ disabled, onChange, onRemove, value }: ImageUploadProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!mounted) return null;

  return (
    <>
      <div className="mb-4 flex items-center gap-4 ">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden ">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill src={url} className="object-cover" alt="image" />
          </div>
        ))}
        <CldUploadWidget onUpload={onUpload} uploadPreset="qp8ium8i">
          {({ open }) => {
            const onClick = () => {
              open();
            };
            return (
              <Button type="button" onClick={onClick} disabled={disabled} variant="secondary">
                <ImagePlus className="mr-2 w-4 h-4 " />
                Upload an image
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </>
  );
}
