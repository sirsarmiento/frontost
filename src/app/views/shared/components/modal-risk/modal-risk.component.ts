import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface DialogData { entity: any[], title: string }

@Component({
  selector: 'app-modal-risk',
  templateUrl: './modal-risk.component.html'
})
export class ModalRiskComponent implements OnInit {
  selectedRow: any;
  displayedColumns: string[] = ['name', 'impact', 'frequency'];
  dataSource: MatTableDataSource<any>;
  title: string = '';

  constructor(
     public dialogRef: MatDialogRef<ModalRiskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initTable(this.data);
    this.title = this.data.title;
  }

  initTable(data: any){
    this.dataSource = new MatTableDataSource(data.entity);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
