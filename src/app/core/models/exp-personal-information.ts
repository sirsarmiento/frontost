import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SelectOption } from './select-option';

export class ExpPersonalInformation {
    id: number;
    documentNumber: string;
    birthDate: NgbDate;
    familyBusiness: SelectOption;
    entryAuthorization: SelectOption;
    userName: string;
    firstName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    sex: string;
    age: number;
    admissionDate: any;
    //admissionDate: NgbDate;
    elapsedtime: number;
    reporttype: number;
    reportsSelect: any[];
    reportsSelectEcel: SelectOption;
    reportsSelectEcelCarg: SelectOption;
    selectedItemUserLoad: SelectOption;
    date_From: any;
    date_Until: any;

    public static map(exppersonalinformation: ExpPersonalInformation): ExpPersonalInformation {
        const newInstace = new ExpPersonalInformation();
        newInstace.id = exppersonalinformation.id;
        newInstace.documentNumber = exppersonalinformation.documentNumber;
        newInstace.birthDate = exppersonalinformation.birthDate;
        newInstace.familyBusiness = exppersonalinformation.familyBusiness;
        newInstace.entryAuthorization = exppersonalinformation.entryAuthorization;
        newInstace.userName = exppersonalinformation.userName;
        newInstace.secondName = exppersonalinformation.secondName;
        newInstace.lastName = exppersonalinformation.lastName;
        newInstace.secondLastName = exppersonalinformation.secondLastName;
        newInstace.sex = exppersonalinformation.sex;
        newInstace.admissionDate = exppersonalinformation.admissionDate;
        return newInstace
    }
     //Variable Mapping Method
     public static mapForPost(exppersonalinformation: ExpPersonalInformation) {
        let exppersonalinformationMap: any = {};
        if (exppersonalinformation.id) {
            Object.assign(exppersonalinformationMap, { id: exppersonalinformation.id })
        }
        Object.assign(exppersonalinformationMap, { cedula: exppersonalinformation.documentNumber });
        Object.assign(exppersonalinformationMap, { fecha_ingreso: `${exppersonalinformation.admissionDate.year}-${exppersonalinformation.admissionDate.month}-${exppersonalinformation.admissionDate.day}` });
        Object.assign(exppersonalinformationMap, { autorizacion_ingreso: `${exppersonalinformation.entryAuthorization.value}` });
        Object.assign(exppersonalinformationMap, { familiar_empresa: `${exppersonalinformation.familyBusiness.value}` });
        return exppersonalinformationMap;
    }

    //Object Map Method
    public static mapFromObject(exppersonalinformationObj: any) {
        if (!exppersonalinformationObj)
            return;
        let exppersonalinformation = new ExpPersonalInformation ();
        exppersonalinformation.id = exppersonalinformationObj.id;
        exppersonalinformation.documentNumber = exppersonalinformationObj.numeroDocumento;
        exppersonalinformation.birthDate = exppersonalinformationObj.birthDate;
        exppersonalinformation.familyBusiness = exppersonalinformationObj.familyBusiness;
        if (exppersonalinformationObj.autorizacion_ingreso.id)
        exppersonalinformation.entryAuthorization = new SelectOption(exppersonalinformationObj.autorizacion_ingreso.id, exppersonalinformationObj.autorizacion_ingreso.nombre);
        if (exppersonalinformationObj.familyBusiness.id)
        exppersonalinformation.familyBusiness = new SelectOption(exppersonalinformationObj.familyBusiness.id, exppersonalinformationObj.familyBusiness.nombre);
        exppersonalinformation.userName = exppersonalinformationObj.userName;
        exppersonalinformation.lastName = exppersonalinformationObj.primerNombre;
        exppersonalinformation.firstName = exppersonalinformationObj.segundoNombre;
        exppersonalinformation.secondName = exppersonalinformationObj.primerApellido;
        exppersonalinformation.secondLastName = exppersonalinformationObj.segundoApellido;
        exppersonalinformation.sex = exppersonalinformationObj.sex;
        if (!exppersonalinformation.admissionDate)
           exppersonalinformation.admissionDate = exppersonalinformationObj.admissionDate;
           let arr = exppersonalinformationObj.admissionDate.split('-');
           exppersonalinformation.admissionDate = {year: parseInt(arr[0]), month: parseInt(arr[1]), day: parseInt(arr[2])};
        return exppersonalinformation;
    }

     //Variable Mapping Method
     public static mapForPostRepots(exppersonalinformation: ExpPersonalInformation) {
        let exppersonalinformationMap: any = {};
        if (exppersonalinformation.reporttype) {
            Object.assign(exppersonalinformationMap, { tiporeporte: exppersonalinformation.reporttype})
        }
        Object.assign(exppersonalinformationMap, { id_datos_personales: exppersonalinformation.id})
        Object.assign(exppersonalinformationMap, { reportes: this.getReportsSelect(exppersonalinformation.reportsSelect) });
        return exppersonalinformationMap;
    }
    
    private static getReportsSelect(reportsSelect: any[]) {
        let reports;
        reports = reportsSelect.map((item: any) => {
            return { reporte: item.value };
        });
        return reports;
   }   

   public static mapFromObjectUserLoad(professionObj: any) {
    if (!professionObj)
        return;
    return new SelectOption(professionObj.id, professionObj.userload);
}



}