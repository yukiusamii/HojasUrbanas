import {create} from 'zustand';

export interface AllState {
  plantas: Array<any>;
  productos: Array<any>;
  setPlantas: (plantas: Array<any>) => void;
  setProductos: (productos: Array<any>) => void;
}

export const useAllStore = create<AllState>()((set, get) => ({
  plantas: [],
  productos: [],
  setPlantas: (plantas: Array<any>) => {
    set({plantas});
  },
  setProductos: (productos: Array<any>) => {
    set({productos});
  },
}));
