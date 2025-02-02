import { create } from 'zustand';

const useStore = create((set) => ({

    backgroundImg: 'grid',
    setBackgroundImg: (img) => set({ backgroundImg: img }),

    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,

}));

export default useStore;