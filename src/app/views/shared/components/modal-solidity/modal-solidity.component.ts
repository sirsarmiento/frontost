import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 

export interface DialogData { param: any }

@Component({
  selector: 'app-modal-solidity',
  templateUrl: './modal-solidity.component.html'
})
export class ModalSolidityComponent implements OnInit {
  title: string = '';
  submitted = false;
  loading = false;
  form: FormGroup;
  color: string = '#000000'; // Default color

  constructor(
    //private controlService: ControlService,
     public dialogRef: MatDialogRef<ModalSolidityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
  ) {
    this.myFormValues();
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.title = this.data.param.name;
    this.color = this.data.param.paramc || '#000000'; // Set initial color from data
  }

  onColorChange(newColor: string): void {
    this.color = newColor;
    this.form.get('color')?.setValue(newColor);
  }



  closeModal() {
    this.dialogRef.close();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      from: [this.data.param.parama,Validators.required],
      until: [this.data.param.paramb,Validators.required],
      color: [this.data.param.paramc,Validators.required],
    });
  }


  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const params: any = {
      name: this.data.param.name,
      parama:  this.f.from.value,
      paramb:  this.f.until.value,
      paramc:  this.f.color.value,
      module:  this.data.param.module
    }

    console.log(params);

    //this.controlService.updateParams(this.data.param.id, params);

    this.dialogRef.close({result:this.f});
  }


}
