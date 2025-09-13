import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Config } from 'src/app/core/models/Cost/config';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/core/services/Cost/config.service';

@Component({
  selector: 'app-fixe',
  templateUrl: './fixe.component.html'
})
export class FixeComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['iduser', 'name','actions'];
  dataSource: MatTableDataSource<Config>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private configService: ConfigService,
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this.configService.getAll().subscribe(( data => {
    //      this.initTable(data);
    //   }
    // ));
  }

  initTable(project: Config[]){
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

  onEdit(row: Config){
    this.router.navigate(['/fixes/add-fixe']);
    this.configService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/fixes/add-fixe']);
  }
}
