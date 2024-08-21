import {create} from 'zustand';

interface myPlant {
  nombre_comun: string;
  img_url: string;
  id: string;
  riego: string;
  fertilizacion: string;
}

export interface MyPlantState {
  misPlantas: Array<myPlant>;
  addPlant: (
    nombre_comun: string,
    img_url: string,
    id: string,
    riego: string,
    fertilizacion: string,
  ) => void;
  deletePlant: (id: string) => void;
}

export const usePlantStore = create<MyPlantState>()((set, get) => ({
  misPlantas: [],
  addPlant: (
    nombre_comun: string,
    img_url: string,
    id: string,
    riego: string,
    fertilizacion: string,
  ) => {
    const {misPlantas} = get();

    // Comprobar si la planta ya está añadida (basado en el campo id)
    const plantExists = misPlantas.some(plant => plant.id === id);

    if (!plantExists) {
      // Añadir la planta si no existe ya en la lista
      set(state => ({
        misPlantas: [
          ...state.misPlantas,
          {nombre_comun, img_url, id, riego, fertilizacion},
        ],
      }));
    } else {
      console.log(`La planta con id ${id} ya está añadida.`);
    }
  },
  deletePlant: (id: string) => {
    set(state => ({
      misPlantas: state.misPlantas.filter(plant => plant.id !== id),
    }));
  },
}));
