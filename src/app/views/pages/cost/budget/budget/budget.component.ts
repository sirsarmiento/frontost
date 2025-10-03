import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Budget } from 'src/app/core/models/Cost/budge';
import { BudgetService } from 'src/app/core/services/Cost/budget.service';
import { ModalGenericComponent } from 'src/app/views/shared/components/modal-generic/modal-generic.component';


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html'
})
export class BudgetComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['clasificacion', 'descripcion', 'numero','fecha', 'actions'];
  dataSource: MatTableDataSource<Budget>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private budgetService: BudgetService, 
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getBudges();
  }

  getBudges(){
    this.budgetService.getAll().subscribe(( resp => {
        this.initTable(resp.data);
      }
    ));
  }

  initTable(budge: Budget[]){
    this.dataSource = new MatTableDataSource(budge);
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

  onEdit(row: Budget){
    this.router.navigate(['/budgets/add-budget']);
    this.budgetService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/budgets/add-budget']);
  }

  onFormule(row: Budget){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "report-payment";
      dialogConfig.width = "60%";
      dialogConfig.data = { item: row };
  
      const modalDialog = this.matDialog.open(ModalGenericComponent, dialogConfig);
      modalDialog.afterClosed().subscribe();
  }
}
