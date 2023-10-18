'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Store } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formatedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formatedItems.find((item) => item.value === params.storeId);
  const [open, setOpen] = useState(false);
  const onStoreSelect = (store: (typeof formatedItems)[number]) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between ', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4 " />
          {currentStore?.label || 'Current Store'}
          <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        {/* Popover */}
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formatedItems.map((store) => (
                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)}>
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto w-4 h-4 ',
                      currentStore?.value === store.value ? 'opacity-100' : 'opactiy-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
                className="cursor-pointer"
              >
                <PlusCircle className="mr-2 w-5 h-5 " />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
