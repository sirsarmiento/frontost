import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface DialogData { entity: any[], title: string }

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html'
})
export class ModalGenericComponent implements OnInit {
  selectedRow: any;
  displayedColumns: string[] = ['name', 'type'];
  dataSource: MatTableDataSource<any>;
  title: string = '';

  constructor(
     public dialogRef: MatDialogRef<ModalGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.initTable(this.data);
    this.title = this.data.title;
  }

  initTable(data: any){
    this.dataSource = new MatTableDataSource(data.entity);
  }

  closeModal() {
    this.dialogRef.close();
  }

  getCategory(type: any): string {
    if (this.data.title === 'Procesos') {
      switch (type) {
        case 1:
          return 'Macroprocesos';
        case 2:
          return 'Procesos';
        case 3:
          return 'Subprocesos';
      }
    }else{
      return type;
    }
  }

}
