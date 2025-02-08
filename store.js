import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      backgroundImg: 'grid',
      setBackgroundImg: (img) => set({ backgroundImg: img }),

      lineThickness: 2,
      setLineThickness: (value) => set({ lineThickness: value }),

      color: 'black',
      setColor: (value) => set({ color: value }),

      lineType: 'solid',
      setLineType: (value) => set({ lineType: value }),

      clear: false,
      setClear: (value) => set({clear: value}),
    }),
    {
      name: 'drawing-settings',
      getStorage: () => localStorage, 
    }
  )
);

export default useStore;
