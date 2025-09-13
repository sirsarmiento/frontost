import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import Swal from 'sweetalert2';

export interface DialogData { param: any }

@Component({
  selector: 'app-modal-weights',
  templateUrl: './modal-weights.component.html'
})
export class ModalWeightsComponent implements OnInit {
  title: string = '';
  submitted = false;
  loading = false;
  form: FormGroup;
  constructor(
     public dialogRef: MatDialogRef<ModalWeightsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
  ) {
    this.myFormValues();
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.title = this.data.param[0].name;
  }


  closeModal() {
    this.dialogRef.close();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      design: [this.data.param[0].parama,Validators.required],
      execution: [this.data.param[0].paramb,Validators.required],
    });
  }


  onSubmit() {

    this.submitted = true;

    if (this.form.get('design').value < 0 || this.form.get('execution').value < 0) {
      this.form.get('design').setErrors({ 'min': true });
      this.form.get('execution').setErrors({ 'min': true });
    }else {
      this.form.get('design').setErrors(null);    
      this.form.get('execution').setErrors(null);
    }

    const design = +this.form.get('design')?.value || 0;
    const execution = +this.form.get('execution')?.value || 0;

    const total = design + execution;

    if (total !== 100) {
      Swal.fire('', `La suma debe ser 100 y es ${ total } `, 'info');
      return
    }

    if (this.form.invalid) { return; }

    this.loading = true;


    const params: any = {
      name: this.data.param.name,
      parama:  this.f.design.value,
      paramb:  this.f.execution.value,
      paramc:  '0',
      module:  this.data.param.module
    }

    console.log(params);

    //this.controlService.updateParams(this.data.param[0].id, params);

    this.dialogRef.close({result:this.f});
  }


}
