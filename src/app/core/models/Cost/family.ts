export class Subcategory {
    id?: number;
    codigo: string;
    nombre: string;
}

export class Family {
    id?: number;
    codigo: string;
    nombre: string;
    subcategories?: Subcategory[];
}
