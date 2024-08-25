export interface Planta {
  descripcion: string; // Descripción del bulbo florífero
  enfermedades: Enfermedad[]; // Array de enfermedades
  etiquetas: Etiquetas; // Mapa de etiquetas
  fertilizacion: string;
  id: string; // ID de la planta
  id_modelo: number; // ID del modelo
  img_url: string; // URL de la imagen
  luz: Luz; // Mapa de características de la luz
  nom_comun: string; // Nombre común de la planta
  nombre_cientifico: string; // Nombre científico de la planta
  nombre_comun: string; // Nombre común
  precio: number; // Precio de la planta
  riego: Riego; // Mapa de características de riego
  stock: number; // Cantidad en stock
  temperatura: Temperatura; // Mapa de temperatura
  tierra: string; // Tipo de tierra
  rating?: Rating;
  type?: string;
}

interface Enfermedad {
  cuidados: string; // Cuidados recomendados para la enfermedad
  descripcion: string; // Descripción de la enfermedad
  nombre: string; // Nombre de la enfermedad
}

interface Etiquetas {
  cuidado: string; // Nivel de cuidado (ej. "Medio")
  localizacion: string; // Localización preferida (ej. "Exterior")
  luz: string; // Luz necesaria (ej. "Pleno sol")
  riego: string; // Tipo de riego (ej. "Riego moderado")
  toxicidad: string; // Toxicidad (ej. "Tóxica")
}

interface Luz {
  adecuada: string; // Tipo de luz adecuada (ej. "Sol parcial")
  preferida: string; // Tipo de luz preferida (ej. "Pleno sol")
}

interface Riego {
  caracteristicas: string; // Características de riego (ej. "Evitar el estancamiento del agua.")
  invierno: string; // Frecuencia de riego en invierno (ej. "21 días")
  verano: string; // Frecuencia de riego en verano (ej. "7 - 14 días")
}

interface Temperatura {
  ideal: string; // Rango de temperatura ideal (ej. "12 - 18 ºC")
  zona_rustica: string; // Zonas de rusticidad (ej. "4 - 10")
}

export interface Producto {
  descripcion: string;
  id: string;
  img_url: string;
  nombre_comun: string;
  precio: number;
  stock: number;
  rating?: Rating;
  type?: string;
}

interface Rating {
  nota: string;
  total: string;
}
