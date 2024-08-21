import {create} from 'zustand';

export interface AllState {
  plantas: Array<any>;
  setPlantas: (plantas: Array<any>) => void;
}

export const useAllStore = create<AllState>()((set, get) => ({
  plantas: [],
  setPlantas: (plantas: Array<any>) => {
    set({plantas});
  },
}));
