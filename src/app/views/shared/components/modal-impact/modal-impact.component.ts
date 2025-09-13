import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImpactoFrecuencia } from 'src/app/core/models/Cost/impacto-frecuencia';
import { FrecuenceService } from 'src/app/core/services/Cost/frequency.service';
import { ImpactService } from 'src/app/core/services/Cost/impact.service';

export interface DialogData { values: ImpactoFrecuencia, module: string }

@Component({
  selector: 'app-modal-impact',
  templateUrl: './modal-impact.component.html'
})
export class ModalImpactComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  title: string = '';

  constructor(
    private impactService: ImpactService,
    private frecuenceService: FrecuenceService,
     public dialogRef: MatDialogRef<ModalImpactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
  ) {    
    this.myFormValues();
  }

  
  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.title = this.data.module;
  }

  onSubmit(){
    this.submitted = true;
    
    if (this.form.invalid) { return; }
    
    this.loading = true;

    const values: ImpactoFrecuencia = {
      descripcion: this.f.descripcion.value,
      peso: this.f.peso.value,
      porcentaje: this.f.porcentaje.value,
    }

    console.log( this.data.values);

    if(this.data.module == 'Impacto'){
      this.impactService.update(this.data.values.id,values).then(() => {
        this.dialogRef.close({result:this.f, id: this.data.values.id, entity: 'Impacto'});
      });
    }else{
       this.frecuenceService.update(this.data.values.id,values).then(() => {
        this.dialogRef.close({result:this.f, id: this.data.values.id, entity: 'Frecuencia'});
      });;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      descripcion: [this.data.values.descripcion,Validators.required], 
      peso: [this.data.values.peso,Validators.required], 
      porcentaje: [this.data.values.porcentaje,Validators.required],
    })
  }

}
