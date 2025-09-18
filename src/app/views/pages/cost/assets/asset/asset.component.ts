import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Asset } from 'src/app/core/models/Cost/asset';
import { AssetService } from 'src/app/core/services/Cost/asset.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html'
})
export class AssetComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['nombre', 'costoInicial', 'valorResidual', 'vidaUtil', 'fechaCompra', 'actions'];
  dataSource: MatTableDataSource<Asset>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private assetService: AssetService,
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets(){
    this.assetService.getAll().subscribe(( resp => {
      console.log(resp.data);
         this.initTable(resp.data);
      }
    ));
  }

  initTable(project: Asset[]){
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

  onEdit(row: Asset){
    this.router.navigate(['/assets/add-asset']);
    this.assetService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/assets/add-asset']);
  }
}
