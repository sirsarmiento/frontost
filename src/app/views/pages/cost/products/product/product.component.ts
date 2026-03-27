import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/core/models/Cost/product';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['nombre', 'sku', 'medida', 'clasificacion', 'perfil','actions'];
  dataSource: MatTableDataSource<Product>;
    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  allProducts: Product[] = [];

  constructor(
    private productService: ProductService, 
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(){
    this.productService.getAll().subscribe(( resp => {
         this.allProducts = resp.data;
         this.initTable(resp.data);
      }
    ));
  }

  initTable(product: Product[]){
    this.dataSource = new MatTableDataSource(product);
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

  onEdit(row: Product){
    this.router.navigate(['/products/add-product']);
    this.productService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/products/add-product']);
  }

  onDelete(id:number, nombre: string){
      Swal.fire({
        title:  `¿ Estás seguro que deseas eliminar ${ nombre }?`,
        showDenyButton: true,
        confirmButtonText: `Eliminar`,
      }).then((result) => {
        if (result.isConfirmed){
        this.allProducts.forEach((element,index)=>{
          if(element.id==id) {
            this.productService.deleteProduct(id)
            .then(() => {
              // Solo si la eliminación fue exitosa
              this.allProducts.splice(index, 1);
              this.initTable(this.allProducts);
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
