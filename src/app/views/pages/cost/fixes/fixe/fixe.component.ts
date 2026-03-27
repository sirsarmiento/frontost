import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Fixe } from 'src/app/core/models/Cost/fixe';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixe',
  templateUrl: './fixe.component.html'
})
export class FixeComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['tipo', 'concepto', 'precio', 'clasificacion', 'producto', 'actions'];

  // Dos dataSources separados
  dataSourceFijos: MatTableDataSource<Fixe>;
  dataSourceVariables: MatTableDataSource<Fixe>;

  // Dos pares de Paginator y Sort (uno para cada tabla)
  @ViewChild('paginatorFijos') paginatorFijos: MatPaginator;
  @ViewChild('sortFijos', { static: false }) sortFijos: MatSort;

  @ViewChild('paginatorVariables') paginatorVariables: MatPaginator;
  @ViewChild('sortVariables', { static: false }) sortVariables: MatSort;

  allFixes: Fixe[] = [];

  constructor(
    private fixeService: FixeService,
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.fixeService.getAll().subscribe(( resp => {
         //console.log('RESP.DATA:', resp.data);
         this.allFixes = resp.data;
         this.initTables(resp.data);
      }
    ));
  }

  initTables(data: Fixe[]){
    // Filtrar datos para Fijos
    const fijos = data.filter(item => item.tipo === 'Fijo');
    this.dataSourceFijos = new MatTableDataSource(fijos);
    this.dataSourceFijos.paginator = this.paginatorFijos;
    this.dataSourceFijos.sort = this.sortFijos;

    // Filtrar datos para Variables
    const variables = data.filter(item => item.tipo === 'Variable');
    this.dataSourceVariables = new MatTableDataSource(variables);
    this.dataSourceVariables.paginator = this.paginatorVariables;
    this.dataSourceVariables.sort = this.sortVariables;

    this.loading = false;
    
    // Configurar textos de paginación
    if (this.paginatorFijos) {
      this.paginatorFijos._intl.itemsPerPageLabel = 'Filas';
    }
    if (this.paginatorVariables) {
      this.paginatorVariables._intl.itemsPerPageLabel = 'Filas';
    }
  }

  applyFilterFijos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFijos.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceFijos.paginator) {
      this.dataSourceFijos.paginator.firstPage();
    }
  }

  applyFilterVariables(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceVariables.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceVariables.paginator) {
      this.dataSourceVariables.paginator.firstPage();
    }
  }

  onEdit(row: Fixe){
    this.router.navigate(['/fixes/add-fixe']);
    this.fixeService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/fixes/add-fixe']);
  }

  onDelete(id:number, concepto: string){
    Swal.fire({
      title:  `¿ Estás seguro que deseas eliminar ${ concepto }?`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed){
      this.allFixes.forEach((element,index)=>{
        if(element.id==id) {
          this.fixeService.deleteFixe(id)
          .then(() => {
            // Solo si la eliminación fue exitosa
            this.allFixes.splice(index, 1);
            this.initTables(this.allFixes);
          })
          .catch(error => {
            console.error('Error al eliminar:', error);
            // Opcional: mostrar mensaje de error al usuario
          });
        }});
      }
    })
  }
}
