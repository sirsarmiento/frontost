import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface DialogData { responsible: any[] }

@Component({
  selector: 'app-modal-responsible',
  templateUrl: './modal-responsible.component.html'
})
export class ModalResponsibleComponent implements OnInit {
  selectedRow;
  displayedColumns: string[] = ['fullName','dependence','position'];
  dataSource: MatTableDataSource<any>;

  constructor(
     public dialogRef: MatDialogRef<ModalResponsibleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initTable(this.data.responsible);
  }

  initTable(responsible: any[]){
    this.dataSource = new MatTableDataSource(responsible);
  }

  closeModal() {
    this.dialogRef.close();
  }

}
