import { SelectOption } from "./select-option";

export class EmailAccount {

    id: string;
    accountName: string;
    type: SelectOption;
    email:string;
    password:string;
    status: SelectOption;
    quantityUnreadEmails:number;

    public static mapForPost(account: EmailAccount) {
        let accountMap: any = {};
        if(account.id){
            Object.assign(accountMap, { id: account.id });
        }

        Object.assign(accountMap, { nombre: account.accountName });
        Object.assign(accountMap, { email: account.email });
        Object.assign(accountMap, { password: account.password });
        Object.assign(accountMap, { tipoCuenta: parseInt(account.type.value) });
        Object.assign(accountMap, { status: parseInt(account.status.value) });


        return accountMap;
    }

}
