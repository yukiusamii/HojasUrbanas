import {create} from 'zustand';
import firestore from '@react-native-firebase/firestore';
import {useProfileStore} from './profile-store';
import {ToastAndroid} from 'react-native';

interface productCart {
  cantProd: number;
  id: string;
  nombre_comun: string;
  img_url: string;
  precio: number;
  type: string | null;
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
    type: string | undefined,
  ) => void;
  modifyCant: (id: string, cantProd: number) => void;
  deleteProduct: (id: string) => void;
  setProductos: (productos: Array<any>) => void;
}
const getSubtotal = (productos: Array<productCart>) => {
  const total = productos.reduce((total, producto) => {
    return total + producto.precio * producto.cantProd;
  }, 0);

  return total;
};

const saveCartToFirebase = async (
  uid: string,
  productos: Array<productCart>,
) => {
  try {
    await firestore().collection('usuarios').doc(uid).set(
      {
        miCarrito: productos,
      },
      {merge: true},
    );
  } catch (error) {
    console.error('Error al guardar el carrito en Firebase:', error);
  }
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
    type: string | null = null,
  ) => {
    const uid = useProfileStore.getState().uid;
    set(state => {
      const existingProductIndex = state.productos.findIndex(
        product => product.id === id,
      );

      let updatedProductos = [...state.productos];

      if (existingProductIndex !== -1) {
        updatedProductos[existingProductIndex].cantProd += cantProd;
      } else {
        updatedProductos.push({
          id,
          cantProd,
          nombre_comun,
          img_url,
          precio,
          type,
        });
      }

      const newSubtotal = getSubtotal(updatedProductos);

      // Guardar el carrito actualizado en Firebase
      saveCartToFirebase(uid || '', updatedProductos);

      ToastAndroid.show('Producto añadido al carrito', ToastAndroid.SHORT);
      return {
        productos: updatedProductos,
        subtotal: newSubtotal,
      };
    });
  },

  modifyCant: (id: string, cantProd: number) => {
    const uid = useProfileStore.getState().uid; // Usamos getState() para obtener el UID sin hooks
    set(state => {
      const existingProductIndex = state.productos.findIndex(
        product => product.id === id,
      );

      if (existingProductIndex !== -1) {
        const updatedProductos = [...state.productos];
        updatedProductos[existingProductIndex].cantProd = cantProd;

        const newSubtotal = getSubtotal(updatedProductos);

        // Guardar el carrito actualizado en Firebase
        saveCartToFirebase(uid || '', updatedProductos);
        ToastAndroid.show(
          'Cantidad modificada del producto.',
          ToastAndroid.SHORT,
        );
        return {
          productos: updatedProductos,
          subtotal: newSubtotal,
        };
      }

      return state; // No hacer nada si el producto no existe
    });
  },

  deleteProduct: (id: string) => {
    // Usamos getState() para obtener el UID sin hooks
    const uid = useProfileStore.getState().uid;
    set(state => {
      const updatedProductos = state.productos.filter(
        product => product.id !== id,
      );

      const newSubtotal = getSubtotal(updatedProductos);

      // Guardar el carrito actualizado en Firebase
      saveCartToFirebase(uid || '', updatedProductos);
      ToastAndroid.show('Producto eliminado', ToastAndroid.SHORT);
      return {
        productos: updatedProductos,
        subtotal: newSubtotal,
      };
    });
  },

  setProductos: (productos: Array<any>) => {
    set(state => {
      const newSubtotal = getSubtotal(productos);

      return {productos, subtotal: newSubtotal};
    });
  },
}));
