import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SelectOption } from '../models/select-option';
import { HttpService } from './http.service';
import { firstValueFrom } from 'rxjs';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class CommonsService extends HttpService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  /** 
   * Convert bytes to 
   * */

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }




  /**
   * Get all dependences
   * @returns 
   */
  async getAllDependences(): Promise<Array<SelectOption>> {

    let dependences: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/dependencia/list'))
    dependences = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.descripcion);
    });
    return dependences;

  }


  /**
 * Get all coordinations
 * @returns 
 */
  async getAllCoordination(): Promise<Array<SelectOption>> {

    let dependences: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/coordinacion/list'))
    dependences = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return dependences;

  }


  /**
* Get all dependences
* @returns 
*/
  async getAllManagements(): Promise<Array<SelectOption>> {

    let dependences: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/gerencia/list'))
    dependences = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return dependences;

  }

  /**
   * Get all positions
   * @returns 
   */
  async getAllPositions(): Promise<Array<SelectOption>> {

    let positions: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/cargo/list'))
    positions = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.descripcion);
    });
    return positions;

  }


  /**
* Get all roles of company of logged user
* @returns 
*/
  async getAllRoles(): Promise<Array<SelectOption>> {

    let roles: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/rol/list'))
    const temp = resp[0];
    roles = temp.map((item: any) => {
      return new SelectOption(item.descripcion, item.descripcion);
    });
    return roles;

  }


  /**
  * Get all roles
  * @returns 
  */
  async getAllCountries(): Promise<Array<SelectOption>> {

    let countries: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/pais/List'))
    countries = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return countries;
  }

  /**
* Get all states by id pais
* @returns 
*/
  async getAllStates(id: number): Promise<Array<SelectOption>> {

    let states: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, `/estado/pais/${id}`))
    states = resp.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return states;

  }


  /**
* Get all status
* @returns 
*/
  async getAllStatus(): Promise<Array<SelectOption>> {

    let status: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, `/status/list`))
    status = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.descripcion);
    });

    return status;

  }


  /**
* Get all city by id estados
* @returns 
*/
  async getAllCities(id: number): Promise<Array<SelectOption>> {

    let cities: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, `/ciudad/estado/${id}`))
    cities = resp.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return cities;

  }

  /**
   * Get all social networks
   * @returns 
   */
  async getAllSocialNetwork(): Promise<Array<SelectOption>> {

    let redes: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/tiporedes/List'));
    redes = resp.data.map((item: any) => {
      const socialNetwork = new SelectOption(item.id, item.nombre);
      socialNetwork.icon = item.icono;
      return socialNetwork;
    });
    return redes;
  }

  /**
   * Get all units type
   * @returns 
   */
  async getAllUnitsType(): Promise<Array<SelectOption>> {

    let unitsType: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/encuesta/tipounidad/list'));
    unitsType = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });
    return unitsType;
  }


  /**
* Get all inputs type
* @returns 
*/
  async getAllInputsType(): Promise<Array<SelectOption>> {

    let inputsType: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/encuesta/tipoinpunt/list'));
    inputsType = resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    });

    return inputsType;
  }


  /**
* Get all categories
* @returns 
*/
  async getAllCategories(): Promise<Array<SelectOption>> {

    let categories: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/encuesta/tipocategoria/list'));
    categories = resp.data.map((item: any) => {
      const option = new SelectOption(item.id, item.nombre);
      option.haveScales = item.escalaPonderacion == 1 ? true : false;
      return option;
    });
    return categories;
  }


  /**
* Get all categories
* @returns 
*/
  async getAllColorSticker(): Promise<Array<SelectOption>> {

    let colors: Array<SelectOption> = new Array<SelectOption>();
    colors.push(new SelectOption('bgcolor-orange', 'Naranja', false, 'rgb(253, 126, 20)'));
    colors.push(new SelectOption('bgcolor-pink', 'Rosado', false, 'rgb(241, 0, 117)'));
    colors.push(new SelectOption('bgcolor-emerald', 'Esmeralda', false, 'rgb(0, 204, 204)'));
    colors.push(new SelectOption('bgcolor-green', 'Verde', false, 'rgb(16, 183, 89)'));
    colors.push(new SelectOption('bgcolor-lilac', 'Lila', false, 'rgb(91, 71, 251)'));
    return this.resolveWith(colors);
  }

  /**
   * get all users emails
   */
  async getAllUsersEmails() {
    let usersEmails: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/calendario/event/usuarios'));
    usersEmails = resp.data.map((item: any) => {
      return new SelectOption(item.email, item.nombre + ' | ' + item.email);
    });
    return usersEmails;
  }

  /**
  * Get all instruments
  * @returns 
  */
  async getAllInstruments(): Promise<Array<SelectOption>> {

    let inputsType: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/encuesta/instrumentocaptura/list/all'));
    inputsType = resp.data.map((item: any) => {
      const selectOption = new SelectOption(item.id, item.nombre);
      selectOption.globalsPoints = item.puntosGlobales ? (item.puntosGlobales = 1 ? true : false) : false;
      return selectOption;
    });
    return inputsType;
  }


  /**
 * Retorn list component types
 * @returns 
 */
  async getAllComponentTypes(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/modulo/tipo/componente'));

    return resp.tipoComponentes.map((item: any) => {
      return new SelectOption(item, item);
    })

  }



  /**
 * Return list authorizations
 * @returns 
 */
  async getAllAuthorizations(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/modulo/autorizaciones/all'));

    return resp.autorizaciones.map((item: any) => {
      return new SelectOption(item, item);
    })

  }



  getAllGaleryIcon(): Promise<any> {
    const feather = [
      "activity",
      "airplay",
      "alert-circle",
      "alert-octagon",
      "alert-triangle",
      "align-center",
      "align-justify",
      "align-left",
      "align-right",
      "anchor",
      "aperture",
      "archive",
      "arrow-down-circle",
      "arrow-down-left",
      "arrow-down-right",
      "arrow-down",
      "arrow-left-circle",
      "arrow-left",
      "arrow-right-circle",
      "arrow-right",
      "arrow-up-circle",
      "arrow-up-left",
      "arrow-up-right",
      "arrow-up",
      "at-sign",
      "award",
      "bar-chart-2",
      "bar-chart",
      "battery-charging",
      "battery",
      "bell-off",
      "bell",
      "bluetooth",
      "bold",
      "book-open",
      "book",
      "bookmark",
      "box",
      "briefcase",
      "calendar",
      "camera-off",
      "camera",
      "cast",
      "check-circle",
      "check-square",
      "check",
      "chevron-down",
      "chevron-left",
      "chevron-right",
      "chevron-up",
      "chevrons-down",
      "chevrons-left",
      "chevrons-right",
      "chevrons-up",
      "chrome",
      "clipboard",
      "clock",
      "cloud-drizzle",
      "cloud-lightning",
      "cloud-off",
      "cloud-rain",
      "cloud-snow",
      "cloud",
      "code",
      "codepen",
      "codesandbox",
      "coffee",
      "columns",
      "command",
      "compass",
      "copy",
      "corner-down-left",
      "corner-down-right",
      "corner-left-down",
      "corner-left-up",
      "corner-right-down",
      "corner-right-up",
      "corner-up-left",
      "corner-up-right",
      "cpu",
      "credit-card",
      "crop",
      "crosshair",
      "database",
      "delete",
      "disc",
      "dollar-sign",
      "download-cloud",
      "download",
      "droplet",
      "edit-2",
      "edit-3",
      "edit",
      "external-link",
      "eye-off",
      "eye",
      "facebook",
      "fast-forward",
      "feather",
      "figma",
      "file-minus",
      "file-plus",
      "file-text",
      "file",
      "film",
      "filter",
      "flag",
      "folder-minus",
      "folder-plus",
      "folder",
      "frown",
      "gift",
      "git-branch",
      "git-commit",
      "git-merge",
      "git-pull-request",
      "github",
      "gitlab",
      "globe",
      "grid",
      "hard-drive",
      "hash",
      "headphones",
      "heart",
      "help-circle",
      "hexagon",
      "home",
      "image",
      "inbox",
      "info",
      "instagram",
      "italic",
      "key",
      "layers",
      "layout",
      "life-buoy",
      "link-2",
      "link",
      "linkedin",
      "list",
      "loader",
      "lock",
      "log-in",
      "log-out",
      "mail",
      "map-pin",
      "map",
      "maximize-2",
      "maximize",
      "minus-circle",
      "minus-square",
      "minus",
      "monitor",
      "moon",
      "more-horizontal",
      "more-vertical",
      "mouse-pointer",
      "move",
      "music",
      "navigation-2",
      "navigation",
      "octagon",
      "package",
      "paperclip",
      "pause-circle",
      "pause",
      "pen-tool",
      "percent",
      "phone-call",
      "phone-forwarded",
      "phone-incoming",
      "phone-missed",
      "phone-off",
      "phone-outgoing",
      "phone",
      "pie-chart",
      "play-circle",
      "play",
      "plus-circle",
      "plus-square",
      "plus",
      "pocket",
      "power",
      "printer",
      "radio",
      "refresh-ccw",
      "rotate-cw",
      "rss",
      "save",
      "scissors",
      "search",
      "send",
      "server",
      "settings",
      "share-2",
      "share",
      "shield-off",
      "shield",
      "shopping-bag",
      "shopping-cart",
      "shuffle",
      "sidebar",
      "skip-back",
      "skip-forward",
      "slack",
      "slash",
      "sliders",
      "smartphone",
      "smile",
      "speaker",
      "square",
      "star",
      "stop-circle",
      "sun",
      "sunrise",
      "sunset",
      "table",
      "tablet",
      "tag",
      "target",
      "terminal",
      "thermometer",
      "thumbs-down",
      "thumbs-up",
      "toggle-left",
      "toggle-right",
      "trash-2",
      "trash",
      "trello",
      "trending-down",
      "trending-up",
      "triangle",
      "truck",
      "tv",
      "twitter",
      "type",
      "umbrella",
      "underline",
      "unlock",
      "upload-cloud",
      "upload",
      "user-check",
      "user-plus",
      "user-minus",
      "user-x",
      "user",
      "users",
      "video-off",
      "video",
      "voicemail",
      "volume-1",
      "volume-2",
      "volume-x",
      "volume",
      "watch",
      "wifi-off",
      "wifi",
      "wind",
      "x-circle",
      "x-octagon",
      "x-square",
      "x",
      "youtube",
      "zap-off",
      "zap",
      "zoom-in",
      "zoom-out",
    ];

    const fontgiep = null;
    let galeryIconsFeather = new Array<any>();
    let galeryIconsFontGiep = new Array<any>();
    galeryIconsFeather = feather.map((item) => {
      return new SelectOption('feather icon-' + item, 'feather icon-' + item);
    });

    galeryIconsFontGiep = fontgiep?.map((item) => {
      return new SelectOption(item, item);
    });

    return this.resolveWith({ fontfeather: galeryIconsFeather, fontgiep: galeryIconsFontGiep });

  }



  /**
 * Return list options cascadind
 * @returns 
 */
  async getAllMenuOptions(): Promise<Array<MenuItem>> {

    try {
      const resp = await firstValueFrom(this.get(environment.apiUrl, '/modulo/menu/opciones'));
      const arrayMenu: Array<MenuItem> = new Array<MenuItem>()
      resp[0].opcionesMenu.forEach((item: any) => {
        const menuItem = new MenuItem();
        menuItem.id = item.id;
        menuItem.label = item.nombre;
        menuItem.isTitle = item.isTitle == 'true' ? true : false;
        menuItem.link = item.path;
        menuItem.icon = item.icon;
        menuItem.order = item.orden;
        arrayMenu.push(menuItem);
        if (item.hijos && item.hijos.MenuChild) {
          item.hijos.MenuChild.forEach((itemChild: any) => {
            const menuItemChild = new MenuItem();
            menuItemChild.id = itemChild.id;
            menuItemChild.label = itemChild.menu;
            menuItemChild.isTitle = itemChild.isTitle == 'true' ? true : false;
            menuItemChild.link = itemChild.path;
            menuItemChild.icon = itemChild.icon;
            menuItemChild.order = itemChild.orden;
            if (itemChild.hijos && itemChild.hijos.MenuChild) {
              menuItemChild.subItems = itemChild.hijos.MenuChild.map((itemSubChild: any) => {
                const menuSubItemChild = new MenuItem();
                menuSubItemChild.id = itemSubChild.id;
                menuSubItemChild.label = itemSubChild.menu;
                menuSubItemChild.isTitle = itemSubChild.isTitle == 'true' ? true : false;
                menuSubItemChild.link = itemSubChild.path;
                menuSubItemChild.order = itemSubChild.orden;
                return menuSubItemChild;
              })
            }
            arrayMenu.push(menuItemChild);
          });
        }

      });
      return arrayMenu;

    } catch (error) {

      return null;
    }

  }


  /**
 * Return list authorizations
 * @returns 
 */
  async getAllModules(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/widgets/menu'));

    return resp.map((item: any) => {
      return new SelectOption(item.idModulo, item.nombreModulo + ' - ' + item.tipoComponente);
    })

  }



  /**
 * Return list email accounts type
 * @returns 
 */
  async getAllEmailAccountsType(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/encuesta/tipocuenta/list'));

    return resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    })

  }


  /**
  * Return list charges type
  * @returns 
  */
  async getAllChargesType(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/cargo/all'));

    return resp.data.map((item: any) => {
      return new SelectOption(item.id, item.descripcion);
    })

  }


  /**
* Return list charges type
* @returns 
*/
  async getAllLevelsType(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/nivel/list'));

    return resp.data.map((item: any) => {
      return new SelectOption(item.id, item.nombre);
    })

  }


  /**
* Return list charges type
* @returns 
*/
  async getAllAccreditationType(): Promise<Array<SelectOption>> {

    const resp = await firstValueFrom(this.get(environment.apiUrl, '/acreditacion/tipoitem/list'));

    return resp.data.map((item: any) => {
      return new SelectOption(item.id, item.descripcion);
    })

  }


  /**
   * Check all department
   * @param filter 
   * @returns 
   */
  async getDepartments(): Promise<any> {
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/staexped/departamento/List'));
    return resp.data.map((item: any) => {
      return new SelectOption(item.id, item.departamento);
    });
  }


  /**
  * Get all roles
  * @returns 
  */
  async getAllRolesList(): Promise<Array<SelectOption>> {

    let roles: Array<SelectOption> = new Array<SelectOption>();
    const resp = await firstValueFrom(this.get(environment.apiUrl, '/rol/roleslist'))
    const temp = resp[0];
    roles = temp.map((item: any) => {
      return new SelectOption(item.descripcion, `${item.descripcion} ( ${item.empresa} )`);
    });
    return roles;

  }   

  /**
   * Total entity rows por empresa
   * example Risks 11 Control 9 Processes 4 Plans 8
   * @returns 
   */
  getResumen() {
    return this.get(environment.apiUrl, '/empresa/resumen');
  }
}
