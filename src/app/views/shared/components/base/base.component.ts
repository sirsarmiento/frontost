import { Component } from '@angular/core';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {

  /** Datatable options */
  public dtOptions: DataTables.Settings = {
    info: false,
    paging: false,
    searching: false,
    ordering: true,
    autoWidth: true,
    responsive: true,
    language: {
      emptyTable: "No hay datos disponibles"
    }
  };


  /** Gestao mensajes da error */
  private messages = {
    errors: [] as any,
    success: [] as any,
  };

  /** Gestao mensajes da erro da input*/
  private fieldError: string;



  /** Gestao mensajes da erro da input color*/
  private fieldColorError: string;


  /** Gestao mensajes da erro da modal*/
  private labelError: string;

  private labelSuccess: string;


  public messageModal: string;


  /**
   * Limpe a lista de mensagens de erro.
   * @param delay Milissegundos para limpar a lista de erros
   */
  public waitAndCleanErrors(delay = 10000): void {
    setTimeout(() => this.cleanErrors(), delay);
  }

  /**
   * Limpe a lista de mensagens de sucesso.
   * @param delay Milissegundos para limpar a lista de sucesso
   */
  public waitAndCleanSuccess(delay = 10000): void {
    setTimeout(() => this.cleanSuccess(), delay);
  }

  /**
   * Adicione uma mensagem à lista de erros.
   * @param message Mensagem para adicionar à lista de erros
   */
  protected addError(message: string, clean = true): BaseComponent {
    this.messages.errors.push(message);
    if (clean) {
      this.waitAndCleanErrors();
    }
    return this;
  }

  /**
   * Adicione uma mensagem à lista de sucesso.
   * @param message Mensagem para adicionar à lista de sucesso
   */
  protected addSuccess(message: string, clean = true): BaseComponent {
    this.messages.success.push(message);
    if (clean) {
      this.waitAndCleanSuccess();
    }
    return this;
  }

  /**
   * Limpe a mensagem de erro e adicione apenas uma mensagem de erro
   * @param message Mensagem para adicionar à lista de erros
   */
  protected setError(message: string, clean = true): BaseComponent {
    this.cleanErrors();
    this.addError(message);
    if (clean) {
      this.waitAndCleanErrors();
    }
    return this;
  }

  /**
 * Limpe a mensagem de erro e adicione apenas uma mensagem de erro
 * @param message Mensagem para adicionar à lista de erros
 */
  protected setInputError(message: string, clean = true): BaseComponent {
    this.fieldError = message;

    if (clean) {
      setTimeout(() => this.fieldError = '', 5000);
    }
    return this;
  }


    /**
 * Limpe a mensagem de erro e adicione apenas uma mensagem de erro
 * @param message Mensagem para adicionar à lista de erros
 */
    protected setInputColorError(message: string, clean = true): BaseComponent {
      this.fieldColorError = message;
  
      if (clean) {
        setTimeout(() => this.fieldColorError = '', 5000);
      }
      return this;
    }

  /**
* Limpe a mensagem de erro e adicione apenas uma mensagem de erro
* @param message Mensagem para adicionar à lista de erros
*/
  protected setModalError(message: string, clean = true): BaseComponent {
    this.labelError = message;

    if (clean) {
      setTimeout(() => this.labelError = '', 1600);
    }
    return this;
  }

  /**
   * Limpe a mensagem de sucesso e adicione apenas uma mensagem de sucesso
   * @param message Mensagem para adicionar à lista de sucesso
   */
  protected setSuccess(message: string, clean = true): BaseComponent {
    this.cleanErrors();
    this.addSuccess(message);
    if (clean) {
      this.waitAndCleanSuccess();
    }
    return this;
  }

  /**
* Limpe a mensagem de erro e adicione apenas uma mensagem de erro
* @param message Mensagem para adicionar à lista de erros
*/
  protected setModalSuccess(message: string, clean = true): BaseComponent {
    this.labelSuccess = message;

    if (clean) {
      setTimeout(() => this.labelSuccess = '', 1600);
    }
    return this;
  }

  /**
   * Limpe as mensagens de erro
   */
  public cleanErrors(): void {
    this.messages.errors = [];
  }

  /**
   * Limpe as mensagens de sucesso
   */
  protected cleanSuccess(): void {
    this.messages.success = [];
  }

  /**
   * Retorne o erro atual a ser exibido.
   */
  get error(): string {
    return this.messages.errors[0] || '';
  }

  /**
   * Retorne o erro atual a ser exibido
   */
  get success(): string {
    return this.messages.success[0] || '';
  }

  /**
 * Retorne o erro atual a ser exibido
 */
  get inputError(): string {
    return this.fieldError;
  }

    /**
 * Retorne o erro atual a ser exibido
 */
    get inputColorError(): string {
      return this.fieldColorError;
    }

  /**
* Retorne o erro atual a ser exibido.
*/
  get modalError(): string {
    return this.labelError;
  }

  /**
   * Retorne o erro atual a ser exibido.
   */
  get modalSuccess(): string {
    return this.labelSuccess;
  }

  /**
 * Converter de array em string
 * @param value 
 * @returns 
 */
  arrayToString(value: Array<any>, separator: string): string | null {
    if (value.length > 0) {
      return value.join(separator)
    } else {
      return null;
    }
  }

  /**
* criptografia de informação
* @param param 
* @returns 
*/
  encryptParam(param: any): string {
    return btoa(param);
  }


  /**
* Convert BASE64 to File
* @param base64String 
* @param fileName 
* @returns 
*/
  convertBase64ToFile(base64String: string, fileName: string) {
    let arr = base64String.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    console.log('mime', mime)
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: mime });
    return file;
  }



}