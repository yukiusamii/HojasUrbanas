export interface Planta {
  descripcion: string;
  enfermedades: Enfermedad[];
  etiquetas: Etiquetas;
  fertilizacion: string;
  id: string;
  id_modelo: number;
  img_url: string;
  luz: Luz;
  nom_comun: string;
  nombre_cientifico: string;
  nombre_comun: string;
  precio: number;
  riego: Riego;
  stock: number;
  temperatura: Temperatura;
  tierra: string;
  rating?: Rating;
  type?: string;
}

interface Enfermedad {
  cuidados: string;
  descripcion: string;
  nombre: string;
}

interface Etiquetas {
  cuidado: string;
  localizacion: string;
  luz: string;
  riego: string;
  toxicidad: string;
}

interface Luz {
  adecuada: string;
  preferida: string;
}

interface Riego {
  caracteristicas: string;
  invierno: string;
  verano: string;
}

interface Temperatura {
  ideal: string;
  zona_rustica: string;
}

export interface Producto {
  descripcion: string;
  id: string;
  img_url: string;
  nombre_comun: string;
  precio: number;
  stock: number;
  rating: Rating;
  type?: string | undefined;
}

interface Rating {
  nota: number;
  total: number;
}
