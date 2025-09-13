import { Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TemporaryStorageService } from '../../../core/services/temporary-storage.service';

@Directive({
  selector: 'form[autoSaveForm]'
})
export class FormValueChangesDirective{
  @Input() autoSaveForm: string;

  private origin: string = '';
  public valueChangeEvents: EventEmitter<any>;
  constructor(private form: NgForm,
    private temporaryStorageService: TemporaryStorageService
  ) {
    if ( form.valueChanges ) {
      this.valueChangeEvents = new EventEmitter();
			// CAUTION: I don't THINK that I need to worry about unsubscribing from this
			// Observable since they will both exist for the same life-cycles. But, I'm
			// not very good at RxJS, so I am not 100% sure on this.
      console.log('form', form.value)
			form.valueChanges.subscribe((controls:Array<any>)=>{
        if(this.form.touched){
          console.log('form', form.value)
          this.temporaryStorageService.set(`evaluation${this.autoSaveForm}`,controls);
        }
      });

		}
  }
}
