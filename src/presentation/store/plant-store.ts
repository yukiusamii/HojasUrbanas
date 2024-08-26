import {create} from 'zustand';
import firestore from '@react-native-firebase/firestore';
import {useProfileStore} from './profile-store';
import {ToastAndroid} from 'react-native';

interface myPlant {
  nombre_comun: string;
  img_url: string;
  id: string;
  riego: string;
  fertilizacion: string;
}

export interface MyPlantState {
  misPlantas: Array<myPlant>;
  setMisPlantas: (misPlantas: Array<any>) => void;
  addPlant: (
    nombre_comun: string,
    img_url: string,
    id: string,
    riego: string,
    fertilizacion: string,
  ) => void;
  deletePlant: (id: string) => void;
}

const savePlantsToFirebase = async (
  uid: string,
  misPlantas: Array<myPlant>,
) => {
  try {
    await firestore().collection('usuarios').doc(uid).set(
      {
        misPlantas: misPlantas,
      },
      {merge: true},
    );
  } catch (error) {
    console.error('Error al guardar misPlantas en Firebase:', error);
  }
};

export const usePlantStore = create<MyPlantState>()((set, get) => ({
  misPlantas: [],

  addPlant: (
    nombre_comun: string,
    img_url: string,
    id: string,
    riego: string,
    fertilizacion: string,
  ) => {
    const uid = useProfileStore.getState().uid; // Usamos getState() para obtener el UID sin hooks
    const {misPlantas} = get();

    // Comprobar si la planta ya está añadida (basado en el campo id)
    const plantExists = misPlantas.some(plant => plant.id === id);

    if (!plantExists) {
      const updatedPlantas = [
        ...misPlantas,
        {nombre_comun, img_url, id, riego, fertilizacion},
      ];

      set({misPlantas: updatedPlantas});

      // Guardar misPlantas en Firebase
      savePlantsToFirebase(uid || '', updatedPlantas);
      ToastAndroid.show('Planta añadida.', ToastAndroid.SHORT);
    } else {
      console.log(`La planta con id ${id} ya está añadida.`);
    }
  },

  deletePlant: (id: string) => {
    const uid = useProfileStore.getState().uid; // Usamos getState() para obtener el UID sin hooks
    set(state => {
      const updatedPlantas = state.misPlantas.filter(plant => plant.id !== id);
      savePlantsToFirebase(uid || '', updatedPlantas);
      ToastAndroid.show('Planta eliminada.', ToastAndroid.SHORT);
      return {misPlantas: updatedPlantas};
    });
  },

  setMisPlantas: (misPlantas: Array<any>) => {
    set({misPlantas});
  },
}));
