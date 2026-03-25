
export class Asset { 
    id?: number;
    nombre: string;
    costoInicial: number;
    valorResidual: number;
    vidaUtil: number;
    fechaCompra: Date;
    tipo: string;        
    depMensual?: number;        
    depAnual?: number;
}