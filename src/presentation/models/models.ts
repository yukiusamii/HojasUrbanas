export interface Planta {
  id: string;
  nombre_comun: string;
  descripcion: string;
  img_url: string;
  precio: number;
  rating: {
    nota: number;
    total: number;
  };
}
