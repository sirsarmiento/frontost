import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Fixe } from 'src/app/core/models/Cost/fixe';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';

@Component({
  selector: 'app-fixe',
  templateUrl: './fixe.component.html'
})
export class FixeComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['tipo', 'concepto', 'precio', 'clasificacion', 'producto', 'actions'];
  dataSource: MatTableDataSource<Fixe>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private fixeService: FixeService,
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.fixeService.getAll().subscribe(( resp => {
         //console.log('RESP.DATA:', resp.data);
         this.initTable(resp.data);
      }
    ));
  }

  initTable(project: Fixe[]){
    this.dataSource = new MatTableDataSource(project);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    this.loading = false;
    this.paginator._intl.itemsPerPageLabel = 'Filas';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(row: Fixe){
    this.router.navigate(['/fixes/add-fixe']);
    this.fixeService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/fixes/add-fixe']);
  }
}
