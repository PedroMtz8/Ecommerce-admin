import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UrlStore {
  url: string | null;
  setUrl: (url: string) => void;
  unsetUrl: () => void;
}

export const useImgUrl = create<UrlStore>()(
  persist(
    (set) => ({
      url: null,
      setUrl: (newUrl: string) => set({ url: newUrl }),
      unsetUrl: () => set({ url: null }),
    }),
    {
      name: 'imageUrl',
    }
  )
);
