
export class Budget { //Presupuesto
    id?: number;
    clasificacion: string;
    descripcion: string;
    numero: string;
    fecha: Date;
    piezas?: Parts[];
}

export class Parts{ //Piezas
    id?: number;
    nombre?: string;
    gramos: number;
    metros: number;
    horas: number;
    minutos: number;
}

