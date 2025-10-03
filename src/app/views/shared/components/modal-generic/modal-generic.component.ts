import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Budget } from 'src/app/core/models/Cost/budge';

export interface DialogData { item: Budget }

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html'
})
export class ModalGenericComponent implements OnInit {

  title: string = '';

  constructor(
     public dialogRef: MatDialogRef<ModalGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    console.log(this.data.item);
    this.title = 'Esperando por las formulas';
  }

  closeModal() {
    this.dialogRef.close();
  }


}
