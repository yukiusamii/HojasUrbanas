import {create} from 'zustand';

interface productCart {
  cantProd: number;
  id: string;
  nombre_comun: string;
  img_url: string;
  precio: number;
}

export interface CartState {
  productos: Array<productCart>;
  subtotal: number;
  addProduct: (
    id: string,
    cantProd: number,
    nombre_comun: string,
    img_url: string,
    precio: number,
  ) => void;
  modifyCant: (id: string, cantProd: number) => void;
  deleteProduct: (id: string) => void;
}
const getSubtotal = (productos: Array<productCart>) => {
  const total = productos.reduce((total, producto) => {
    return total + producto.precio * producto.cantProd;
  }, 0);

  return total;
};

export const useCartStore = create<CartState>()((set, get) => ({
  productos: [], // Inicializamos productos como un array vacío
  subtotal: 0,

  addProduct: (
    id: string,
    cantProd: number,
    nombre_comun: string,
    img_url: string,
    precio: number,
  ) => {
    set(state => {
      const existingProductIndex = state.productos.findIndex(
        product => product.id === id,
      );

      let updatedProductos = [...state.productos];

      if (existingProductIndex !== -1) {
        // Si el producto ya existe, actualiza la cantidad
        updatedProductos[existingProductIndex].cantProd += cantProd;
      } else {
        // Si el producto no existe, lo agrega
        updatedProductos.push({id, cantProd, nombre_comun, img_url, precio});
      }

      return {
        productos: updatedProductos,
        subtotal: getSubtotal(updatedProductos),
      };
    });
  },

  modifyCant: (id: string, cantProd: number) => {
    set(state => {
      const existingProductIndex = state.productos.findIndex(
        product => product.id === id,
      );

      if (existingProductIndex !== -1) {
        const updatedProductos = [...state.productos];
        updatedProductos[existingProductIndex].cantProd = cantProd;
        return {
          productos: updatedProductos,
          subtotal: getSubtotal(updatedProductos),
        };
      }

      return state; // No hacer nada si el producto no existe
    });
  },

  deleteProduct: (id: string) => {
    set(state => {
      const updatedProductos = state.productos.filter(
        product => product.id !== id,
      );

      return {
        productos: updatedProductos,
        subtotal: getSubtotal(updatedProductos),
      };
    });
  },
}));
