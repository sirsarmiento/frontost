export interface AnalisisPrecios {
  costoUnitario: number;          // Viene de materiales + mano obra + indirectos
  margenDeseado: number;          // % de ganancia deseada (ej: 0.30)
  precioVentaSugerido: number;    // Resultado de la fórmula de margen sobre venta
  puntoEquilibrioUnidades: number; // Unidades mínimas a vender
  costosFijosTotales: number;     // Fijos mensuales + Depreciación mensual
  margenContribucion: number;     // Precio Venta - Costo Variable
}