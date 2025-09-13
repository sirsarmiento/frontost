import { PaginationResponse } from './../models/pagination-response';
import { AuthService } from './auth.service';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User, userObservable } from '../models/user';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { SelectOption } from '../models/select-option';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from '../models/menu.model';
import * as saveAs from 'file-saver';
import { ExpPersonalInformation } from 'src/app/core/models/exp-personal-information';
import { Company } from '../models/company';
import { NgxPermissionsService } from 'ngx-permissions';
import { Responsibles } from '../models/Cost/config';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService {

  private sharingUserObservable: BehaviorSubject<userObservable> = new BehaviorSubject<userObservable>({
    id: 0,
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    sex: '',
    address: '',
    position: new SelectOption('',''),
    country: new SelectOption('',''),
    state: new SelectOption('',''),
    city: new SelectOption('',''),
    roles: '',
    idestructura: 0
  });

  constructor(protected http: HttpClient,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private permissionsService: NgxPermissionsService) {
    super(http);
  }

  get userObservable(){
      return this.sharingUserObservable.asObservable();
  }

  set userObservableData(data: userObservable){
      this.sharingUserObservable.next(data);
  }

  getAll() { // Add by Sir for getting responsibles
      return this.http.get<Responsibles[]>(`${environment.apiUrl}/user`);
  }

  async uploadAvatar(formData: FormData) {
    await firstValueFrom(this.post(environment.apiUrl, '/user/upload/photo', formData));
  }

  /**
   * Get info of user
   */
  async getInfoUser() {
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/user/info/detalle'));
    const user = new User();
    user.id = resp[0].id;
    user.token = this.authService.currentUser.token;
    user.firstName = resp[0].primerNombre;
    user.lastName = resp[0].primerApellido;
    user.secondName = resp[0].segundoNombre;
    user.secondLastName = resp[0].segundoApellido;
    user.email = resp[0].email;
    user.position = new SelectOption(resp[0].cargo.id, resp[0].cargo.Descripcion);
    user.phones = resp[0].telefonos;
    user.birthDate = resp[0].fechaNacimiento;
    user.documentType = resp[0].tipoDocumentoIdentidad;
    user.documentNumber = resp[0].numeroDocumento;
    user.status = new SelectOption(resp[0].status.id, resp[0].status.Descripcion);
    user.avatar = resp[0].foto;
    user.createAt = resp[0].createAt;
    user.updateAt = resp[0].updateAt;
    user.roles = resp[0].roles.map((itemRol: any) => {
      return itemRol.rol;
    })
    this.permissionsService.loadPermissions(user.roles)
    var datauserresorce = '';

    var datauserresorce = '';
    var repotsAct = resp[0].roles.filter((item) => item.rol == 'ROLE_STAEXPED_REPORTS');

    if (repotsAct.length != 0) {
      datauserresorce = 'true';
    } else {
      datauserresorce = 'false';
    }

    const jsonData = JSON.stringify(datauserresorce)
    localStorage.setItem('arrayUsersRepots', jsonData)

    user.instrumentsPending = resp[0].instrumentosPendientes && resp[0].instrumentosPendientes.length > 0 ? resp[0].instrumentosPendientes : null;
    user.sex = resp[0].sexo
    user.address = resp[0].direccion;
    user.country = new SelectOption(resp[0].pais?.id, resp[0].pais.Nombre);
    user.state = new SelectOption(resp[0].estado?.id, resp[0].estado.Nombre);
    user.city = new SelectOption(resp[0].ciudad?.id, resp[0].ciudad.Nombre);

    if (resp[0].redes) {
      user.socialNetwork = resp[0].redes.map((item: any) => {
        return { idTipo: item.idTipo, label: null, networkDir: item.red }
      });
    }

    if (resp[0].empresa) {
      user.company = new Company();
      user.company.id = resp[0].empresa.id;
      user.company.name = resp[0].empresa.Nombre;
      user.company.logo = resp[0].empresa.url_logo;
    }

    this.authService.saveUserInLocalstorage(user);
    return user;

  }

  async getStatusUser() {
    try {
      const resp = await firstValueFrom(this.get(environment.apiUrl, '/user/status/list'));
      if (resp && resp['msg']) {
        return true;
      } else {
        return false
      }
    } catch (error: any) {
      if (error.status == 401) {
        error.status = 200;
        return false;
      }

    }

  }

  /**
   * Check all users, supports pagination and filter
   * @param filter 
   * @returns 
   */
  async getUsersPaginated(filter: any): Promise<PaginationResponse> {
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/all', filter));
    const paginator = new PaginationResponse(filter.page, filter.rowByPage);
    paginator.count = resp.count;
    paginator.data = resp.data.map((item: any) => {
      console.log(item);
      const user = new User();
      user.id = item.id;
      user.username = item.username;
      user.token = this.authService.currentUser.token;
      user.firstName = item.primerNombre;
      user.lastName = item.primerApellido;
      user.secondName = item.segundoNombre;
      user.secondLastName = item.segundoApellido;
      user.email = item.email;
      user.dependence = item.dependencia;
      user.position = new SelectOption(item.cargo.id, item.cargo.Descripcion);
      user.phones = item.telefonos;
      user.birthDate = item.fechaNacimiento;
      user.documentType = item.tipoDocumentoIdentidad;
      user.documentNumber = item.numeroDocumento;
      user.status = new SelectOption(item.status.id, item.status.Descripcion);
      user.createAt = item.createAt;
      user.updateAt = item.updateAt;
      user.sex = item.sexo;
      user.address = item.direccion;
      user.country = new SelectOption(item.pais?.id);
      user.state = new SelectOption(item.estado?.id);
      user.city = new SelectOption(item.ciudad?.id);
      user.avatar = item.foto;
      return user;
    })
    return paginator;
  }


  /**
   * Check all users
   * @param filter 
   * @returns 
   */
  async getUsers(filter: any): Promise<any> {
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/all', filter));
    const data = resp.data.map((item: any) => {
      const user = new User();
      user.id = item.id;
      user.username = item.username;
      user.token = this.authService.currentUser.token;
      user.firstName = item.primerNombre;
      user.lastName = item.primerApellido;
      user.secondName = item.segundoNombre;
      user.secondLastName = item.segundoApellido;
      user.email = item.email;
      user.dependence = item.Dependencia;
      user.position = new SelectOption(item.cargo.id, item.cargo.Descripcion);
      //user.coordination = new SelectOption(item.Coordinacion.id, item.Coordinacion.Nombre);
      //user.managment = new SelectOption(item.Gerencia.id, item.Gerencia.Nombre);
      user.phones = item.telefonos;
      user.birthDate = item.fechaNacimiento;
      user.documentType = item.tipoDocumentoIdentidad;
      user.documentNumber = item.numeroDocumento;
      user.status = new SelectOption(item.status.id, item.status.Descripcion);
      user.createAt = item.createAt;
      user.updateAt = item.updateAt;
      user.sex = item.sexo;
      user.address = item.direccion;
      user.country = new SelectOption(item.pais?.id);
      user.state = new SelectOption(item.estado?.id);
      user.city = new SelectOption(item.ciudad?.id);
      user.roles = item.roles;

      return user;
    });
    return data;
  }

  /**
   * Query user by id
   * @param id 
   * @returns 
   */
  async getUserById(id: number): Promise<User> {
    const resp = await firstValueFrom(this.get(environment.apiUrl, `/user/${id}`));
    const user = new User();
    user.id = resp[0].id;
    user.username = resp[0].username;
    user.firstName = resp[0].primerNombre;
    user.lastName = resp[0].primerApellido;
    user.secondName = resp[0].segundoNombre;
    user.secondLastName = resp[0].segundoApellido;
    user.email = resp[0].email;
    if (resp[0].Dependencia) {
      user.dependence = resp[0].dependencia;
    }
    // if (resp[0].Gerencia) {
    //   user.managment = new SelectOption(resp[0].Gerencia.gerenciaId, resp[0].Gerencia.nombreGerencia);
    // }
    // if (resp[0].Coordinacion) {
    //   user.coordination = new SelectOption(resp[0].Coordinacion.coordinacionId, resp[0].Coordinacion.nombreCoordinacion);
    // }

    user.position = new SelectOption(resp[0].cargo.id, resp[0].cargo.Descripcion);
    //user.phones = resp[0].telefonos;
    if (resp[0].fechaNacimiento) {
      let arr = resp[0].fechaNacimiento.split('-');
      user.birthDate = { year: parseInt(arr[0]), month: parseInt(arr[1]), day: parseInt(arr[2]) };
    } else {
      const d = new Date(resp[0].fechaNacimiento);
      user.birthDate = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    }
    user.documentType = resp[0].tipoDocumentoIdentidad;
    user.documentNumber = resp[0].numeroDocumento;
    user.roles = resp[0].roles.map((item: any) => {
      return item.rol;
    });
    user.status = new SelectOption(resp[0].status.id, resp[0].status.Descripcion);
    user.avatar = resp[0].foto;
    user.createAt = resp[0].createAt;
    user.updateAt = resp[0].updateAt;
    user.sex = resp[0].sexo;
    user.address = resp[0].direccion;
    user.country = new SelectOption(resp[0].pais.id, resp[0].pais.Nombre);
    user.state = new SelectOption(resp[0].estado.id, resp[0].estado.Nombre);
    user.city = new SelectOption(resp[0].ciudad.id, resp[0].ciudad.Nombre);
    return user;
  }

  /**
   * Delete user by id
   * @param id 
   */
  async deleteUser(id: number) {
    const resp = await firstValueFrom(this.delete(environment.apiUrl, `/user/${id}`));
  }

  /**
   * Persists user data
   * @param data 
   */
  async storeUser(data: any) {
    try {
      if (data.id) {
        const id = data.id;
        delete data.id;
        await firstValueFrom(this.put(environment.apiUrl, `/user/${id}`, data));
        this.toastrService.success('Usuario actualizado con exito.');
      } else {

        await firstValueFrom(this.post(environment.apiUrl, '/user', data));
        this.toastrService.success('Usuario registrado con exito.');
      }

       this.router.navigate(['/users']);
    } catch (error: any) {

      console.log(error);
      if (error.status == 409) {
        this.toastrService.error('', error.error.msg);
      }
      if (error.status != 500 && error.status != 409) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }

    }
  }


  async updateProfile(data: any) {
    try {
      await firstValueFrom(this.put(environment.apiUrl, `/user/perfil/${data.id}`, data));
      this.toastrService.success('Usuario actualizado con exito.');
    } catch (error: any) {
      console.log(error);
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }

  }

  async mapFromServerObject(item: any): Promise<User> {
    const user = new User();
    user.id = item.id;
    user.username = item.username;
    user.token = this.authService.currentUser.token;
    user.firstName = item.primerNombre;
    user.lastName = item.primerApellido;
    user.secondName = item.segundoNombre;
    user.secondLastName = item.segundoApellido;
    user.email = item.email;
    user.dependence = item.dependencia;
    user.position = new SelectOption(item.cargo.id, item.cargo.Descripcion);
    //user.coordination = new SelectOption(item.Coordinacion.id, item.Coordinacion.Nombre);
    //user.managment = new SelectOption(item.Gerencia.id, item.Gerencia.Nombre);
    user.phones = item.telefonos;
    user.birthDate = item.fechaNacimiento;
    user.documentType = item.tipoDocumentoIdentidad;
    user.documentNumber = item.numeroDocumento;
    user.status = new SelectOption(item.status.id, item.status.Descripcion);
    user.createAt = item.createAt;
    user.updateAt = item.updateAt;
    user.sex = item.sexo;
    user.address = item.direccion;
    user.country = new SelectOption(item.pais?.id);
    user.state = new SelectOption(item.estado?.id);
    user.city = new SelectOption(item.ciudad?.id);
    return user;

  }


  /**
 * Reset password
 * @param data 
 * @returns 
 */
  async resetPass(data: any): Promise<any> {
    try {
      const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/changepassword/perfil', data));
      this.toastrService.success('', 'Su password fué cambiado con éxito.');
      return true;
    } catch (error: any) {
      console.log(error)
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
      return false;
    }

  }

  /** 
   * Mass user upload from an excel file
   * 
  */
  async uploadUsers(formData: FormData) {
    try {
      const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/upload/user', formData));
      if (resp && resp.UsuariosNoProcesados && resp.UsuariosNoProcesados.length == 0) {
        this.toastrService.success('', `Han sido registrados ${resp.CantidadRegistrosProcesados} usuario(s) con éxito.`)
      } else {
        this.toastrService.warning('', `Han sido registrados ${resp.CantidadRegistrosProcesados} usuario(s) con éxito. Usuarios sin procesar ${resp.UsuariosNoProcesados.length}`);
        const blobTxt = new Blob([this.buildContentTxt(resp)], { type: 'text/plain' });
        saveAs(blobTxt, 'usuarios_no_procesados.txt');
      }
    } catch (error: any) {
      if (error.status == 409)
        this.toastrService.error('', error.error.error);
    }

  }

  /**
   * Build content errors of users
   * @param resp 
   */
  buildContentTxt(resp: any): string {
    let content = 'Aviso: El archivo excel debe cumplir con lo siguiente:\n\n\r';
    content = content + '1) No debe contener filas vacias.\n\r';
    content = content + '2) primernombre, primerapellido, cedula, cargo, correoelectronico y sexo son obligatorios.\n\r';
    content = content + '3) primernombre, primerapellido, cedula, cargo y sexo no debe contener caracteres especiales.\n\r';
    content = content + '4) cedula debe contener solo números.\n\r';
    content = content + '5) cedula no debe estar registrada en el sistema.\n\r';
    content = content + '6) correoelectronico debe contener un correo válido.\n\r';
    content = content + '6) correoelectronico no debe estar registrado en el sistema.\n\r';
    content = content + '7) sexo solo debe indicar dos valores (f o m).\n\n\n\r';
    content = content + 'Usuarios no procesados:\n\n\n\n\r';
    resp.UsuariosNoProcesados.forEach((item: any) => {
      content = content + item.Nombre + '\n\r';
      content = content + item.email + '\n\r';
      content = content + 'Error(s):\n\r';
      let err = '';
      item.errores.forEach((error: any) => {
        err = err + error.message + '\n\r';
      });
      content = content + err + '\n\n\r';
    });
    return content;
  }


  /**
   * Get all Menu options by user
   */
  async getAllMenuOptions(): Promise<Array<any>> {
    try {
      const resp = await firstValueFrom(this.get(environment.apiUrl, '/user/menu/opciones'));
      const arrayMenu: Array<MenuItem> = new Array<MenuItem>();
      resp[0].opcionesMenu.forEach((item: any) => {
        const menuItem = new MenuItem();
        menuItem.label = item.nombre;
        menuItem.isTitle = item.isTitle == 'true' ? true : false;
        menuItem.link = item.path;
        menuItem.icon = item.icon;
        menuItem.order = item.orden;
        arrayMenu.push(menuItem);
        if (item.hijos && item.hijos.MenuChild) {
          item.hijos.MenuChild.forEach((itemChild: any) => {
            const menuItemChild = new MenuItem();
            menuItemChild.label = itemChild.menu;
            menuItemChild.isTitle = itemChild.isTitle == 'true' ? true : false;
            menuItemChild.link = itemChild.path;
            menuItemChild.icon = itemChild.icon;
            menuItemChild.order = itemChild.orden;
            if (itemChild.hijos && itemChild.hijos.MenuChild) {
              menuItemChild.subItems = itemChild.hijos.MenuChild.map((itemSubChild: any) => {
                const menuSubItemChild = new MenuItem();
                menuSubItemChild.label = itemSubChild.menu;
                menuSubItemChild.isTitle = itemSubChild.isTitle == 'true' ? true : false;
                menuSubItemChild.link = itemSubChild.path;
                //menuSubItemChild.icon = itemSubChild.icon;
                menuSubItemChild.order = itemSubChild.orden;
                return menuSubItemChild;
              })
            }
            arrayMenu.push(menuItemChild);
          });
        }

      });
      const user = this.authService.currentUser;
      user.optionsMenu = arrayMenu;
      this.authService.saveUserInLocalstorage(user);
      return arrayMenu;
    } catch (error) {
      return null;
    }
  }

  /**
  * Get all user
  */
  async getAllUsers(): Promise<Array<any>> {
    try {
      const resp = await firstValueFrom(this.get(environment.apiUrl, '/user/info/list'));

      const users: Array<User> = resp.data.map((item: any) => {
        const user = new User();
        user.id = item.id;
        user.firstName = item.primerNombre;
        user.lastName = item.primerApellido;
        user.email = item.email;
        user.dependence = item.dependencia;
        user.position = new SelectOption(item.cargo.id, item.cargo.Descripcion);
        return user;
      });

      return users;
    } catch (error) {
      return null;
    }
  }


  /**
 * Query user by ci
 * @param ci 
 * @returns 
 */
  async getUserByCi(data: any) {
    let events: Array<any> = new Array<any>();
    try {
      const ci = data;
      const resp = await firstValueFrom(this.get(environment.apiUrl, `/user/info/${ci}`, data));
      const expPersonalInformation = ExpPersonalInformation.mapFromObject(resp[0]);
      return expPersonalInformation;

    } catch (error: any) {
      
      console.log(error);
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }

    }

  }



  /**
 * change workspace campany of user
 * @param filter 
 * @returns 
 */
  async setUserCompanyWorkspace(companyId: number): Promise<any> {
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/empresa', { idempresa: companyId }));
    if (resp) {
      this.toastrService.success(`Ha cambiado el workspace exitosamente.`);
      return true;
    } else {
      return false;
    }
  }

  /**
  * valid user before to link to entity
  * @param event 
  */
  async validUsers(users: any) {
    try {
      const resp: any = await firstValueFrom(this.post(environment.apiUrl, `/user/valid/user/byemail`, users));
      if (resp && resp.hasOwnProperty('data')) {
        return resp.data
      }
      return null;

    } catch (error) {
      this.toastrService.error('Ha ocurrido un error validando lista de usuarios.');
    }
  }


/**
 * Change user password
 * @param data 
 * @returns 
 */
  async changePass(data: any): Promise<any> {
    try {
      const resp = await firstValueFrom(this.post(environment.apiUrl, '/user/changePasswordTem', data));
      this.toastrService.success('', 'La contraseña fué cambiada con éxito.');
      return true;
    } catch (error: any) {
      console.log(error)
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
      return false;
    }

  }  

}


