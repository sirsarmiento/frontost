import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/core/services/Cost/config.service';
import { Config } from 'src/app/core/models/Cost/config';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['nombre', 'rif', 'tipo','sector', 'empleados','actions'];
  dataSource: MatTableDataSource<Config>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private configService: ConfigService, 
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getConfigs();
  }

  getConfigs(){
    this.configService.getAll().subscribe(( resp => {
        this.initTable(resp.data);
      }
    ));
  }

  initTable(config: Config[]){
    this.dataSource = new MatTableDataSource(config);
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
    this.router.navigate(['/configs/add-config']);
    this.configService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/configs/add-config']);
  }
}
